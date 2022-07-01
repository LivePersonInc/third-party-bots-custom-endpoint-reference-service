import { IResponseBase } from "./IResponseBase";
import { IResponseType } from "./IResponseTypes";

export type DelayData = {
  seconds: number;
  typing: boolean;
};

/**
 * Delay Message response:
 * @link https://developers.liveperson.com/third-party-bots-custom-endpoint-advanced-features.html#sending-pausedelay-message
 */
export interface IDelayResponse extends IResponseBase {
  type: IResponseType.DELAY;
  data: DelayData;
}
