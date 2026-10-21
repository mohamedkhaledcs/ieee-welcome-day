"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GameHeader } from "./GameHeader";
import { LockedModal } from "./LockedModal";
import { SuccessModal } from "./SuccessModal";
import { QUIZ_BANK } from "@/data/quizData";
import { useLanguage } from "@/lib/i18n/context";
import { useProgress } from "@/lib/progress/context";
import { sounds } from "@/lib/sounds";

interface ShuffledQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerText: string;
}

const QUESTIONS_PER_ROUND = 5;
const PASSING_SCORE = 3; // 3 out of 5 (60%)

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function QuizGame() {
  const { t, lang } = useLanguage();
  const {
    getGameAttempts,
    consumeAttempt,
    updateGame,
    addPoints,
    addBadge,
    hydrated,
  } = useProgress();

  const attemptsRemaining = hydrated ? getGameAttempts("quiz") : 3;

  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize randomized quiz session
  const startNewQuiz = useCallback(() => {
    const shuffledBank = shuffleArray(QUIZ_BANK);
    const selected = shuffledBank.slice(0, QUESTIONS_PER_ROUND);

    const prepared: ShuffledQuestion[] = selected.map((q) => {
      const questionText = lang === "ar" ? q.questionAr : q.questionEn;
      const opts = lang === "ar" ? q.optionsAr : q.optionsEn;
      const correctText = opts[q.correctIndex];
      const shuffledOpts = shuffleArray(opts);

      return {
        id: q.id,
        question: questionText,
        options: shuffledOpts,
        correctAnswerText: correctText,
      };
    });

    setQuestions(prepared);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
    setShowSuccess(false);
  }, [lang]);

  useEffect(() => {
    startNewQuiz();
  }, [startNewQuiz]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered || !currentQ || attemptsRemaining <= 0) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = currentQ.options[index] === currentQ.correctAnswerText;

    if (isCorrect) {
      sounds.playCorrect();
      setScore((s) => s + 1);
    } else {
      sounds.playWrong();
      // Every wrong answer immediately removes exactly 1 heart
      consumeAttempt("quiz");
      const remainingAfter = attemptsRemaining - 1;
      if (remainingAfter <= 0) {
        updateGame("quiz", { lastResult: "lose", bestScore: score });
        setTimeout(() => {
          setQuizFinished(true);
        }, 1000);
      }
    }
  };

  const handleNextQuestion = () => {
    if (attemptsRemaining <= 0) {
      setQuizFinished(true);
      return;
    }
    if (currentIndex + 1 < questions.length) {
      sounds.playClick();
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizFinished(true);
    const finalScore = score;
    const passed = finalScore >= PASSING_SCORE;

    if (passed) {
      updateGame("quiz", { completed: true, lastResult: "win", bestScore: finalScore });
      addBadge("عبقري الأسئلة");
      addPoints(finalScore * 20);
      setShowSuccess(true);
    } else {
      // Round failed without reaching passing score
      updateGame("quiz", { lastResult: "lose", bestScore: finalScore });
      sounds.playWrong();
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <GameHeader
        title={t.games.quiz.name}
        description={t.games.quiz.description}
        attemptsRemaining={attemptsRemaining}
      />

      {/* Quiz Card */}
      <Card padding="lg" className="relative overflow-hidden w-full">
        {/* Progress bar */}
        <div className="w-full bg-white/5 rounded-full h-2 mb-6 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-accent-blue to-accent-cyan h-full rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentIndex + (isAnswered ? 1 : 0)) / QUESTIONS_PER_ROUND) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {!quizFinished && currentQ ? (
          <div>
            {/* Header / index */}
            <div className="flex items-center justify-between text-xs font-semibold text-foreground-muted mb-4">
              <span>
                {t.games.quiz.question} {currentIndex + 1} {t.challenges.attemptsOf}{" "}
                {QUESTIONS_PER_ROUND}
              </span>
              <span className="text-accent-cyan">
                {t.games.quiz.score}: {score}
              </span>
            </div>

            {/* Question Text */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-lg sm:text-xl font-bold text-foreground mb-6 leading-relaxed">
                  {currentQ.question}
                </h2>

                {/* Options List */}
                <div className="space-y-3 mb-6">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = opt === currentQ.correctAnswerText;

                    let btnStyle =
                      "border-border bg-white/[0.03] text-foreground hover:bg-white/[0.08] hover:border-accent-blue/40";

                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyle =
                          "border-green-500/80 bg-green-500/15 text-green-300 shadow-[0_0_12px_rgba(34,197,94,0.3)]";
                      } else if (isSelected && !isCorrect) {
                        btnStyle =
                          "border-red-500/80 bg-red-500/15 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.3)]";
                      } else {
                        btnStyle = "border-border/40 bg-white/[0.01] text-foreground-muted/50";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswered}
                        className={`w-full min-h-[52px] p-4 rounded-xl border text-start text-sm sm:text-base font-medium transition-all duration-200 flex items-center justify-between gap-3 ${btnStyle}`}
                      >
                        <span className="flex-1 text-start">{opt}</span>
                        {isAnswered && (
                          <span className="shrink-0">
                            {isCorrect && (
                              <CheckCircle2 className="h-5 w-5 text-green-400" />
                            )}
                            {isSelected && !isCorrect && (
                              <XCircle className="h-5 w-5 text-red-400" />
                            )}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Answer Feedback & Next Button */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border/50"
              >
                <div className="text-sm font-semibold">
                  {currentQ.options[selectedOption!] === currentQ.correctAnswerText ? (
                    <span className="text-green-400">{t.games.quiz.correctFeedback}</span>
                  ) : (
                    <span className="text-red-400">{t.games.quiz.wrongFeedback}</span>
                  )}
                </div>

                <Button
                  onClick={handleNextQuestion}
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto"
                >
                  {currentIndex + 1 < questions.length
                    ? t.games.quiz.nextQuestion
                    : t.games.quiz.finishQuiz}
                </Button>
              </motion.div>
            )}
          </div>
        ) : quizFinished && !showSuccess ? (
          /* Failed quiz state */
          <div className="text-center py-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
              <XCircle className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {t.games.quiz.failedTitle}
            </h3>
            <p className="text-sm text-foreground-muted mb-4 max-w-md mx-auto">
              {t.games.quiz.failedBody}
            </p>
            <p className="text-base font-bold text-accent-cyan mb-6">
              {t.games.quiz.score}: {score} / {QUESTIONS_PER_ROUND}
            </p>

            {attemptsRemaining > 0 ? (
              <Button
                onClick={startNewQuiz}
                variant="primary"
                size="md"
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>{t.games.quiz.retryBtn}</span>
              </Button>
            ) : (
              <LockedModal challengeName={t.games.quiz.name} />
            )}
          </div>
        ) : null}
      </Card>

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          rewardTitle={`${t.games.quiz.score}: ${score}/${QUESTIONS_PER_ROUND}`}
          onClose={() => setShowSuccess(false)}
        />
      )}

      {/* Out of attempts modal */}
      {attemptsRemaining <= 0 && !showSuccess && (
        <LockedModal challengeName={t.games.quiz.name} />
      )}
    </div>
  );
}
