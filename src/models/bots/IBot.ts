import { State } from "../states/IState";

export type IBot = {
  id: string;
  getId(): string;
  getVersion(): string;
  getState(): State;
};
