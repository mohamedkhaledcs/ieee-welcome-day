"use client";

import type { GameId } from "@/lib/constants";
import { sounds } from "@/lib/sounds";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  const [progress, setProgress] = useState<ProgressState>(() => {
    if (typeof window !== "undefined") {
      return loadProgress();
    }
    return createDefaultProgress();
  });
  const [hydrated, setHydrated] = useState(false);
  const progressRef = useRef<ProgressState>(progress);
  progressRef.current = progress;

  useEffect(() => {
    const loaded = loadProgress();
    setProgress(loaded);
    progressRef.current = loaded;
    sounds.setEnabled(loaded.soundEnabled);
    setHydrated(true);
  }, []);

  const getGameAttempts = useCallback(
    (gameId: GameId) => getAttempts(progress, gameId),
    [progress]
  );

  const consumeAttempt = useCallback(
    (gameId: GameId): boolean => {
      const current = progressRef.current;
      const { nextState, consumed } = consumeAttemptStorage(current, gameId);
      if (consumed) {
        progressRef.current = nextState;
        setProgress(nextState);
      }
      return consumed;
    },
    []
  );

  const updateGame = useCallback(
    (gameId: GameId, update: Partial<GameProgress>) => {
      const current = progressRef.current;
      const nextState = updateGameProgress(current, gameId, update);
      progressRef.current = nextState;
      setProgress(nextState);
    },
    []
  );

  const setPoints = useCallback((points: number) => {
    const next = { ...progressRef.current, points };
    progressRef.current = next;
    saveProgress(next);
    setProgress(next);
  }, []);

  const addPoints = useCallback((amount: number) => {
    const next = {
      ...progressRef.current,
      points: progressRef.current.points + amount,
    };
    progressRef.current = next;
    saveProgress(next);
    setProgress(next);
  }, []);

  const addBadge = useCallback((badge: string) => {
    if (progressRef.current.badges.includes(badge)) return;
    const next = {
      ...progressRef.current,
      badges: [...progressRef.current.badges, badge],
    };
    progressRef.current = next;
    saveProgress(next);
    setProgress(next);
  }, []);

  const addReward = useCallback((reward: string) => {
    if (progressRef.current.rewards.includes(reward)) return;
    const next = {
      ...progressRef.current,
      rewards: [...progressRef.current.rewards, reward],
    };
    progressRef.current = next;
    saveProgress(next);
    setProgress(next);
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    sounds.setEnabled(enabled);
    const next = { ...progressRef.current, soundEnabled: enabled };
    progressRef.current = next;
    saveProgress(next);
    setProgress(next);
  }, []);

  const toggleSound = useCallback(() => {
    const nextEnabled = !progressRef.current.soundEnabled;
    sounds.setEnabled(nextEnabled);
    if (nextEnabled) {
      sounds.playClick();
    }
    const next = { ...progressRef.current, soundEnabled: nextEnabled };
    progressRef.current = next;
    saveProgress(next);
    setProgress(next);
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
