"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Cpu,
  Globe,
  HelpCircle,
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
  bgGlow: string;
}

const CARD_PAIRS = [
  {
    pairId: "code",
    labelAr: "البرمجة",
    labelEn: "Coding",
    icon: Code2,
    color: "#38bdf8",
    bgGlow: "rgba(56, 189, 248, 0.2)",
  },
  {
    pairId: "security",
    labelAr: "الأمن السيبراني",
    labelEn: "Cyber Security",
    icon: ShieldCheck,
    color: "#34d399",
    bgGlow: "rgba(52, 211, 153, 0.2)",
  },
  {
    pairId: "hardware",
    labelAr: "المعالجات والعتاد",
    labelEn: "Hardware",
    icon: Cpu,
    color: "#fbbf24",
    bgGlow: "rgba(251, 191, 36, 0.2)",
  },
  {
    pairId: "network",
    labelAr: "الويب والشبكات",
    labelEn: "Web & Network",
    icon: Globe,
    color: "#a855f7",
    bgGlow: "rgba(168, 85, 247, 0.2)",
  },
];

function generateShuffledCards(): CardItem[] {
  const cards: CardItem[] = [];
  let idCounter = 1;

  CARD_PAIRS.forEach((pair) => {
    // Add two instances for the pair (total 8 cards)
    cards.push({ id: idCounter++, ...pair });
    cards.push({ id: idCounter++, ...pair });
  });

  // Fisher-Yates shuffle
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

  // Initialize game
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
    // Prevent clicking during comparison, already flipped, already matched, or game locked
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

        // Check if all 4 pairs matched
        if (nextMatched.length === CARD_PAIRS.length) {
          updateGame("flip", { completed: true, lastResult: "win" });
          addBadge("قوة الذاكرة");
          addPoints(50);
          setTimeout(() => {
            setShowSuccess(true);
          }, 600);
        }
      } else {
        // MISMATCH: wait 900ms then flip back
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
        {/* Game Stats */}
        <div className="w-full flex items-center justify-between gap-4 mb-4 text-xs sm:text-sm font-semibold text-foreground-muted">
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

        {/* 8 Cards Grid (4 columns x 2 rows on tablet/desktop, 2 columns x 4 rows or 4x2 on mobile) */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-md sm:max-w-xl">
          {cards.map((card) => {
            const isFlipped =
              flippedIds.includes(card.id) || matchedPairs.includes(card.pairId);
            const isMatched = matchedPairs.includes(card.pairId);
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                className="aspect-square perspective-1000"
              >
                <motion.button
                  onClick={() => handleCardClick(card)}
                  disabled={isMatched || isProcessing || attemptsRemaining <= 0}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full h-full rounded-2xl border transition-all duration-300 relative transform-style-3d cursor-pointer ${
                    isFlipped
                      ? "rotate-y-180"
                      : "border-border bg-card hover:border-accent-blue/50 hover:shadow-glow"
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
                      : "Card back"
                  }
                >
                  {/* Card Back (Hidden state) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl flex flex-col items-center justify-center p-3 backface-hidden bg-gradient-to-b from-[#0a1628] to-[#050b18] border border-border"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue">
                      <HelpCircle className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-bold text-foreground-muted/60 mt-1 uppercase tracking-widest">
                      IEEE
                    </span>
                  </div>

                  {/* Card Front (Revealed state) */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-2xl flex flex-col items-center justify-center p-3 backface-hidden border ${
                      isMatched
                        ? "border-green-500/60 bg-green-950/20 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                        : "border-accent-cyan/60 bg-[#071324] shadow-[0_0_12px_rgba(34,211,238,0.25)]"
                    }`}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div
                      className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center mb-1 shadow-inner"
                      style={{ backgroundColor: card.bgGlow }}
                    >
                      <Icon
                        className="h-7 w-7 sm:h-8 sm:w-8"
                        style={{ color: card.color }}
                      />
                    </div>
                    <span
                      className="text-xs sm:text-sm font-bold text-center leading-tight"
                      style={{ color: card.color }}
                    >
                      {lang === "ar" ? card.labelAr : card.labelEn}
                    </span>
                  </div>
                </motion.button>
              </div>
            );
          })}
        </div>

        {/* Reset button */}
        <div className="mt-6 text-center">
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
