import configApp from "../configs/app";
import * as LivePersonService from "../services/LivePersonService";
import { Algorithm, verify } from "jsonwebtoken";
import * as jwtToPem from "jwk-to-pem";
import { IJwt } from "../models/jwt";
import { CustomUnauthorizedError, SENTINEL_VERSIONS } from "../models/commons";

export class SecurityMiddleware {
  public static async validateAuthentication(
    token: string,
    decodedToken: IJwt
  ): Promise<void> {
    try {
      let publicKey = configApp.SENTINEL_API.V1_PUBLIC_KEY;
      if (configApp.SENTINEL_API.DEFAULT_VERSION === SENTINEL_VERSIONS.V2) {
        // Get keys for Sentinel V2
        const result = await LivePersonService.default.getPublicKeys(
          decodedToken.aud as string
        );

        if (
          result.keys &&
          Array.isArray(result.keys) &&
          result.keys.length > 0
        ) {
          // Multiple keys are return you can use anyone of them
          publicKey = jwtToPem.default(result.keys[0]);
        }
      }

      await verify(token, publicKey, {
        algorithms: configApp.SENTINEL_API.ALGORITHMS as Algorithm[],
        issuer: configApp.SENTINEL_API.KEY_ISSUER,
        audience: decodedToken.aud
      });
    } catch (err) {
      const error = new CustomUnauthorizedError(
        "Unable to verify the validity of your request"
      );
      error.errorData = err;

      throw error;
    }
  }
}
