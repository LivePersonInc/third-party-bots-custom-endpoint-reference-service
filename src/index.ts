import express, { Express } from "express";
import {
  Action,
  useExpressServer,
  UnauthorizedError,
  BadRequestError
} from "routing-controllers";
import { BotController } from "./controllers";
import dotenv from "dotenv";
import { decode } from "jsonwebtoken";
import * as bodyParser from "body-parser";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import "reflect-metadata";
import { IJwt } from "./models/jwt";
import { SecurityMiddleware } from "./middlewares/SecurityMiddleware";
import configApp from "./configs/app";
dotenv.config();

const app: Express = express();

// Log the HTTP requests
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.json(),
      winston.format.colorize()
    )
  })
);

useExpressServer(app, {
  authorizationChecker: async (action: Action) => {
    const authHeader = action.request.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        
        ...
 }

    if (!token) {
      throw new UnauthorizedError("Not authorized to do this action");
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
      throw new BadRequestError("Not allowed to do this action");
    }

    await SecurityMiddleware.validateAuthentication(token, decodedToken);

    // Set the valid auth info to the request chain for access later
    action.request.auth = decodedToken;

    return true;
  },
  currentUserChecker: (action: Action) => action.request.auth,
  cors: true,
  routePrefix: "/v1",
  controllers: [BotController] // we specify controllers we want to use in the application
});

const port = process.env.PORT;

app.use(bodyParser.json());

// Log the Error response *NOTE ROUTES SHOULD GO BEFORE THIS*
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.json(),
      winston.format.colorize()
    )
  })
);

app
  .listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  })
  .on("error", function () {
    process.once("SIGUSR2", function () {
      process.kill(process.pid, "SIGUSR2");
    });
    process.on("SIGINT", function () {
      // this is only called on ctrl+c, not restart
      process.kill(process.pid, "SIGINT");
    });
  });
