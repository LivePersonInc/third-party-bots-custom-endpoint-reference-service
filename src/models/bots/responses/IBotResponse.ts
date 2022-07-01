import { ITextResponse } from "./ITextResponse";
import { IStructuredContentResponse } from "./IStructuredContentResponse";
import { IActionResponse } from "./IActionResponse";
import { IDelayResponse } from "./IDelayResponse";
export type IBotResponse = Array<
  ITextResponse | IStructuredContentResponse | IActionResponse | IDelayResponse
>;
