import { SENTINEL_VERSIONS } from "../models/commons";

export default {
  localCacheTtl: 10800 as number, // 3 hours
  CSDS_DOMAIN: {
    QA: "hc1n.dev.lprnd.net",
    PROD: "api.liveperson.net"
  },
  LP_SERVICES: {
    CSDS: "csds",
    SENTINEL: "sentinel"
  },
  CUSTOM_ENDPOINT_APP_SCOPE: "ihub.tpb.customendpoint",
  SENTINEL_API: {
    ALGORITHMS: ["RS256"],
    KEY_ISSUER: "Sentinel",
    DEFAULT_VERSION: SENTINEL_VERSIONS.V1, // Config to use Sentinel `v1` or `v2` api to authentication and authorization
    V1_PUBLIC_KEY: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvNDIU1yUm+8MF/IC1JmhOiuXHOt3hKmY1IYMfgEWlGhNhze3wrayhbMebJfFUesiy9q3tuzK/AbJyvO7xZK2XC9UC1kOWyqHPcNKh1uVPTkSrR/2j+sdeR0H8qVS+mIqS7nDjA+rrkuztzaUMmiqg/W35XG5jAsDhtfYiSTgjxEYKJYn94ec+RnYR8Gdt8il+GszlOSg2fuBjlSpG4YMM7TOSoq1VBn7GamU72lSN4w9kmw2GtTk9Q9g8niY1AqPKARbDZ/xS4RJEy4F/HUvRCvjtXUXDtzd1yzRxNbyX4/twSz0cqAW6nRjAyHdxT3kIowj3+qx5wlDltNH/6DhBwIDAQAB
-----END PUBLIC KEY-----` // Public API key for Sentinel v1 More info: https://developers.liveperson.com/oauth-2-0-client-credentials.html
  }
};
