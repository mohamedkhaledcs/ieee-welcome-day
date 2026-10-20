"use client";

import { ArrowLeft, Construction } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Hearts } from "@/components/ui/Hearts";
import type { GameId } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/context";
import { useProgress } from "@/lib/progress/context";

interface GamePlaceholderProps {
  gameId: GameId;
}

export function GamePlaceholder({ gameId }: GamePlaceholderProps) {
  const { t } = useLanguage();
  const { getGameAttempts, hydrated } = useProgress();
  const game = t.games[gameId];
  const remaining = hydrated ? getGameAttempts(gameId) : 3;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/challenges"
          className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.common.back}
        </Link>
        <Hearts remaining={remaining} />
      </div>

      <Card padding="lg" className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-blue/10">
          <Construction className="h-8 w-8 text-accent-blue" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {game.name}
        </h1>
        <p className="text-foreground-muted mb-6">{game.description}</p>
        <p className="text-sm text-accent-cyan mb-8">{t.challenges.comingSoon}</p>
        <Link href="/challenges">
          <Button variant="secondary">{t.common.returnChallenges}</Button>
        </Link>
      </Card>
    </div>
  );
}
