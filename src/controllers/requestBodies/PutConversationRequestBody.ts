export interface PutConversationRequestBody {
  sdes: Object;
  context: {
    type: string;
    skillId: number;
    engagementId: number;
    campaignId: number;
    contextType: number;
    visitor: Object;
  };
}
