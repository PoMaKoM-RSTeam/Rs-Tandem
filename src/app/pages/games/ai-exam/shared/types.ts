export const ROLES = {
  user: 'user',
  model: 'model',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export type Message = {
  role: Role;
  parts: { text: string }[];
};
