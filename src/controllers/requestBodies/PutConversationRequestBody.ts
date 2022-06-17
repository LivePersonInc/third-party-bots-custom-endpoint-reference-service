import { ISDES, IConversationContext } from "../../models/commons";

export interface PutConversationRequestBody {
  sdes?: ISDES;
  context: IConversationContext;
}
