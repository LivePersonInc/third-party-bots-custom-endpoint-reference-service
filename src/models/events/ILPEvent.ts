export enum MessageAudience {
  ALL = "ALL",
}

export interface ILPEvent {
  sequence: number;
  serverTimestamp: number;
  event: object;
  conversationId: string;
  dialogId: string;
  metadata: Array<object>;
  messageAudience: MessageAudience;
  // .... Other RAW LP Content Event properties
}
