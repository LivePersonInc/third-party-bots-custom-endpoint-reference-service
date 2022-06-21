import {
  JsonController,
  Param,
  Body,
  Get,
  Put,
  Post,
  NotFoundError,
  InternalServerError,
  BadRequestError,
  OnUndefined
} from "routing-controllers";
import {
  PutConversationRequestBody,
  PostConversationEventRequestBody,
  EventMessageType
} from "./requestBodies";
import {
  GetEnvironmentsResponseBody,
  GetStateResponseBody,
  PostConversationEventsResponseBody
} from "./responseBodies";
import { BotService } from "../services/BotService";
import { Environment } from "../models/environments/IEnvironment";
import { IResponseType } from "../models/bots/responses/IResponseTypes";
import { IRichContentEventData } from "../models/events/IRichContentEventData";
import { ITextEventData } from "../models/events/ITextEventData";
@JsonController("/bots")
export class BotController {
  botService: BotService;
  constructor() {
    this.botService = new BotService();
  }

  @Get("/:botId/environments")
  getEnvironments(@Param("botId") botId: string): GetEnvironmentsResponseBody {
    const environments = this.botService.findEnvironments(botId);
    if (environments && environments.length < 1) {
      throw new NotFoundError(`No environments found for the bot.`);
    }
    return environments;
  }

  @Get("/:botId/environments/:environmentId/state")
  getState(
    @Param("botId") botId: string,
    @Param("environmentId") environmentId: Environment
  ): GetStateResponseBody {
    const botState = this.botService.getState(botId, environmentId);
    if (!botState) {
      throw new NotFoundError(`Bot has no state for this environment.`);
    }
    return { state: botState, version: "1.0" };
  }

  @Put("/:botId/environments/:environmentId/conversations/:convId")
  @OnUndefined(204)
  putConversation(
    @Param("botId") botId: string,
    @Param("environmentId") environmentId: Environment,
    @Param("convId") convId: string,
    @Body() body: PutConversationRequestBody
  ): void {
    // check if the conversation exists in cache else create it and save information
    const creationSuccessful = this.botService.createConversation(
      botId,
      environmentId as Environment,
      convId,
      body.context,
      body.sdes || undefined // SDES can be found only if the bot was enabled to fetch engagement in TPB
    );

    if (!creationSuccessful) {
      throw new InternalServerError(`Conversation creation was not success`);
    }
  }

  @Post("/:botId/environments/:environmentId/conversations/:convId/events")
  fetchConversationEvents(
    @Param("botId") botId: string,
    @Param("environmentId") environmentId: Environment,
    @Param("convId") convId: string,
    @Body() body: PostConversationEventRequestBody
  ): PostConversationEventsResponseBody {
    const bot = this.botService.findBot(botId, environmentId);
    // Bot was not found
    if (!bot) {
      throw new NotFoundError(`Bot not found for the given environment.`);
    }

    const { type, data } = body;
    // Currently we only support Text and Rich Content events sent by customer

    switch (type) {
      case EventMessageType.RICH_CONTENT:
        this.botService.fetchConversationRichContentEvents(
          botId,
          data as IRichContentEventData
        );
        break;
      case EventMessageType.TEXT:
        this.botService.fetchConversationTextEvents(
          botId,
          data as ITextEventData
        );
        break;
      case EventMessageType.START:
        return this.botService.fetchSurveyEvents(EventMessageType.START, data);
        break;
      case EventMessageType.CLOSE_CONVERSATION:
        return this.botService.fetchSurveyEvents(
          EventMessageType.CLOSE_CONVERSATION,
          data
        );
        break;
      default:
        throw new BadRequestError(
          `Supported Conversation events are only '${EventMessageType.TEXT}', '${EventMessageType.START}', ${EventMessageType.CLOSE_CONVERSATION} and ${EventMessageType.RICH_CONTENT}`
        );
    }

    return {
      response: [
        { type: "TEXT" as IResponseType.TEXT, data: { message: "Hello" } }
      ],
      analytics: { intents: [] }
    };
  }
}
