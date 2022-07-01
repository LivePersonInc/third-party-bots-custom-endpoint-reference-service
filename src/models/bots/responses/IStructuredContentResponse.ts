import { IResponseBase } from "./IResponseBase";
import { IResponseType } from "./IResponseTypes";

export type StructuredContentData = {
  /**
   * `structuredContent` variable contains the Rich/Structured Content object More information:
   * @link https://developers.liveperson.com/getting-started-with-rich-messaging-introduction.html
   */
  structuredContent: object;
  encodedMetadata?: string;
  metadata?: Array<object>;
};

/**
 * Structured Content Response
 * @link https://developers.liveperson.com/third-party-bots-custom-endpoint-basic-content.html#sending-rich-content-structured-content
 */
export interface IStructuredContentResponse extends IResponseBase {
  type: IResponseType.STRUCTURED_CONTENT;
  data: StructuredContentData;
}
