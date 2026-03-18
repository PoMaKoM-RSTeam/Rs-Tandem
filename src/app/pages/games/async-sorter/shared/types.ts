export const TASK_TYPES = {
  sync: 'sync',
  micro: 'micro',
  macro: 'macro',
} as const;

export type TaskType = (typeof TASK_TYPES)[keyof typeof TASK_TYPES];

export type CodeBlockData = {
  code: string;
  taskType: TaskType;
  executionOrder: number;
};

export type CodeBlockDroppedPayload = {
  codeBlockData: CodeBlockData;
  bucketTaskType: TaskType;
};
