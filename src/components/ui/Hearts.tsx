"use client";

import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { MAX_ATTEMPTS } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/context";

interface HeartsProps {
  remaining: number;
  total?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

export function Hearts({
  remaining,
  total = MAX_ATTEMPTS,
  showLabel = true,
  size = "md",
  className,
}: HeartsProps) {
  const { t } = useLanguage();
  const clampedRemaining = Math.max(0, Math.min(total, remaining));

  return (
    <div className={clsx("flex flex-col items-center gap-1.5", className)}>
      <div
        className="flex items-center gap-1.5"
        aria-label={`${clampedRemaining} ${t.attempts.remaining}`}
      >
        {Array.from({ length: total }).map((_, i) => {
          const filled = i < clampedRemaining;
          return (
            <AnimatePresence key={i} mode="wait">
              <motion.div
                initial={false}
                animate={
                  filled
                    ? { scale: [1, 1.15, 1], filter: "drop-shadow(0 0 6px rgba(239, 68, 68, 0.6))" }
                    : { scale: 0.9, filter: "none", opacity: 0.4 }
                }
                transition={{ duration: 0.3 }}
              >
                <Heart
                  className={clsx(
                    sizeMap[size],
                    "transition-colors duration-300",
                    filled
                      ? "fill-red-500 text-red-500"
                      : "fill-none text-foreground-muted/30"
                  )}
                />
              </motion.div>
            </AnimatePresence>
          );
        })}
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-foreground-muted">
          {t.attempts.remaining}: {clampedRemaining} {t.attempts.of} {total}
        </span>
      )}
    </div>
  );
}
