import { IBot } from "../models/bots/IBot";
import { ISDES, IConversationContext } from "../models/commons";
import { Environment } from "../models/environments/IEnvironment";
import { State } from "../models/states/IState";
import { Bots } from "../models/bots"; // all the bots that we have for this service
import LocalCache from "../utils/Cache";

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

  createConversation(
    botId: string,
    environmentId: Environment,
    conversationId: string,
    conversationContext: IConversationContext,
    sdes?: ISDES | undefined
  ): boolean {
    // Saving Conversation information like context and sdes for future use
    // Ensure to save also SDES as they are sent only once in Create Conversation method
    const conversationCacheKey = `conversation:${botId}:${environmentId}:${conversationId}`;

    // if exists send true else create conversation entry and send back response
    return LocalCache.get("conversationCacheKey")
      ? true
      : LocalCache.set(conversationCacheKey, { conversationContext, sdes });
  }

  fetchConversationEvents(_botId: string, _event: Object): Object {
    return {};
  }
}
