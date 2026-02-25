import { GolfRank } from '../types/golf-rank';

export const GOLF_RANKS: GolfRank[] = [
  { maxBytes: 0, label: 'Empty', color: '#666', icon: '⌨️', width: 0 },
  { maxBytes: 50, label: 'Senior Architect', color: '#059669', icon: '👑', width: 100 },
  { maxBytes: 100, label: 'Middle Engineer', color: '#3498db', icon: '⚙️', width: 65 },
  { maxBytes: 200, label: 'Junior', color: '#d97706', icon: '🐣', width: 35 },
  { maxBytes: Infinity, label: 'Code Bloater', color: '#ad1313', icon: '💩', width: 15 },
];
