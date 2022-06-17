export type BaseURI = {
  service: string;
  account: string;
  baseURI: string;
};

export type CSDSResponse = {
  baseURIs: Array<BaseURI>;
};

export interface IConversationContext {
  type: string;
  skillId: number;
  engagementId: number;
  campaignId: number;
  contextType: number;
  visitor: Object;
  assignedAgentId: string;
  // ....Conversation context can contain more information
}

export interface ISDES {
  authenticatedSdes: object;
  unauthenticatedSdes: object;
}
