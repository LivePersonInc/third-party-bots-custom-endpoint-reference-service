export interface PostConversationEventRequestBody {
  type: string;
  data: {
    message: string;
  };
  context: {
    lpEvent: Object;
  };
}
