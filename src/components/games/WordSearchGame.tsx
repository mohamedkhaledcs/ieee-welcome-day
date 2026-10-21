"use client";

import { RefreshCw } from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GameHeader } from "./GameHeader";
import { LockedModal } from "./LockedModal";
import { SuccessModal } from "./SuccessModal";
import { useLanguage } from "@/lib/i18n/context";
import { useProgress } from "@/lib/progress/context";
import { sounds } from "@/lib/sounds";

const TARGET_WORDS = ["IEEE", "OBOUR", "WELCOME", "DAY", "GIFT", "SCORE"] as const;
const GRID_SIZE = 10;

interface PlacedWord {
  word: string;
  cells: { r: number; c: number }[];
}

interface BoardData {
  grid: string[][];
  placedWords: PlacedWord[];
}

const DIRECTIONS = [
  { dr: 0, dc: 1 },   // horizontal right
  { dr: 1, dc: 0 },   // vertical down
  { dr: 0, dc: -1 },  // horizontal left
  { dr: -1, dc: 0 },  // vertical up
  { dr: 1, dc: 1 },   // diagonal down-right
  { dr: 1, dc: -1 },  // diagonal down-left
  { dr: -1, dc: 1 },  // diagonal up-right
  { dr: -1, dc: -1 }, // diagonal up-left
];

// Generator strictly ensuring NO SHARED LETTERS BETWEEN WORDS
function generateBoard(): BoardData {
  let attempts = 0;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  while (attempts < 500) {
    attempts++;
    const grid: (string | null)[][] = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => null)
    );
    const placedWords: PlacedWord[] = [];
    let allPlaced = true;

    // Shuffle target words order for extra randomness
    const shuffledWords = [...TARGET_WORDS].sort(() => Math.random() - 0.5);

    for (const word of shuffledWords) {
      let placed = false;
      const shuffledDirs = [...DIRECTIONS].sort(() => Math.random() - 0.5);

      for (let t = 0; t < 200 && !placed; t++) {
        const dir = shuffledDirs[Math.floor(Math.random() * shuffledDirs.length)];
        const startR = Math.floor(Math.random() * GRID_SIZE);
        const startC = Math.floor(Math.random() * GRID_SIZE);

        const endR = startR + dir.dr * (word.length - 1);
        const endC = startC + dir.dc * (word.length - 1);

        if (endR >= 0 && endR < GRID_SIZE && endC >= 0 && endC < GRID_SIZE) {
          // Check STRICT NO SHARED LETTERS (every cell must be empty)
          let canPlace = true;
          const wordCells: { r: number; c: number }[] = [];

          for (let i = 0; i < word.length; i++) {
            const r = startR + dir.dr * i;
            const c = startC + dir.dc * i;
            if (grid[r][c] !== null) {
              canPlace = false;
              break;
            }
            wordCells.push({ r, c });
          }

          if (canPlace) {
            for (let i = 0; i < word.length; i++) {
              const { r, c } = wordCells[i];
              grid[r][c] = word[i];
            }
            placedWords.push({ word, cells: wordCells });
            placed = true;
          }
        }
      }

      if (!placed) {
        allPlaced = false;
        break;
      }
    }

    if (allPlaced && placedWords.length === TARGET_WORDS.length) {
      // Fill remaining empty cells with random letters
      const filledGrid: string[][] = grid.map((row) =>
        row.map((cell) => cell ?? alphabet[Math.floor(Math.random() * alphabet.length)])
      );
      return { grid: filledGrid, placedWords };
    }
  }

  // Fallback board if 500 random tries fail (practically never occurs for 10x10)
  const defaultGrid = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => alphabet[Math.floor(Math.random() * alphabet.length)])
  );
  return { grid: defaultGrid, placedWords: [] };
}

