export const TASK_TYPES = {
  sync: 'sync',
  micro: 'micro',
  macro: 'macro',
} as const;

export type TaskType = (typeof TASK_TYPES)[keyof typeof TASK_TYPES];
