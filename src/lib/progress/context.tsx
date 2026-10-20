"use client";

import type { GameId } from "@/lib/constants";
import { sounds } from "@/lib/sounds";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { GameProgress, ProgressState } from "./types";
import {
  consumeAttempt as consumeAttemptStorage,
  createDefaultProgress,
  getAttempts,
  loadProgress,
  saveProgress,
  updateGameProgress,
} from "./storage";

interface ProgressContextValue {
  progress: ProgressState;
  hydrated: boolean;
  getGameAttempts: (gameId: GameId) => number;
  consumeAttempt: (gameId: GameId) => boolean;
  updateGame: (gameId: GameId, update: Partial<GameProgress>) => void;
  setPoints: (points: number) => void;
  addPoints: (amount: number) => void;
  addBadge: (badge: string) => void;
  addReward: (reward: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(createDefaultProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadProgress();
    setProgress(loaded);
    sounds.setEnabled(loaded.soundEnabled);
    setHydrated(true);
  }, []);

  const getGameAttempts = useCallback(
    (gameId: GameId) => getAttempts(progress, gameId),
    [progress]
  );

  const consumeAttempt = useCallback(
    (gameId: GameId): boolean => {
      let result = false;
      setProgress((prev) => {
        const { nextState, consumed } = consumeAttemptStorage(prev, gameId);
        result = consumed;
        return nextState;
      });
      return result;
    },
    []
  );

  const updateGame = useCallback(
    (gameId: GameId, update: Partial<GameProgress>) => {
      setProgress((prev) => updateGameProgress(prev, gameId, update));
    },
    []
  );

  const setPoints = useCallback((points: number) => {
    setProgress((prev) => {
      const next = { ...prev, points };
      saveProgress(next);
      return next;
    });
  }, []);

  const addPoints = useCallback((amount: number) => {
    setProgress((prev) => {
      const next = { ...prev, points: prev.points + amount };
      saveProgress(next);
      return next;
    });
  }, []);

  const addBadge = useCallback((badge: string) => {
    setProgress((prev) => {
      if (prev.badges.includes(badge)) return prev;
      const next = { ...prev, badges: [...prev.badges, badge] };
      saveProgress(next);
      return next;
    });
  }, []);

  const addReward = useCallback((reward: string) => {
    setProgress((prev) => {
      if (prev.rewards.includes(reward)) return prev;
      const next = { ...prev, rewards: [...prev.rewards, reward] };
      saveProgress(next);
      return next;
    });
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    sounds.setEnabled(enabled);
    setProgress((prev) => {
      const next = { ...prev, soundEnabled: enabled };
      saveProgress(next);
      return next;
    });
  }, []);

  const toggleSound = useCallback(() => {
    setProgress((prev) => {
      const nextEnabled = !prev.soundEnabled;
      sounds.setEnabled(nextEnabled);
      if (nextEnabled) {
        sounds.playClick();
      }
      const next = { ...prev, soundEnabled: nextEnabled };
      saveProgress(next);
      return next;
    });
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      hydrated,
      getGameAttempts,
      consumeAttempt,
      updateGame,
      setPoints,
      addPoints,
      addBadge,
      addReward,
      setSoundEnabled,
      toggleSound,
    }),
    [
      progress,
      hydrated,
      getGameAttempts,
      consumeAttempt,
      updateGame,
      setPoints,
      addPoints,
      addBadge,
      addReward,
      setSoundEnabled,
      toggleSound,
    ]
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return ctx;
}
