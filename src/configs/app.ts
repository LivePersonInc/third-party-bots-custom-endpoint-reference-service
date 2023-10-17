import { SENTINEL_VERSIONS } from "../models/commons";

export default {
  localCacheTtl: 10800 as number, // 3 hours
  /**
   * CSDS service domains are different for QA and Production accounts/sites
   */
  CSDS_DOMAIN: {
    QA: "hc1n.dev.lprnd.net",
    PROD: "api.liveperson.net"
  },
  LP_SERVICES: {
    CSDS: "csds",
    SENTINEL: "sentinel"
  },
  /**
   * The scope that is used for checking the validity of the request. This is expected to be changed later
   * in future. Keep checking our official documentation:
   * https://developers.liveperson.com/third-party-bots-custom-endpoint-introduction.html
   */
  CUSTOM_ENDPOINT_APP_SCOPE_DEPRECATED: "ihub.tpb.customendpoint",
  CUSTOM_ENDPOINT_APP_SCOPE: "thirdpartybots.customendpoint.bot",
  SENTINEL_API: {
    ALGORITHMS: ["RS256"],
    KEY_ISSUER: "Sentinel",
    /**
     * This configuration tells which version of Sentinel OAuth we are using which is V1 currently.
     * In Future this will be changed to V2.
     */
    DEFAULT_VERSION: SENTINEL_VERSIONS.V1,
    /**
     * INFO: Please auth part of this service implementation uses OAuth V1 Public Key of Sentinel API. Please keep in mind that
     * public keys are different for accounts zone (Alpha, QA, Production). If you are developing Custom Endpoint Service
     * please ensure that you are using valid Public Key for your zone. If Public API Key is not valid you will get 401 error
     * response and our security middleware implementation will not be able to verify the JWT. If you are not sure
     * about this please ask Customer Representative of LivePerson for your account to help you with this.
     *
     * This below API key is taken from  https://developers.liveperson.com/oauth-2-0-client-credentials.html
     * */
    V1_PUBLIC_KEY: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvNDIU1yUm+8MF/IC1JmhOiuXHOt3hKmY1IYMfgEWlGhNhze3wrayhbMebJfFUesiy9q3tuzK/AbJyvO7xZK2XC9UC1kOWyqHPcNKh1uVPTkSrR/2j+sdeR0H8qVS+mIqS7nDjA+rrkuztzaUMmiqg/W35XG5jAsDhtfYiSTgjxEYKJYn94ec+RnYR8Gdt8il+GszlOSg2fuBjlSpG4YMM7TOSoq1VBn7GamU72lSN4w9kmw2GtTk9Q9g8niY1AqPKARbDZ/xS4RJEy4F/HUvRCvjtXUXDtzd1yzRxNbyX4/twSz0cqAW6nRjAyHdxT3kIowj3+qx5wlDltNH/6DhBwIDAQAB\t
-----END PUBLIC KEY-----`
  },

  /**
   * Different Bots Ids that are used in this service implementations
   */
  BOTS: {
    online: "5809777a-e548-4bd2-bc5f-a1003c132a28",
    offline: "36d5de7f-6c83-41ba-836d-28ca1062c1ef",
    error: "42773157-adcf-4ec1-a2ae-9b935d80cb81",
    draft: "213aa6c6-f6d9-11ec-b939-0242ac120002",
    maintenance: "bfb807d6-f6d8-11ec-b939-0242ac120002"
  }
};