export function WordSearchGame() {
  const { t, lang } = useLanguage();
  const {
    getGameAttempts,
    consumeAttempt,
    updateGame,
    addBadge,
    addPoints,
    hydrated,
  } = useProgress();

  const attemptsRemaining = hydrated ? getGameAttempts("wordsearch") : 3;

  const [boardData, setBoardData] = useState<BoardData>({ grid: [], placedWords: [] });
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [foundCellKeys, setFoundCellKeys] = useState<Set<string>>(new Set());

  // Interactive selection state
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState<{ r: number; c: number } | null>(null);
  const [currentCell, setCurrentCell] = useState<{ r: number; c: number } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const boardRef = useRef<HTMLDivElement | null>(null);

  const initGame = useCallback(() => {
    const data = generateBoard();
    setBoardData(data);
    setFoundWords([]);
    setFoundCellKeys(new Set());
    setIsSelecting(false);
    setStartCell(null);
    setCurrentCell(null);
    setShowSuccess(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Compute selected cells along straight line
  const selectedCells = useMemo(() => {
    if (!startCell || !currentCell) return [];

    const dr = currentCell.r - startCell.r;
    const dc = currentCell.c - startCell.c;

    const absDr = Math.abs(dr);
    const absDc = Math.abs(dc);

    // Must be straight line: horizontal, vertical, or diagonal
    if (absDr === 0 || absDc === 0 || absDr === absDc) {
      const stepR = absDr === 0 ? 0 : dr / absDr;
      const stepC = absDc === 0 ? 0 : dc / absDc;
      const steps = Math.max(absDr, absDc);

      const path: { r: number; c: number }[] = [];
      for (let i = 0; i <= steps; i++) {
        path.push({
          r: startCell.r + stepR * i,
          c: startCell.c + stepC * i,
        });
      }
      return path;
    }

    return [startCell];
  }, [startCell, currentCell]);

  const selectedCellKeys = useMemo(() => {
    return new Set(selectedCells.map((c) => `${c.r},${c.c}`));
  }, [selectedCells]);

  // Convert pointer event to grid coords
  const getCoordsFromPointer = (e: React.PointerEvent): { r: number; c: number } | null => {
    const board = boardRef.current;
    if (!board) return null;
    const rect = board.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return null;

    const col = Math.floor((x / rect.width) * GRID_SIZE);
    const row = Math.floor((y / rect.height) * GRID_SIZE);

    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      return { r: row, c: col };
    }
    return null;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (attemptsRemaining <= 0 || foundWords.length === TARGET_WORDS.length) return;
    const coords = getCoordsFromPointer(e);
    if (!coords) return;

    sounds.playClick();
    setIsSelecting(true);
    setStartCell(coords);
    setCurrentCell(coords);
    // Capture pointer to ensure smooth drag on touch devices
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isSelecting) return;
    const coords = getCoordsFromPointer(e);
    if (coords) {
      setCurrentCell(coords);
    }
  };

  const handlePointerUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);

    if (selectedCells.length > 0 && boardData.grid.length > 0) {
      // Build selected word text
      const selectedChars = selectedCells.map((c) => boardData.grid[c.r][c.c]).join("");
      const reversedChars = selectedChars.split("").reverse().join("");

      // Check if matches any target word not already found
      const matched = TARGET_WORDS.find(
        (w) =>
          !foundWords.includes(w) &&
          (w === selectedChars || w === reversedChars)
      );

      if (matched) {
        sounds.playWordFound();
        const nextFoundWords = [...foundWords, matched];
        setFoundWords(nextFoundWords);

        // Add to permanent cell highlight set
        const nextCellKeys = new Set(foundCellKeys);
        selectedCells.forEach((c) => nextCellKeys.add(`${c.r},${c.c}`));
        setFoundCellKeys(nextCellKeys);

        // Check if all 6 words found
        if (nextFoundWords.length === TARGET_WORDS.length) {
          updateGame("wordsearch", { completed: true, lastResult: "win" });
          addBadge("صياد الكلمات");
          addPoints(60);
          setTimeout(() => {
            setShowSuccess(true);
          }, 600);
        }
      } else if (selectedCells.length >= 2) {
        // Failed attempt / wrong word selection: immediately remove 1 heart
        consumeAttempt("wordsearch");
        sounds.playWrong();
        if (attemptsRemaining - 1 <= 0) {
          updateGame("wordsearch", { lastResult: "lose" });
        }
      }
    }

    setStartCell(null);
    setCurrentCell(null);
  };

  const handleReset = () => {
    if (foundWords.length === TARGET_WORDS.length || attemptsRemaining <= 0) return;
    consumeAttempt("wordsearch");
    sounds.playWrong();
    initGame();
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <GameHeader
        title={t.games.wordsearch.name}
        description={t.games.wordsearch.description}
        attemptsRemaining={attemptsRemaining}
      />

      <div className="flex flex-col items-center">
        {/* Target Words Badges */}
        <div className="w-full mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-foreground-muted mb-2">
            <span>{t.games.wordsearch.wordsToFind}</span>
            <span className="text-accent-cyan">
              {t.games.wordsearch.foundWords}: {foundWords.length} / {TARGET_WORDS.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {TARGET_WORDS.map((w) => {
              const isFound = foundWords.includes(w);
              return (
                <span
                  key={w}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider transition-all duration-300 border ${
                    isFound
                      ? "border-green-500/60 bg-green-500/15 text-green-300 line-through decoration-green-400 decoration-2 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                      : "border-border bg-card text-foreground-muted"
                  }`}
                >
                  {isFound ? `✓ ${w}` : w}
                </span>
              );
            })}
          </div>
        </div>

        {/* Word Search Grid */}
        <Card
          padding="sm"
          className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-square p-2 sm:p-3 border-accent-blue/40 shadow-glow select-none"
        >
          <div
            ref={boardRef}
            dir="ltr"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-full h-full grid grid-cols-10 grid-rows-10 gap-0.5 sm:gap-1 touch-none select-none"
            style={{ touchAction: "none" }}
          >
            {boardData.grid.map((row, r) =>
              row.map((letter, c) => {
                const key = `${r},${c}`;
                const isSelected = selectedCellKeys.has(key);
                const isFound = foundCellKeys.has(key);

                return (
                  <div
                    key={key}
                    data-row={r}
                    data-col={c}
                    className={`relative flex items-center justify-center rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-bold transition-all duration-100 ${
                      isSelected
                        ? "bg-accent-cyan text-black scale-105 shadow-[0_0_10px_#22d3ee] z-10"
                        : isFound
                        ? "bg-green-500/25 text-green-300 border border-green-500/40"
                        : "bg-white/[0.02] text-foreground-muted hover:bg-white/[0.08]"
                    }`}
                  >
                    {letter}
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Hint & Reset */}
        <div className="mt-4 text-center max-w-sm">
          <p className="text-xs text-foreground-muted mb-4">
            {t.games.wordsearch.hint}
          </p>

          <Button
            onClick={handleReset}
            disabled={foundWords.length === TARGET_WORDS.length || attemptsRemaining <= 0}
            variant="secondary"
            size="sm"
            className="gap-2 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>
              {lang === "ar"
                ? "إعادة إنشاء البورد (تستهلك محاولة)"
                : "Reset Board (Consumes 1 Attempt)"}
            </span>
          </Button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          rewardTitle={`${t.games.wordsearch.foundWords}: 6/6 (${TARGET_WORDS.join(", ")})`}
          onClose={() => setShowSuccess(false)}
        />
      )}

      {/* Out of attempts modal */}
      {attemptsRemaining <= 0 && !showSuccess && (
        <LockedModal challengeName={t.games.wordsearch.name} />
      )}
    </div>
  );
}
