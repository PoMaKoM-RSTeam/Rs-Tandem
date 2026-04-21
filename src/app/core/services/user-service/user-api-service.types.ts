export type UserRank = {
  name: string;
  minXp: number;
  maxXp: number;
  nextRankName: string;
};

export type UserProfile = {
  userId: string;
  displayName: string;
  totalXp: number;
  totalCompletedLevels: number;
  currentStreak: number;
  maxStreak: number;
  globalRankPosition: number;
  rank: UserRank | null;
};

export type UserActivityHub = {
  current_streak: number;
  max_streak: number;
  activity_dates: string[];
};

export type DatabaseUserFullProfileRow = {
  user_id: string;
  display_name: string;
  total_xp: number;
  total_completed_levels: number;
  current_streak: number;
  max_streak: number;
  leaderboard_position: number;
  rank_name: string;
  rank_min_xp: number;
  rank_max_xp: number;
  next_rank_name: string;
};

export type User = {
  id: string;
  email: string | undefined;
  displayName: string;
  avatarUrl: string | null;
  bio: string;
};
