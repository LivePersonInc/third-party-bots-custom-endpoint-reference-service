import NodeCache from "node-cache";
import AppConfig from "../configs/app";

type Key = string | number;

export class Cache {
  private static instance: Cache;

  private cache: NodeCache;

  private constructor(ttlSeconds: number) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache(AppConfig.localCacheTtl);
    }
    return Cache.instance;
  }

  public get<T>(key: Key): T | undefined {
    return this.cache.get<T>(key);
  }

  public set<T>(key: Key, value: T, ttl?: number | string | undefined): void {
    if (ttl) {
      this.cache.set(key, value, ttl);
    }
    this.cache.set(key, value);
  }
}

export default Cache.getInstance();
