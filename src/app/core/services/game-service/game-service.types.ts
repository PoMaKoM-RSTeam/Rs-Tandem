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

export type GamesProgressData = {
  title: string;
  total_levels: number;
  completed_levels_count: number;
  total_game_xp: number;
  game_rank_position: number;
};

export type LeaderboardEntry = {
  user_id: string;
  display_name: string;
  avatar_url: string;
  total_xp: number;
  current_streak: number;
  rank_name: string;
  rank_position: number;
};
