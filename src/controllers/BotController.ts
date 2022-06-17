import {
  JsonController,
  Param,
  Body,
  Get,
  Put,
  Post,
  NotFoundError,
  InternalServerError,
  OnUndefined,
} from "routing-controllers";
import {
  PutConversationRequestBody,
  PostConversationEventRequestBody,
} from "./requestBodies";
import {
  GetEnvironmentsResponseBody,
  GetStateResponseBody,
} from "./responseBodies";
import { BotService } from "../services/BotService";
import { Environment } from "../models/environments/IEnvironment";
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
      throw new NotFoundError(`No enviorments found for the bot.`);
    }
    return environments;
  }

  @Get("/:botId/environments/:environmentId/state")
  getState(
    @Param("botId") botId: string,
    @Param("environmentId") environmentId: string
  ): GetStateResponseBody {
    const botState = this.botService.getState(
      botId,
      environmentId as Environment
    );
    if (!botState) {
      throw new NotFoundError(`Bot has no state for this environment.`);
    }
    return { state: botState, version: "1.0" };
  }

  @Put("/:botId/environments/:environmentId/conversations/:convId")
  @OnUndefined(204)
  putConversation(
    @Param("botId") botId: string,
    @Param("environmentId") environmentId: string,
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
    @Param("environmentId") environmentId: string,
    @Param("convId") convId: string,
    @Body() body: PostConversationEventRequestBody
  ): Object {
    return {};
  }
}
