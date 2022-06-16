import { IBot } from "../models/bots/IBot";
import { Environment } from "../models/environments/IEnvironment";
import { State } from "../models/states/IState";
import { Bots } from "../models/bots"; // all the bots that we have for this service

export class BotService {
  constructor() {}

  findBot(botId: string, environment: Environment): IBot | null {
    const environmentBots = Bots.get(environment) || [];
    return environmentBots.find((bot) => bot.getId() === botId) || null;
  }

  findEnvironments(botId: string): Array<Environment> {
    return Array.from(Bots.keys()).filter((environmentName) => {
      const environmentBots = Bots.get(environmentName) || [];
      const environmentBot = environmentBots.find(
        (bot) => bot.getId() === botId
      );
      return !!environmentBot;
    });
  }

  getState(botId: string, environment: Environment): State | null {
    const foundBot = this.findBot(botId, environment);
    if (foundBot) {
      return foundBot.getState() as State;
    }
    return null;
  }
  createConversation(_botId: string, _conversationId: string) {}

  addConversationEvent(_botId: string, _event: Object): Object {
    return {};
  }
}
