export type ChatRole = 'assistant' | 'user';

export type ChatWsMessage = { type: 'chunk'; text: string } | { type: 'done' } | { type: 'error'; message: string };

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: Date;
};
