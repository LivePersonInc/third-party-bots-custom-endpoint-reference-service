import * as axios from "axios";
import NodCache, { Cache } from "../utils/Cache";
import AppConfig from "../configs/app";
import { CSDSResponse } from "../models/commons";
import crypto from "crypto";

/**
 * The Singleton class defines the `getInstance` method that lets clients access
 * the unique singleton instance.
 */
class LivePersonService {
  private static instance: LivePersonService;
  private cache: Cache;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor(cache: Cache) {
    this.cache = cache;
  }
  /**
   * Create a Hash key from the passed object
   * @param {object}}  object that will be used to create a Hash key for cache
   *
   * @returns {string}
   */
  public static createHashedKey(args: object): string {
    return crypto
      .createHash("sha1")
      .update(JSON.stringify(args))
      .digest("base64");
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the LivePersonService class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): LivePersonService {
    if (!LivePersonService.instance) {
      LivePersonService.instance = new LivePersonService(NodCache);
    }

    return LivePersonService.instance;
  }

  /**
   * Get data from cache or if it doesn't exist, make a GET request
   * @param {string} path - Request endpoint
   * @param {axios.AxiosRequestConfig | null} options - HTTP options
   * @param {string} apiName - API name
   * @param {number | undefined} ttl - Time to Live in cache in seconds
   *
   * @returns {Promise<any>}
   */
  public async performCachedGet(
    path: string,
    options: object | null,
    apiName: string,
    ttl?: number | undefined
  ): Promise<any> {
    const cacheKey = LivePersonService.createHashedKey({
      path,
      options,
      apiName,
    });
    const cachedValue = this.cache.get(cacheKey);

    if (!cachedValue) {
      console.log("could not find data in cache, loading now", {
        path,
        apiName,
      });

      const { data } = await axios.default.get(path, options || undefined);
      this.cache.set(cacheKey, data, ttl);
      return data;
    }

    console.log("found data in cache", { path, apiName });
    return cachedValue;
  }

  /**
   * Get a service domain from the cached domains for a specific Account ID
   * @param {string} accountId - Account ID
   * @param {string} service - Service name
   *
   * @returns {Promise<string>} - Service Base URI
   */
  public async getDomain(accountId: string, service: string): Promise<string> {
    try {
      const { baseURIs } = (await this.getAllDomains(
        accountId
      )) as CSDSResponse;

      const { baseURI } = baseURIs.find((uri) => uri.service === service) || {};

      if (!baseURI) throw new Error(`Service ${service} not found`);

      return baseURI;
    } catch (exception) {
      console.log(
        `found an error in getDomain for ${accountId} and service ${service}`,
        exception
      );

      throw exception;
    }
  }

  /**
   * Retrieve all service domains for a specific Account ID
   * @param {string} accountId - Account ID
   *
   * @returns {Promise<CSDSResponse>}
   */
  public async getAllDomains(accountId: string): Promise<CSDSResponse> {
    let csdsDomain = AppConfig.CSDS_DOMAIN.PROD;

    if (accountId.startsWith("le") || accountId.startsWith("qa")) {
      csdsDomain = AppConfig.CSDS_DOMAIN.QA;
    }

    const path = `http://${csdsDomain}/api/account/${accountId}/service/baseURI.json?version=1.0`;

    try {
      return this.performCachedGet(path, null, AppConfig.LP_SERVICES.CSDS);
    } catch (exception) {
      console.log(`found an error in getAllDomain for ${accountId}`, exception);
      throw exception;
    }
  }
  /**
   * Get Public keys for Sentinel API v2
   * @param {string} accountId - Account ID
   *
   * @returns {Promise<object>} - Keys Object
   */
  public async getPublicKeys(accountId: string): Promise<string> {
    try {
      const baseURI: string = await this.getDomain(
        accountId,
        AppConfig.LP_SERVICES.SENTINEL
      );

      const path = `https://${baseURI}/sentinel/well-known/jwks`;

      const response = await this.performCachedGet(
        path,
        null,
        AppConfig.LP_SERVICES.SENTINEL,
        300
      );
      return response;
    } catch (exception) {
      console.log(
        `found an error in getPublicKeys for ${accountId} `,
        exception
      );

      throw exception;
    }
  }
}

export default LivePersonService.getInstance();
