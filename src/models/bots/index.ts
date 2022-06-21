import { Environment } from "../environments/IEnvironment";
import { DefaultBot } from "./DefaultBot";
import { IBot } from "./IBot";

const botMap = new Map<Environment, Array<IBot>>();
botMap.set(Environment.draft, [
  new DefaultBot("default"),
  new DefaultBot("error")
]);
botMap.set(Environment.alpha, [new DefaultBot("maintenance")]);
botMap.set(Environment.production, [
  new DefaultBot("prodBot"),
  new DefaultBot("error"),
  new DefaultBot("offline")
]);

export const Bots: Map<Environment, Array<IBot>> = botMap;
