import { ErrorType } from './error-type.enum';

export type CaseDifficulty = 'Junior' | 'Middle' | 'Senior';

export type ExpectedError = {
  line: number;
  type: ErrorType;
  message: string;
  points: number;
  fixPattern: string;
  fixHint: string;
};

export type ReviewCase = {
  id: string;
  category: string;
  difficulty: CaseDifficulty;
  title: string;
  code: string;
  expectedErrors: ExpectedError[];
};
