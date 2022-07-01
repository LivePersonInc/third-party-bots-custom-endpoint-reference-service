import { IResponseBase } from "./IResponseBase";
import { IResponseType } from "./IResponseTypes";
import { MessageAudience } from "../../events/ILPEvent";

export type TextData = {
  message: string;
  encodedMetadata?: string;
  /**
   * `messageAudience` property decide if the text is going to be a normal text message
   * i.e. for All Participants or for Agents & Manager Private text only
   */
  messageAudience?: MessageAudience;
};

/**
 * Simple Text or Private Text Response
 * @link https://developers.liveperson.com/third-party-bots-custom-endpoint-advanced-features.html#sending-private-text-message
 */
export interface ITextResponse extends IResponseBase {
  type: IResponseType.TEXT;
  data: TextData;
}
