"use client";

import { motion } from "framer-motion";
import { Check, HelpCircle, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GameHeader } from "./GameHeader";
import { LockedModal } from "./LockedModal";
import { SuccessModal } from "./SuccessModal";
import { useLanguage } from "@/lib/i18n/context";
import { useProgress } from "@/lib/progress/context";
import { sounds } from "@/lib/sounds";

const GRID_SIZE = 3;
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE; // 9

// Helper to shuffle pieces ensuring it's not already solved
function generateShuffledPieces(): number[] {
  let pieces: number[];
  do {
    pieces = Array.from({ length: TOTAL_PIECES }, (_, i) => i);
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
  } while (isSolved(pieces));
  return pieces;
}

function isSolved(pieces: number[]): boolean {
  return pieces.every((val, idx) => val === idx);
}

export function PuzzleGame() {
  const { t, lang } = useLanguage();
  const {
    getGameAttempts,
    consumeAttempt,
    updateGame,
    addBadge,
    addPoints,
    hydrated,
  } = useProgress();

  const attemptsRemaining = hydrated ? getGameAttempts("puzzle") : 3;

  const [pieces, setPieces] = useState<number[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showReference, setShowReference] = useState(false);

  // Initialize shuffled board
  const startNewPuzzle = useCallback(() => {
    setPieces(generateShuffledPieces());
    setSelectedSlot(null);
    setMoves(0);
    setIsWon(false);
    setShowSuccess(false);
  }, []);

  useEffect(() => {
    startNewPuzzle();
  }, [startNewPuzzle]);

  const correctPiecesCount = useMemo(() => {
    return pieces.filter((val, idx) => val === idx).length;
  }, [pieces]);

  // Handle piece click / tap-to-swap
  const handleSlotClick = (index: number) => {
    if (isWon || attemptsRemaining <= 0) return;

    sounds.playClick();

    if (selectedSlot === null) {
      // First piece selected
      setSelectedSlot(index);
    } else if (selectedSlot === index) {
      // Deselect if tapped same piece
      setSelectedSlot(null);
    } else {
      // Swap pieces at selectedSlot and index
      const newPieces = [...pieces];
      const temp = newPieces[selectedSlot];
      newPieces[selectedSlot] = newPieces[index];
      newPieces[index] = temp;

      sounds.playSnap();
      setPieces(newPieces);
      setSelectedSlot(null);
      setMoves((m) => m + 1);

      // Check if solved
      if (isSolved(newPieces)) {
        setIsWon(true);
        updateGame("puzzle", { completed: true, lastResult: "win" });
        addBadge("خبير البازل");
        addPoints(60);
        setTimeout(() => {
          setShowSuccess(true);
        }, 600);
      }
    }
  };

  const handleGiveUpOrReset = () => {
    if (isWon || attemptsRemaining <= 0) return;
    // Deduct 1 attempt if user gives up / resets game
    consumeAttempt("puzzle");
    sounds.playWrong();
    startNewPuzzle();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <GameHeader
        title={t.games.puzzle.name}
        description={t.games.puzzle.description}
        attemptsRemaining={attemptsRemaining}
      />

      <div className="flex flex-col items-center">
        {/* Helper info bar */}
        <div className="w-full flex items-center justify-between gap-4 mb-4 text-xs sm:text-sm font-semibold text-foreground-muted">
          <div className="flex items-center gap-1.5 text-accent-cyan">
            <Check className="h-4 w-4" />
            <span>
              {correctPiecesCount} / {TOTAL_PIECES} {t.games.puzzle.piecesRemaining}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReference(!showReference)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-card/60 text-xs text-foreground-muted hover:text-foreground transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>{lang === "ar" ? "الشعار الأصلي" : "Reference"}</span>
            </button>
            <span className="text-foreground-muted">
              {lang === "ar" ? `الحركات: ${moves}` : `Moves: ${moves}`}
            </span>
          </div>
        </div>

        {/* Reference Image Modal / Preview */}
        {showReference && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-3 rounded-2xl border border-accent-blue/30 bg-[#0a1628]/95 shadow-glow max-w-xs text-center"
          >
            <p className="text-xs font-semibold text-accent-cyan mb-2">
              {lang === "ar" ? "صورة الشعار الكاملة" : "Complete Target Logo"}
            </p>
            <div className="relative aspect-square w-48 mx-auto rounded-xl overflow-hidden border border-border">
              <Image
                src="/images/logo.jpg"
                alt="IEEE OCS SB Logo Reference"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        )}

        {/* 3x3 Puzzle Board */}
        <Card
          padding="md"
          className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-square p-3 sm:p-4 border-accent-blue/30 shadow-glow"
        >
          <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-1.5 sm:gap-2">
            {pieces.map((pieceVal, slotIndex) => {
              const isSelected = selectedSlot === slotIndex;
              const isCorrect = pieceVal === slotIndex;

              // Compute background-position for pieceVal
              const origRow = Math.floor(pieceVal / GRID_SIZE);
              const origCol = pieceVal % GRID_SIZE;
              // 0 -> 0%, 1 -> 50%, 2 -> 100%
              const posX = origCol * 50;
              const posY = origRow * 50;

              return (
                <motion.button
                  key={slotIndex}
                  onClick={() => handleSlotClick(slotIndex)}
                  whileHover={{ scale: 0.98 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative aspect-square rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-accent-cyan ring-4 ring-accent-cyan/40 scale-95 shadow-[0_0_15px_#22d3ee] z-20"
                      : isCorrect
                      ? "border-green-500/50 shadow-[0_0_8px_rgba(34,197,94,0.2)]"
                      : "border-border hover:border-accent-blue/50"
                  }`}
                  style={{
                    backgroundImage: "url(/images/puzzle1.png)",
                    backgroundSize: "300% 300%",
                    backgroundPosition: `${posX}% ${posY}%`,
                  }}
                  aria-label={`Slot ${slotIndex + 1}, piece ${pieceVal + 1}`}
                >
                  {/* Subtle piece number watermark */}
                  <span className="absolute bottom-1 end-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white/70 backdrop-blur-sm pointer-events-none">
                    {pieceVal + 1}
                  </span>

                  {/* Solved checkmark badge */}
                  {isCorrect && (
                    <span className="absolute top-1 start-1 text-[10px] p-0.5 rounded-full bg-green-500/80 text-white pointer-events-none">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </Card>

        {/* Instructions & Controls */}
        <div className="mt-4 text-center max-w-sm">
          <p className="text-xs text-foreground-muted mb-4">
            {t.games.puzzle.tapToSwapHelp}
          </p>

          <Button
            onClick={handleGiveUpOrReset}
            disabled={isWon || attemptsRemaining <= 0}
            variant="secondary"
            size="sm"
            className="gap-2 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>
              {lang === "ar"
                ? "إعادة الخلط (تستهلك محاولة)"
                : "Reset Board (Consumes 1 Attempt)"}
            </span>
          </Button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          rewardTitle={t.games.puzzle.solved}
          onClose={() => setShowSuccess(false)}
        />
      )}

      {/* Out of attempts modal */}
      {attemptsRemaining <= 0 && !showSuccess && (
        <LockedModal challengeName={t.games.puzzle.name} />
      )}
    </div>
  );
}
