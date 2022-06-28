import { Environment } from "../environments/IEnvironment";
import { DefaultBot } from "./DefaultBot";
import { IBot } from "./IBot";
import * as configApp from "../../configs/app";

const botMap = new Map<Environment, Array<IBot>>();
botMap.set(Environment.draft, [new DefaultBot(configApp.default.BOTS.online)]);
botMap.set(Environment.alpha, [
  new DefaultBot(configApp.default.BOTS.maintenance)
]);
botMap.set(Environment.production, [
  new DefaultBot(configApp.default.BOTS.online),
  new DefaultBot(configApp.default.BOTS.draft),
  new DefaultBot(configApp.default.BOTS.error),
  new DefaultBot(configApp.default.BOTS.offline)
]);

export const Bots: Map<Environment, Array<IBot>> = botMap;
