import { gameIds, MAX_ATTEMPTS, type GameId } from "@/lib/constants";
import {
  LEGACY_STORAGE_KEY,
  PROGRESS_STORAGE_KEY,
  PROGRESS_VERSION,
  type GameProgress,
  type ProgressState,
} from "./types";

function createDefaultGameProgress(): GameProgress {
  return {
    attemptsRemaining: MAX_ATTEMPTS,
    attemptsUsed: 0,
    completed: false,
  };
}

export function createDefaultProgress(): ProgressState {
  const games = gameIds.reduce(
    (acc, id) => {
      acc[id] = createDefaultGameProgress();
      return acc;
    },
    {} as Record<GameId, GameProgress>
  );

  return {
    version: PROGRESS_VERSION,
    games,
    points: 0,
    badges: [],
    rewards: [],
    soundEnabled: true,
  };
}

function isValidGameProgress(value: unknown): value is GameProgress {
  if (!value || typeof value !== "object") return false;
  const g = value as Record<string, unknown>;
  return (
    typeof g.attemptsRemaining === "number" &&
    !isNaN(g.attemptsRemaining) &&
    typeof g.attemptsUsed === "number" &&
    !isNaN(g.attemptsUsed) &&
    typeof g.completed === "boolean"
  );
}

function mergeWithDefaults(partial: Partial<ProgressState>): ProgressState {
  const defaults = createDefaultProgress();

  const games = { ...defaults.games };
  if (partial && partial.games && typeof partial.games === "object") {
    for (const id of gameIds) {
      const candidate = partial.games[id];
      if (isValidGameProgress(candidate)) {
        games[id] = {
          ...defaults.games[id],
          ...candidate,
          attemptsRemaining: Math.max(
            0,
            Math.min(MAX_ATTEMPTS, Math.floor(candidate.attemptsRemaining))
          ),
          attemptsUsed: Math.max(0, Math.floor(candidate.attemptsUsed)),
          completed: Boolean(candidate.completed),
        };
      }
    }
  }

  return {
    version: PROGRESS_VERSION,
    games,
    points:
      typeof partial?.points === "number" && !isNaN(partial.points)
        ? Math.max(0, partial.points)
        : 0,
    badges: Array.isArray(partial?.badges)
      ? partial!.badges.filter((b): b is string => typeof b === "string")
      : [],
    rewards: Array.isArray(partial?.rewards)
      ? partial!.rewards.filter((r): r is string => typeof r === "string")
      : [],
    soundEnabled:
      typeof partial?.soundEnabled === "boolean" ? partial.soundEnabled : true,
  };
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") {
    return createDefaultProgress();
  }

  try {
    let raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) {
      // Check legacy key
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    }
    if (!raw) return createDefaultProgress();

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return createDefaultProgress();
    }

    const state = mergeWithDefaults(parsed as Partial<ProgressState>);
    // Ensure migrated state is saved under the new key
    saveProgress(state);
    return state;
  } catch {
    return createDefaultProgress();
  }
}

export function saveProgress(state: ProgressState): boolean {
  if (typeof window === "undefined") return false;

  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function getAttempts(state: ProgressState, gameId: GameId): number {
  return state.games[gameId]?.attemptsRemaining ?? MAX_ATTEMPTS;
}

export function consumeAttempt(
  state: ProgressState,
  gameId: GameId
): { nextState: ProgressState; consumed: boolean } {
  const game = state.games[gameId];
  if (!game || game.attemptsRemaining <= 0) {
    return { nextState: state, consumed: false };
  }

  const nextState: ProgressState = {
    ...state,
    games: {
      ...state.games,
      [gameId]: {
        ...game,
        attemptsRemaining: Math.max(0, game.attemptsRemaining - 1),
        attemptsUsed: game.attemptsUsed + 1,
        lastPlayedAt: Date.now(),
      },
    },
  };

  saveProgress(nextState);
  return { nextState, consumed: true };
}

export function updateGameProgress(
  state: ProgressState,
  gameId: GameId,
  update: Partial<GameProgress>
): ProgressState {
  const current = state.games[gameId] ?? createDefaultGameProgress();
  const nextState: ProgressState = {
    ...state,
    games: {
      ...state.games,
      [gameId]: { ...current, ...update },
    },
  };

  saveProgress(nextState);
  return nextState;
}
