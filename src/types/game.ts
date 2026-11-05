export type GameMode = 'social' | 'ousado' | 'capetinha-roxo';
export type Difficulty = 'facil' | 'media' | 'ousada' | 'epica';
export type ChallengeCategory =
  | 'quebra-gelo'
  | 'investigação social'
  | 'bar e bebidas'
  | 'foto e vídeo'
  | 'redes sociais'
  | 'flerte'
  | 'romance'
  | 'dança e performance'
  | 'bilhetes e mensagens'
  | 'missões épicas';
export type ChallengeStatus =
  | 'active'
  | 'completed'
  | 'passed'
  | 'skipped'
  | 'extra-completed'
  | 'extra-declined'
  | 'group-completed'
  | 'bonus';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: Difficulty;
  points: number;
  modes: GameMode[];
  extraCardEligible: boolean;
  active: boolean;
}

export interface GroupChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  active: boolean;
  completedPlayerIds?: string[];
}

export interface GroupChallengeHistoryItem {
  id: string;
  challenge: GroupChallenge;
  pointsPerPlayer: number;
  completedPlayerIds: string[];
  completedAt: string;
}

export interface ChallengeHistoryItem {
  id: string;
  challenge: Challenge | null;
  status: ChallengeStatus;
  pointsEarned: number;
  label?: string;
  completedAt: string;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  score: number;
  completedChallenges: number;
  usedSlots: number;
  passesRemaining: number;
  activeChallenge: Challenge | null;
  history: ChallengeHistoryItem[];
  consecutiveCompletions: number;
  extraCardUnlocked: boolean;
  extraCardUsed: boolean;
  extraCardChallenge: Challenge | null;
  status: 'playing' | 'finished';
  order: number;
}

export interface PlayerDraft {
  name: string;
  color: string;
}

export interface Game {
  id: string;
  name: string;
  mode: GameMode;
  players: Player[];
  status: 'setup' | 'playing' | 'finished';
  createdAt: string;
  finishedAt?: string;
  activeGroupChallenge?: GroupChallenge | null;
  groupChallengeHistory?: GroupChallengeHistoryItem[];
  usedGroupChallengeIds?: string[];
}

export interface RankingEntry extends Player {
  skippedSlots: number;
}

export interface ScoreEvent {
  label: string;
  points: number;
}
