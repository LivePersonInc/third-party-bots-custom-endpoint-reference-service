import { IBot } from "./IBot";
import { State } from "../states/IState";
import * as configApp from "../../configs/app";
export class DefaultBot implements IBot {
  id: string;

  constructor(botId: string) {
    this.id = botId;
  }
  getVersion(): string {
    return "0.0.1";
  }

  getId(): string {
    return this.id;
  }

  getState(): string {
    let botState;
    switch (this.id) {
      case configApp.default.BOTS.error:
        botState = State.error;
        break;
      case configApp.default.BOTS.offline:
        botState = State.offline;
        break;
      case configApp.default.BOTS.maintenance:
        botState = State.maintenance;
        break;
      default:
        botState = State.online;
    }

    return botState;
  }
}
