export const ROLES = {
  user: 'user',
  model: 'model',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export type ExamLanguage = 'en' | 'ru';

export type Message = {
  role: Role;
  parts: { text: string }[];
};

export type GeminiResponse = {
  isExamFinished: boolean;
  isExamPassed: boolean;
  message: string;
  score: number;
};
