"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import {
  CircleDot,
  CheckCircle,
  Gamepad2,
  Grid3X3,
  HelpCircle,
  Layers,
  Search,
  Sparkles,
  Lock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Hearts } from "@/components/ui/Hearts";
import { gameIds, type GameId } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/context";
import { useProgress } from "@/lib/progress/context";

interface ChallengeMeta {
  id: GameId;
  icon: typeof CircleDot;
  image?: string;
  gradient: string;
  badge: string;
}

const challengeMetas: Record<GameId, ChallengeMeta> = {
  wheel: {
    id: "wheel",
    icon: CircleDot,
    gradient: "from-blue-600/30 via-cyan-500/20 to-blue-900/40",
    badge: "🎡 8 مكافآت",
  },
  quiz: {
    id: "quiz",
    icon: HelpCircle,
    gradient: "from-indigo-600/30 via-purple-500/20 to-blue-900/40",
    badge: "🧠 90+ سؤال",
  },
  puzzle: {
    id: "puzzle",
    icon: Layers,
    image: "/images/puzzle1.png",
    gradient: "from-cyan-600/30 via-blue-500/20 to-slate-900/40",
    badge: "🧩 3×3 قطع",
  },
  flip: {
    id: "flip",
    icon: Grid3X3,
    gradient: "from-sky-600/30 via-teal-500/20 to-indigo-900/40",
    badge: "🃏 4 أزواج",
  },
  wordsearch: {
    id: "wordsearch",
    icon: Search,
    gradient: "from-blue-700/30 via-cyan-600/20 to-slate-900/40",
    badge: "🔍 6 كلمات",
  },
};

const gameRoutes: Record<GameId, string> = {
  wheel: "/challenges/wheel",
  quiz: "/challenges/quiz",
  puzzle: "/challenges/puzzle",
  flip: "/challenges/flip",
  wordsearch: "/challenges/wordsearch",
};

export default function ChallengesPage() {
  const { t, lang } = useLanguage();
  const { getGameAttempts, hydrated, progress } = useProgress();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 text-accent-cyan text-xs font-semibold border border-accent-blue/20 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>IEEE OCS SB Challenge Zone</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-3 tracking-tight">
            {t.challenges.title}
          </h1>
          <p className="text-foreground-muted max-w-xl mx-auto text-sm sm:text-base">
            {t.challenges.subtitle}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gameIds.map((id, i) => {
            const meta = challengeMetas[id];
            const Icon = meta.icon;
            const remaining = hydrated ? getGameAttempts(id) : 3;
            const completed = progress.games[id]?.completed;
            const noAttempts = remaining <= 0;

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card
                  hover
                  padding="md"
                  className={clsx(
                    "h-full flex flex-col relative overflow-hidden transition-all duration-300",
                    completed && "border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.1)]",
                    noAttempts && !completed && "opacity-80 border-red-500/20"
                  )}
                >
                  {/* Visual Banner */}
                  <div className={`relative mb-4 aspect-video rounded-xl overflow-hidden bg-gradient-to-br ${meta.gradient} border border-white/5 flex items-center justify-center`}>
                    {meta.image ? (
                      <Image
                        src={meta.image}
                        alt={t.games[id].name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="relative z-10 flex flex-col items-center justify-center">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-glow backdrop-blur-sm">
                          <Icon className="h-12 w-12 text-accent-cyan" />
                        </div>
                      </div>
                    )}

                    {/* Gradient Overlay for Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />

                    {/* Badges Top Bar */}
                    <div className="absolute top-2 start-2 end-2 flex items-center justify-between pointer-events-none">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/60 text-white/90 border border-white/10 backdrop-blur-md">
                        {meta.badge}
                      </span>
                      {completed && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-500/30 text-green-300 border border-green-500/40 backdrop-blur-md">
                          <CheckCircle className="h-3 w-3" />
                          <span>{t.challenges.completed}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mb-2">
                    <h3 className="text-xl font-bold text-foreground">
                      {t.games[id].name}
                    </h3>
                    <p className="text-xs text-accent-cyan/80 font-medium uppercase tracking-wider">
                      {lang === "ar"
                        ? id === "wheel"
                          ? "Spin the Wheel"
                          : id === "quiz"
                          ? "Quiz Challenge"
                          : id === "puzzle"
                          ? "Logo Puzzle"
                          : id === "flip"
                          ? "Flip Cards"
                          : "Word Search"
                        : t.games[id].name}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-foreground-muted mb-4 flex-1 leading-relaxed">
                    {t.games[id].description}
                  </p>

                  {/* Attempts & Hearts */}
                  <div className="mb-4 pt-3 border-t border-border/50 flex items-center justify-between">
                    <span className="text-xs text-foreground-muted font-medium">
                      {t.attempts.remaining}
                    </span>
                    <Hearts remaining={remaining} size="sm" showLabel={false} />
                  </div>

                  {/* Action Button */}
                  {noAttempts ? (
                    <div className="text-center">
                      <Button variant="secondary" size="md" disabled fullWidth className="gap-2 text-xs">
                        <Lock className="h-4 w-4 text-red-400" />
                        <span>{t.challenges.noAttempts}</span>
                      </Button>
                    </div>
                  ) : (
                    <Link href={gameRoutes[id]} className="block">
                      <Button
                        size="md"
                        fullWidth
                        variant={completed ? "outline" : "primary"}
                        className="gap-2 font-bold"
                      >
                        <Gamepad2 className="h-4 w-4" />
                        <span>{completed ? t.completion.playAgain : t.challenges.startGame}</span>
                      </Button>
                    </Link>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
