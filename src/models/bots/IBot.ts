export type IBot = {
  id: string;
  getId(): string;
  getVersion(): string;
  getState(): string;
};
