"use client";

import {
  CheckCircle2,
  Code2,
  Cpu,
  Globe,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { GameHeader } from "./GameHeader";
import { LockedModal } from "./LockedModal";
import { SuccessModal } from "./SuccessModal";
import { useLanguage } from "@/lib/i18n/context";
import { useProgress } from "@/lib/progress/context";
import { sounds } from "@/lib/sounds";

interface CardItem {
  id: number;
  pairId: string;
  labelAr: string;
  labelEn: string;
  icon: typeof Code2;
  color: string;
  borderColor: string;
  glowColor: string;
  bgGradient: string;
}

const CARD_PAIRS = [
  {
    pairId: "code",
    labelAr: "Front-End",
    labelEn: "Front-End",
    icon: Code2,
    color: "#38bdf8",
    borderColor: "rgba(56, 189, 248, 0.6)",
    glowColor: "rgba(56, 189, 248, 0.35)",
    bgGradient: "from-sky-950/60 to-slate-900/90",
  },
  {
    pairId: "security",
    labelAr: "Cyber Security",
    labelEn: "Cyber Security",
    icon: ShieldCheck,
    color: "#34d399",
    borderColor: "rgba(52, 211, 153, 0.6)",
    glowColor: "rgba(52, 211, 153, 0.35)",
    bgGradient: "from-emerald-950/60 to-slate-900/90",
  },
  {
    pairId: "hardware",
    labelAr: "Embedded & Hardware",
    labelEn: "Hardware & IoT",
    icon: Cpu,
    color: "#fbbf24",
    borderColor: "rgba(251, 191, 36, 0.6)",
    glowColor: "rgba(251, 191, 36, 0.35)",
    bgGradient: "from-amber-950/60 to-slate-900/90",
  },
  {
    pairId: "network",
    labelAr: "Web & Networks",
    labelEn: "Web & Networks",
    icon: Globe,
    color: "#c084fc",
    borderColor: "rgba(192, 132, 252, 0.6)",
    glowColor: "rgba(192, 132, 252, 0.35)",
    bgGradient: "from-purple-950/60 to-slate-900/90",
  },
];

function generateShuffledCards(): CardItem[] {
  const cards: CardItem[] = [];
  let idCounter = 1;

  CARD_PAIRS.forEach((pair) => {
    // Two cards per pair (8 cards total)
    cards.push({ id: idCounter++, ...pair });
    cards.push({ id: idCounter++, ...pair });
  });

  // Fisher-Yates Shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

export function FlipGame() {
  const { t, lang } = useLanguage();
  const {
    getGameAttempts,
    consumeAttempt,
    updateGame,
    addBadge,
    addPoints,
    hydrated,
  } = useProgress();

  const attemptsRemaining = hydrated ? getGameAttempts("flip") : 3;

  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize new game session
  const startNewGame = useCallback(() => {
    setCards(generateShuffledCards());
    setFlippedIds([]);
    setMatchedPairs([]);
    setIsProcessing(false);
    setMoves(0);
    setShowSuccess(false);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleCardClick = (card: CardItem) => {
    // Strictly prevent invalid clicks:
    // - during mismatch delay
    // - card already flipped
    // - card already matched
    // - attempts exhausted
    if (
      isProcessing ||
      flippedIds.includes(card.id) ||
      matchedPairs.includes(card.pairId) ||
      attemptsRemaining <= 0
    ) {
      return;
    }

    sounds.playFlip();

    const newFlipped = [...flippedIds, card.id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsProcessing(true);

      const firstCard = cards.find((c) => c.id === newFlipped[0])!;
      const secondCard = card;

      if (firstCard.pairId === secondCard.pairId) {
        // MATCH!
        sounds.playCorrect();
        const nextMatched = [...matchedPairs, firstCard.pairId];
        setMatchedPairs(nextMatched);
        setFlippedIds([]);
        setIsProcessing(false);

        // Check if all 4 pairs are matched
        if (nextMatched.length === CARD_PAIRS.length) {
          updateGame("flip", { completed: true, lastResult: "win" });
          addBadge("قوة الذاكرة");
          addPoints(50);
          setTimeout(() => {
            setShowSuccess(true);
          }, 600);
        }
      } else {
        // MISMATCH: Show cards for 900ms then flip back smoothly
        setTimeout(() => {
          sounds.playTick();
          setFlippedIds([]);
          setIsProcessing(false);
        }, 900);
      }
    }
  };

  const handleReset = () => {
    if (matchedPairs.length === CARD_PAIRS.length || attemptsRemaining <= 0) return;
    consumeAttempt("flip");
    sounds.playWrong();
    startNewGame();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <GameHeader
        title={t.games.flip.name}
        description={t.games.flip.description}
        attemptsRemaining={attemptsRemaining}
      />

      <div className="flex flex-col items-center">
        {/* Game Stats Bar */}
        <div className="w-full flex items-center justify-between gap-4 mb-5 text-xs sm:text-sm font-semibold text-foreground-muted">
          <div className="flex items-center gap-1.5 text-accent-cyan">
            <Sparkles className="h-4 w-4" />
            <span>
              {matchedPairs.length} {t.games.flip.pairsOf} {t.games.flip.pairsFound}
            </span>
          </div>

          <div className="text-foreground-muted">
            {t.games.flip.moves}: {moves}
          </div>
        </div>

        {/* 8 Cards Grid: 4 columns x 2 rows (tablet/desktop) & 2x4 on small phones */}
        <div
          dir="ltr"
          className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 max-w-md sm:max-w-xl select-none"
        >
          {cards.map((card) => {
            const isFlipped =
              flippedIds.includes(card.id) || matchedPairs.includes(card.pairId);
            const isMatched = matchedPairs.includes(card.pairId);
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                className="aspect-[3/3.6] sm:aspect-square"
                style={{ perspective: "1000px" }}
              >
                <div
                  role="button"
                  tabIndex={isMatched || isProcessing ? -1 : 0}
                  onClick={() => handleCardClick(card)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleCardClick(card);
                    }
                  }}
                  className={`w-full h-full relative cursor-pointer outline-none transition-transform duration-500 rounded-2xl ${
                    isMatched ? "cursor-default" : "hover:scale-[1.02]"
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                  aria-label={
                    isFlipped
                      ? lang === "ar"
                        ? card.labelAr
                        : card.labelEn
                      : "Card hidden"
                  }
                >
                  {/* Card Back Face (Hidden Face) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl p-3 flex flex-col items-center justify-center border border-border bg-gradient-to-b from-[#0a1628] to-[#040914] shadow-card transition-all duration-200"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(0deg)",
                    }}
                  >
                    {/* Glowing circuit ring */}
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center text-accent-cyan shadow-[0_0_15px_rgba(59,130,246,0.2)] mb-2">
                      <span className="text-xl sm:text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-accent-cyan to-accent-blue">
                        ⚡
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-extrabold tracking-widest uppercase text-foreground-muted/70">
                      IEEE OCS
                    </span>
                  </div>

                  {/* Card Front Face (Revealed Face) */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-2xl p-3 flex flex-col items-center justify-center border bg-gradient-to-b ${card.bgGradient} transition-all duration-300 ${
                      isMatched
                        ? "border-green-500/80 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                        : "border-accent-cyan/70 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                    }`}
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    {/* Icon container */}
                    <div
                      className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center mb-2 shadow-inner"
                      style={{
                        backgroundColor: card.glowColor,
                        border: `1px solid ${card.borderColor}`,
                      }}
                    >
                      <Icon
                        className="h-7 w-7 sm:h-8 sm:w-8"
                        style={{ color: card.color }}
                      />
                    </div>

                    {/* Track Title */}
                    <span
                      className="text-xs sm:text-sm font-bold text-center leading-tight tracking-wide"
                      style={{ color: card.color }}
                    >
                      {lang === "ar" ? card.labelAr : card.labelEn}
                    </span>

                    {/* Matched check badge */}
                    {isMatched && (
                      <span className="absolute top-2 end-2 text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset / Retry Button */}
        <div className="mt-7 text-center">
          <Button
            onClick={handleReset}
            disabled={matchedPairs.length === CARD_PAIRS.length || attemptsRemaining <= 0}
            variant="secondary"
            size="sm"
            className="gap-2 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>
              {lang === "ar"
                ? "إعادة الخلط (تستهلك محاولة)"
                : "Restart Game (Consumes 1 Attempt)"}
            </span>
          </Button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          rewardTitle={`${t.games.flip.pairsFound}: 4/4 (${moves} ${t.games.flip.moves})`}
          onClose={() => setShowSuccess(false)}
        />
      )}

      {/* Out of attempts modal */}
      {attemptsRemaining <= 0 && !showSuccess && (
        <LockedModal challengeName={t.games.flip.name} />
      )}
    </div>
  );
}
