import { IRichContentEventData } from "../../models/events/IRichContentEventData";
import { IEventContext } from "../../models/events/IEventContext";
import { ITextEventData } from "../../models/events/ITextEventData";

export enum EventMessageType {
  TEXT = "TEXT",
  RICH_CONTENT = "RICH_CONTENT",
  START = "START",
  CLOSE_CONVERSATION = "CLOSE_CONVERSATION",
}

export enum EventSource {
  CONSUMER = "CONSUMER",
  CONVERSATION = "CONVERSATION",
}

export interface PostConversationEventRequestBody {
  type: EventMessageType;
  source: EventSource;
  data: ITextEventData | IRichContentEventData;
  context: IEventContext;
}
