import { ExpectedError } from './review-case.model';

export type LineState = {
  lineNumber: number;
  text: string;
  isFound: boolean;
  isWrongFlash: boolean;
  foundError: ExpectedError | null;
};
