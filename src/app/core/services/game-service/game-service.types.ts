export type GlobalRecord = {
  userName: string;
  bestScore: number;
  updatedAt: string;
};

export type DatabaseRecordRow = {
  best_score: number;
  updated_at: string;
  user_stats:
    | {
        display_name: string;
      }
    | {
        display_name: string;
      }[];
};
