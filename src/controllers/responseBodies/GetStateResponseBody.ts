import { State } from "../../models/states/IState";

export interface GetStateResponseBody {
  state: State;
  version: string;
}
