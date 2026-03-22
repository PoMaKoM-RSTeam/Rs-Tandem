export const ROLES = {
  user: 'user',
  assistant: 'assistant',
  system: 'system',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export type Message = {
  role: Role;
  content: string;
};
