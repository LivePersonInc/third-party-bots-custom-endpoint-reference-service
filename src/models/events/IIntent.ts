export interface Intent {
  id: string;
  description: string;
  confidenceScore: number;
}

export type IIntents = Array<Intent>;
