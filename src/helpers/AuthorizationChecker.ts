import {
  Action,
  UnauthorizedError,
  BadRequestError,
  ForbiddenError
} from "routing-controllers";
import { decode } from "jsonwebtoken";
import { IJwt } from "../models/jwt";
import { SecurityMiddleware } from "../middlewares/SecurityMiddleware";
import configApp from "../configs/app";

export default async function AuthorizationChecker(action: Action) {
  const authHeader = action.request.headers.authorization;

  if (!authHeader) {
    throw new ForbiddenError("You are not allowed to do this action");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError("Not authorized to perform this action");
  }

  const decodedToken = decode(token) as IJwt;

  if (!decodedToken) {
    throw new BadRequestError("Unable to identify the request");
  }

  // The following scope will fail if you move to V2 and our
  // This scope might also be changed in future release of custom endpoint
  if (
    decodedToken.scope &&
    decodedToken.scope !== configApp.CUSTOM_ENDPOINT_APP_SCOPE
  ) {
    throw new UnauthorizedError(
      "You have no permissions to perform this action"
    );
  }

  await SecurityMiddleware.validateAuthentication(token, decodedToken);

  // Set the valid auth info to the request chain for access later
  action.request.auth = decodedToken;

  return true;
}
