export enum MessageAudience {
  ALL = "ALL",
  AGENTS_AND_MANAGERS = "AGENTS_AND_MANAGERS",
}

export interface ILPEvent {
  sequence: number;
  serverTimestamp: number;
  event: object;
  conversationId: string;
  dialogId: string;
  metadata: Array<object>;
  messageAudience: MessageAudience;
  lastConsumerMessage?: string;
  // .... Other RAW LP Content Event properties
}
