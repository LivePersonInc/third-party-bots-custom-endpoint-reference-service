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
  INVOKE_FUNCTION = "INVOKE_FUNCTION",
}

export type CloseAction = {
  name: Actions.CLOSE_CONVERSATION;
  // eslint-disable-next-line @typescript-eslint/ban-types
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

export type InvokeFunctionAction = {
  name: Actions.INVOKE_FUNCTION;
  parameters: {
    lambdaUuid: string;
    payload?: object;
  };
};

export type ActionData =
  | TransferActionWithAgent
  | TransferActionWithSkill
  | CloseAction
  | ChangeTTRAction
  | InvokeFunctionAction;

/**
 * Delay Message response:
 * @link https://developers.liveperson.com/third-party-bots-custom-endpoint-advanced-features.html#sending-pausedelay-message
 */
export interface IActionResponse extends IResponseBase {
  type: IResponseType.ACTION;
  data: ActionData;
}
