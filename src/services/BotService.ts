import { IBot } from "../models/bots/IBot";
import { ISDES, IConversationContext } from "../models/commons";
import { Environment } from "../models/environments/IEnvironment";
import { State } from "../models/states/IState";
import { Bots } from "../models/bots"; // all the bots that we have for this service
import LocalCache from "../utils/Cache";
import { ITextEventData } from "../models/events/ITextEventData";
import { IRichContentEventData } from "../models/events/IRichContentEventData";
import { ResponseFetcher } from "../utils/Response";
import { IEventResponse } from "../models/events/IEventResponse";
import { EventMessageType } from "../controllers/requestBodies";

/**
 * Bot Service Class for doing CRUD operation on a Bot
 */
export class BotService {
  /**
   * Get a Bot from passed botId and  environment from cache
   * @param {string} botId - Bot Identifier
   * @param {Environment} environment - Environment Identifier
   *
   * @returns {IBot | null} - Return Bot or null if not found
   */
  findBot(botId: string, environment: Environment): IBot | null {
    const environmentBots = Bots.get(environment) || [];
    return environmentBots.find(bot => bot.getId() === botId) || null;
  }
  /**
   * Get Environments of a given botId
   * @param {string} botId - Bot Identifier
   *
   * @returns {Array<Environment> | null} - Return Environments
   */
  findEnvironments(botId: string): Array<Environment> {
    return Array.from(Bots.keys()).filter(environmentName => {
      const environmentBots = Bots.get(environmentName) || [];
      const environmentBot = environmentBots.find(bot => bot.getId() === botId);
      return !!environmentBot;
    });
  }
  /**
   * Get State of a given botId and environment
   * @param {string} botId - Bot Identifier
   * @param {Environment} environment - Environment Identifier
   *
   * @returns {State | null} - Return Environments or null if nothing found
   */
  getState(botId: string, environment: Environment): State | null {
    const foundBot = this.findBot(botId, environment);
    if (foundBot) {
      return foundBot.getState() as State;
    }
    return null;
  }

  /**
   * Create Conversation instance in Local cache and also attach any passed SDES and Conversation context to instance
   * @param {string} botId - Bot Identifier
   * @param {Environment} environment - Environment Identifier
   * @param {string} conversationId - Conversation Identifier
   * @param {IConversationContext} conversationContext - Conversation context information
   * @param {ISDES} sdes - SDES that are passed
   *
   * @returns {boolean} - Return true if record saving was success
   */
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
    return LocalCache.get(conversationCacheKey)
      ? true
      : LocalCache.set(conversationCacheKey, { conversationContext, sdes });
  }

  /**
   * Get Conversation instance from local cache
   * @param {string} botId - Bot Identifier
   * @param {Environment} environment - Environment Identifier
   * @param {string} conversationId - Conversation Identifier
   *
   * @returns {Object | undefined} - Returns Conversation instance object contain sdes and conversation context if found otherwise undefined
   */
  getConversation(
    botId: string,
    environmentId: Environment,
    conversationId: string
  ): object | undefined {
    // Saving Conversation information like context and sdes for future use
    // Ensure to save also SDES as they are sent only once in Create Conversation method
    const conversationCacheKey = `conversation:${botId}:${environmentId}:${conversationId}`;

    // if exists send true else create conversation entry and send back response
    return LocalCache.get(conversationCacheKey);
  }

  /**
   * Get Conversation Responses for Rich Content Events
   * @param {string} _botId - Bot Identifier
   * @param {IRichContentEventData} eventData - Rich Content Event instance that was passed to service
   *
   * @returns {IEventResponse} - Returns bot response(s)
   */
  fetchConversationRichContentEvents(
    _botId: string,
    eventData: IRichContentEventData
  ): IEventResponse {
    return ResponseFetcher.getInstance().getConsumerRichContentEventResponse(
      eventData
    );
  }

  /**
   * Get Conversation Responses for textual consumer passed utterances
   * @param {string} _botId - Bot Identifier
   * @param {IRichContentEventData} eventData - Rich Content Event instance that was passed to service
   *
   * @returns {IEventResponse} - Returns bot response(s)
   */
  fetchConversationTextEvents(
    _botId: string,
    eventData: ITextEventData
  ): IEventResponse {
    return ResponseFetcher.getInstance().getConsumerTextResponse(
      eventData.message.toLocaleLowerCase()
    );
  }

  /**
   * Get Conversation Responses for passed survey events
   * @param {EventMessageType} type - Bot Identifier
   * @param {object} eventData - Rich Content Event instance that was passed to service
   *
   * @returns {IEventResponse} - Returns bot response(s)
   */
  fetchSurveyEvents(type: EventMessageType, eventData: object): IEventResponse {
    return ResponseFetcher.getInstance().getSurveyResponse(type, eventData);
  }
}
