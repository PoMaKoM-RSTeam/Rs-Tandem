import { GolfRank } from '../types/golf-rank';

export const GOLF_RANKS: GolfRank[] = [
  { maxBytes: 0, label: 'Empty', color: '#666', icon: '⌨️', width: 0 },
  { maxBytes: 50, label: 'Senior', color: '#059669', icon: '👑', width: 100 },
  { maxBytes: 100, label: 'Middle', color: '#3498db', icon: '⚙️', width: 75 },
  { maxBytes: 200, label: 'Junior', color: '#d97706', icon: '🐣', width: 50 },
  { maxBytes: Infinity, label: 'Code Bloater', color: '#ad1313', icon: '💩', width: 25 },
];
