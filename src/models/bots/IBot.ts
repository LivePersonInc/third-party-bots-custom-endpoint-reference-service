export type IBot = {
  id: string;
  getId(): string;
  getVersion(): string;
  getResponse(event: Object): Object;
  getState(): string;
};
