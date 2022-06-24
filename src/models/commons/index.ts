import { JWK } from "jwk-to-pem";
import { UnauthorizedError } from "routing-controllers";

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
  visitor: object;
  assignedAgentId: string;
  // ....Conversation context can contain more information
}

export interface ISDES {
  authenticatedSdes: object;
  unauthenticatedSdes: object;
}

export enum SENTINEL_VERSIONS {
  V1 = "v1",
  V2 = "v2"
}

export type PublicApiKeysResponse = {
  keys: Array<JWK>;
};

export class CustomUnauthorizedError extends UnauthorizedError {
  constructor(message?: string) {
    super(message);
  }
  errorData: unknown;
}
