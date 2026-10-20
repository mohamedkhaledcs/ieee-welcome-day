import type { GameId } from "@/lib/constants";

export const PROGRESS_STORAGE_KEY = "ieee-ocs-sb-challenge-v1";
export const LEGACY_STORAGE_KEY = "ieee-ocs-progress-v1";
export const PROGRESS_VERSION = 1;

export interface GameProgress {
  attemptsRemaining: number;
  attemptsUsed: number;
  bestScore?: number;
  completed: boolean;
  lastResult?: "win" | "lose" | "timeout";
  lastPlayedAt?: number;
}

export interface ProgressState {
  version: number;
  games: Record<GameId, GameProgress>;
  points: number;
  badges: string[];
  rewards: string[];
  soundEnabled: boolean;
}

export type GameProgressMap = Record<GameId, GameProgress>;
