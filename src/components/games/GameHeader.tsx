"use client";

import { ArrowLeft, ArrowRight, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { Hearts } from "@/components/ui/Hearts";
import { MAX_ATTEMPTS } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/context";
import { useProgress } from "@/lib/progress/context";

interface GameHeaderProps {
  title: string;
  description: string;
  attemptsRemaining: number;
}

export function GameHeader({
  title,
  description,
  attemptsRemaining,
}: GameHeaderProps) {
  const { t, lang } = useLanguage();
  const { progress, toggleSound } = useProgress();

  const BackArrow = lang === "ar" ? ArrowRight : ArrowLeft;

  return (
    <div className="mb-6 w-full">
      <div className="flex items-center justify-between gap-4 mb-4">
        <Link
          href="/challenges"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground-muted hover:text-accent-blue transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
        >
          <BackArrow className="h-4 w-4" />
          <span>{t.common.returnChallenges}</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-xl border border-border bg-card/60 text-foreground-muted hover:text-foreground hover:bg-white/5 transition-colors"
            title={progress.soundEnabled ? t.common.soundOff : t.common.soundOn}
            aria-label={progress.soundEnabled ? t.common.soundOff : t.common.soundOn}
          >
            {progress.soundEnabled ? (
              <Volume2 className="h-4 w-4 text-accent-cyan" />
            ) : (
              <VolumeX className="h-4 w-4 text-foreground-muted" />
            )}
          </button>
          <Hearts remaining={attemptsRemaining} total={MAX_ATTEMPTS} size="md" />
        </div>
      </div>

      <div className="text-center sm:text-start border-b border-border/60 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-1 text-sm text-foreground-muted leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
