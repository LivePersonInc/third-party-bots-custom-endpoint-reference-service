import express, { Express } from "express";
import { useExpressServer } from "routing-controllers";
import { BotController } from "./controllers";
import dotenv from "dotenv";
import * as bodyParser from "body-parser";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";

import "reflect-metadata";

dotenv.config();

const app: Express = express();

useExpressServer(app, {
  cors: true,
  routePrefix: "/v1",
  controllers: [BotController], // we specify controllers we want to use in the application
});

const port = process.env.PORT;

// Log the HTTP requests
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  })
);

app.use(bodyParser.json());

// Log the Error response *NOTE ROUTES SHOULD GO BEFORE THIS*
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console({})],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  })
);

app
  .listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  })
  .on("error", function (err) {
    process.once("SIGUSR2", function () {
      process.kill(process.pid, "SIGUSR2");
    });
    process.on("SIGINT", function () {
      // this is only called on ctrl+c, not restart
      process.kill(process.pid, "SIGINT");
    });
  });
