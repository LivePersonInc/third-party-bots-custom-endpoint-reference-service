import { RichContentEventData } from "../../models/events/IRichContentEventData";
import { IEventContext } from "../../models/events/IEventContext";
import { TextEventData } from "../../models/events/ITextEventData";

export enum EventMessageType {
  TEXT = "TEXT",
  RICH_CONTENT = "RICH_CONTENT",
}

export enum EventSource {
  CONSUMER = "CONSUMER",
}

export interface PostConversationEventRequestBody {
  type: EventMessageType;
  source: EventSource;
  data: TextEventData | RichContentEventData;
  context: IEventContext;
}
