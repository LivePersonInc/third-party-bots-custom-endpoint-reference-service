import { IAnalytic } from "./IAnalytic";
import { IBotResponse } from "../bots/responses/IBotResponse";

export interface IEventResponse {
  response: IBotResponse;
  analytics: IAnalytic;
}
