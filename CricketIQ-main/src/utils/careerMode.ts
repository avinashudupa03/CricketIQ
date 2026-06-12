export interface CareerProfile {
  playerId: string;
  xp: number;
  level: CareerLevel;
  badges: Badge[];
  matchesPlayed: number;
  achievements: Achievement[];
}

export type CareerLevel = 'Local Player' | 'District Player' | 'State Player' | 'National Player' | 'Legend';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: string;
}

const XP_THRESHOLDS: Record<CareerLevel, number> = {
  'Local Player': 0,
  'District Player': 100,
  'State Player': 500,
  'National Player': 2000,
  'Legend': 5000,
};

const LEVEL_ORDER: CareerLevel[] = ['Local Player', 'District Player', 'State Player', 'National Player', 'Legend'];

export function getLevelForXP(xp: number): CareerLevel {
  let level: CareerLevel = 'Local Player';
  for (const l of LEVEL_ORDER) {
    if (xp >= XP_THRESHOLDS[l]) level = l;
  }
  return level;
}

export function getXPProgress(xp: number): { current: number; needed: number; percentage: number } {
  const level = getLevelForXP(xp);
  const levelIndex = LEVEL_ORDER.indexOf(level);
  const nextLevel = LEVEL_ORDER[levelIndex + 1];

  if (!nextLevel) return { current: xp, needed: XP_THRESHOLDS[level], percentage: 100 };

  const currentThreshold = XP_THRESHOLDS[level];
  const nextThreshold = XP_THRESHOLDS[nextLevel];
  const progress = xp - currentThreshold;
  const needed = nextThreshold - currentThreshold;

  return { current: progress, needed, percentage: Math.round((progress / needed) * 100) };
}

export function calculateMatchXP(player: { runs: number; wickets: number; average: number; strikeRate: number; economy: number; role: string }): number {
  let xp = 0;
  xp += Math.min(player.runs * 0.1, 50);
  xp += player.wickets * 25;
  if (player.average > 50) xp += 15;
  if (player.strikeRate > 80) xp += 10;
  if (player.economy > 0 && player.economy < 4) xp += 15;
  if (player.role === 'All-rounder' && player.runs > 100 && player.wickets > 2) xp += 30;
  return Math.round(xp);
}

export const ALL_BADGES: Badge[] = [
  { id: 'centurion', name: 'Centurion', description: 'Score 100+ runs in a match', icon: ' Hundred', earned: false },
  { id: 'five-wicket', name: 'Five Star', description: 'Take 5+ wickets in a match', icon: '5W', earned: false },
  { id: 'double-ton', name: 'Double Century', description: 'Score 200+ runs in an innings', icon: '200', earned: false },
  { id: 'hat-trick', name: 'Hat Trick Hero', description: 'Take 3 wickets in 3 balls', icon: '3W', earned: false },
  { id: 'all-rounder-gold', name: 'All-Rounder Gold', description: '100+ runs and 3+ wickets in a match', icon: 'AR+', earned: false },
  { id: 'economy-master', name: 'Economy Master', description: 'Bowling economy under 3.0', icon: 'Eco', earned: false },
  { id: 'streak-5', name: 'Win Streak', description: '5 consecutive match wins', icon: '5W', earned: false },
  { id: 'veteran', name: 'Veteran', description: 'Play 100+ career matches', icon: '100', earned: false },
  { id: 'legend-status', name: 'Legend Status', description: 'Reach Legend career level', icon: 'LEG', earned: false },
  { id: 'iron-man', name: 'Iron Man', description: 'Play 50 consecutive matches', icon: '50M', earned: false },
];

export const LEVEL_COLORS: Record<CareerLevel, string> = {
  'Local Player': 'text-slate-400 border-slate-500/30 bg-slate-500/10',
  'District Player': 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  'State Player': 'text-boundary-400 border-boundary-500/30 bg-boundary-500/10',
  'National Player': 'text-pitch-400 border-pitch-500/30 bg-pitch-500/10',
  'Legend': 'text-willow-400 border-willow-500/30 bg-willow-500/10',
};

export const LEVEL_GLOW: Record<CareerLevel, string> = {
  'Local Player': '',
  'District Player': '',
  'State Player': '',
  'National Player': 'shadow-[0_0_15px_rgba(34,197,94,0.2)]',
  'Legend': 'shadow-[0_0_20px_rgba(234,179,8,0.3)]',
};
