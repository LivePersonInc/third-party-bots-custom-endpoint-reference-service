export type BaseURI = {
  service: string;
  account: string;
  baseURI: string;
};

export type CSDSResponse = {
  baseURIs: Array<BaseURI>;
};
