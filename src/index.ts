import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import * as bodyParser from "body-parser";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";

dotenv.config();

const app: Express = express();
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
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Log the Error response *NOTE ROUTES SHOULD GO BEFORE THIS*
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  })
);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
