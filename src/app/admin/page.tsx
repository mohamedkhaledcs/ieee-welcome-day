"use client";

import { AlertTriangle, Monitor } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Hearts } from "@/components/ui/Hearts";
import { gameIds, MAX_ATTEMPTS } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/context";
import { useProgress } from "@/lib/progress/context";

export default function AdminPage() {
  const { t } = useLanguage();
  const { progress, hydrated } = useProgress();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm border border-amber-500/20 mb-4">
          <Monitor className="h-4 w-4" />
          {t.admin.localOnly}
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          {t.admin.title}
        </h1>
      </div>

      <Card padding="lg" className="mb-6 border-amber-500/20">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-foreground-muted text-sm leading-relaxed">
              {t.admin.disclaimer}
            </p>
            <p className="text-foreground-muted/70 text-xs mt-2">
              {t.admin.resetNote}
            </p>
          </div>
        </div>
      </Card>

      {!hydrated ? (
        <p className="text-center text-foreground-muted">{t.common.loading}</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <Card padding="md">
              <p className="text-sm text-foreground-muted mb-1">{t.admin.points}</p>
              <p className="text-2xl font-bold text-accent-blue">{progress.points}</p>
            </Card>
            <Card padding="md">
              <p className="text-sm text-foreground-muted mb-1">{t.admin.badges}</p>
              <p className="text-2xl font-bold text-accent-cyan">
                {progress.badges.length}
              </p>
            </Card>
            <Card padding="md">
              <p className="text-sm text-foreground-muted mb-1">{t.admin.sound}</p>
              <p className="text-lg font-semibold text-foreground">
                {progress.soundEnabled ? t.admin.enabled : t.admin.disabled}
              </p>
            </Card>
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-4">
            {t.admin.attemptsTitle}
          </h2>
          <div className="space-y-4">
            {gameIds.map((id) => {
              const game = progress.games[id];
              return (
                <Card key={id} padding="md">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {t.games[id].name}
                      </h3>
                      <p className="text-xs text-foreground-muted mt-1">
                        {t.attempts.used}: {game.attemptsUsed} |{" "}
                        {game.completed ? t.challenges.completed : "—"}
                        {game.lastResult && ` | ${game.lastResult}`}
                      </p>
                    </div>
                    <Hearts remaining={game.attemptsRemaining} total={MAX_ATTEMPTS} showLabel={false} />
                  </div>
                </Card>
              );
            })}
          </div>

          {(progress.badges.length > 0 || progress.rewards.length > 0) && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {t.admin.progressTitle}
              </h2>
              {progress.badges.length > 0 && (
                <Card padding="md" className="mb-4">
                  <p className="text-sm text-foreground-muted mb-2">{t.admin.badges}</p>
                  <div className="flex flex-wrap gap-2">
                    {progress.badges.map((b) => (
                      <span
                        key={b}
                        className="text-xs px-2 py-1 rounded-full bg-accent-blue/10 text-accent-blue"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
              {progress.rewards.length > 0 && (
                <Card padding="md">
                  <p className="text-sm text-foreground-muted mb-2">{t.admin.rewards}</p>
                  <div className="flex flex-wrap gap-2">
                    {progress.rewards.map((r) => (
                      <span
                        key={r}
                        className="text-xs px-2 py-1 rounded-full bg-accent-cyan/10 text-accent-cyan"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
