import { IBotResponse } from "../../models/bots/responses/IBotResponse";
import { IAnalytic } from "../../models/events/IAnalytic";

export interface PostConversationEventsResponseBody {
  response: IBotResponse;
  analytics: IAnalytic;
}
