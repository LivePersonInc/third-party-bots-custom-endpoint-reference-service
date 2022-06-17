import { IResponseBase } from "./IResponseBase";
import { IResponseType } from "./IResponseTypes";

export enum TTRTypes {
  URGENT = "URGENT",
  NORMAL = "NORMAL",
  PRIORITIZED = "PRIORITIZED",
}
export enum Actions {
  CLOSE_CONVERSATION = "CLOSE_CONVERSATION",
  TRANSFER = "TRANSFER",
  CHANGE_TTR = "CHANGE_TTR",
}

export type CloseAction = {
  name: Actions.CLOSE_CONVERSATION;
  parameters: {};
};

export type TransferActionWithSkill = {
  name: Actions.TRANSFER;
  parameters: { skillName: string };
};

export type TransferActionWithAgent = {
  name: Actions.TRANSFER;
  parameters: {
    skillName: string;
    agentId: string;
  };
};

export type ChangeTTRAction = {
  name: Actions.CHANGE_TTR;
  parameters: {
    ttrType: TTRTypes;
  };
};

export type ActionData =
  | TransferActionWithAgent
  | TransferActionWithSkill
  | CloseAction
  | ChangeTTRAction;

/**
 * Delay Message response:
 * @link https://developers.liveperson.com/third-party-bots-custom-endpoint-advanced-features.html#sending-pausedelay-message
 */
export interface IActionResponse extends IResponseBase {
  type: IResponseType.ACTION;
  data: ActionData;
}
