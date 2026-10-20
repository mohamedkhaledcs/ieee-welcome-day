"use client";

import { Sparkles } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GameHeader } from "./GameHeader";
import { LockedModal } from "./LockedModal";
import { SuccessModal } from "./SuccessModal";
import { useLanguage } from "@/lib/i18n/context";
import { useProgress } from "@/lib/progress/context";
import { sounds } from "@/lib/sounds";

interface WheelSegment {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: string;
  color: string;
  isWin: boolean;
}

const SEGMENTS: WheelSegment[] = [
  { id: "sticker", labelAr: "استيكر IEEE", labelEn: "IEEE Sticker", icon: "🎁", color: "#2563eb", isWin: true },
  { id: "luck", labelAr: "حظ استثنائي", labelEn: "Extra Luck", icon: "🍀", color: "#0d9488", isWin: true },
  { id: "badge", labelAr: "شارة البطل", labelEn: "IEEE Badge", icon: "🏅", color: "#7c3aed", isWin: true },
  { id: "shoutout", labelAr: "تحية من التيم", labelEn: "Team Shoutout", icon: "📣", color: "#0284c7", isWin: true },
  { id: "bonus", labelAr: "نقطة شرفية", labelEn: "Bonus Point", icon: "⭐", color: "#f59e0b", isWin: true },
  { id: "surprise", labelAr: "هدية مفاجأة", labelEn: "Surprise", icon: "🎯", color: "#e11d48", isWin: true },
  { id: "goodluck", labelAr: "حظ سعيد", labelEn: "Good Luck", icon: "🤞", color: "#4f46e5", isWin: true },
  { id: "champion", labelAr: "الفائز الذهبي", labelEn: "Gold Winner", icon: "🏆", color: "#d97706", isWin: true },
];

export function WheelGame() {
  const { t, lang } = useLanguage();
  const { getGameAttempts, consumeAttempt, updateGame, addReward, addBadge, addPoints, hydrated } = useProgress();

  const attemptsRemaining = hydrated ? getGameAttempts("wheel") : 3;

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedReward, setSelectedReward] = useState<WheelSegment | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentRotationRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  const numSegments = SEGMENTS.length;
  const arcSize = (2 * Math.PI) / numSegments;

  // Draw wheel on canvas
  const drawWheel = useCallback((rotAngle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 16;

    ctx.clearRect(0, 0, size, size);

    // Save context for rotation
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(rotAngle);

    // Outer glow ring
    ctx.beginPath();
    ctx.arc(0, 0, radius + 8, 0, 2 * Math.PI);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(34, 211, 238, 0.4)";
    ctx.stroke();

    // Outer wheel border
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "#0a1628";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#38bdf8";
    ctx.stroke();

    // Segments
    for (let i = 0; i < numSegments; i++) {
      const seg = SEGMENTS[i];
      const startAngle = i * arcSize;
      const endAngle = startAngle + arcSize;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius - 2, startAngle, endAngle);
      ctx.closePath();

      // Gradient fill per segment
      const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, radius);
      grad.addColorStop(0, seg.color);
      grad.addColorStop(1, "#070d1e");
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.stroke();

      // Text & Icon
      ctx.save();
      ctx.rotate(startAngle + arcSize / 2);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";

      // Icon
      ctx.font = `${Math.floor(size * 0.05)}px sans-serif`;
      ctx.fillText(seg.icon, radius - 15, 0);

      // Label
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${Math.floor(size * 0.032)}px Cairo, Inter, sans-serif`;
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 4;
      const label = lang === "ar" ? seg.labelAr : seg.labelEn;
      ctx.fillText(label, radius - 44, 0);

      ctx.restore();
    }

    // Center hub
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.22, 0, 2 * Math.PI);
    ctx.fillStyle = "#050b18";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#22d3ee";
    ctx.stroke();

    ctx.restore();

    // Draw static needle at TOP pointing down
    ctx.save();
    ctx.translate(center, 12);
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.lineTo(14, 0);
    ctx.lineTo(0, 28);
    ctx.closePath();
    ctx.fillStyle = "#22d3ee";
    ctx.shadowColor = "#22d3ee";
    ctx.shadowBlur = 10;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();
  }, [arcSize, lang, numSegments]);

  useEffect(() => {
    drawWheel(rotation);
  }, [drawWheel, rotation]);

  const spin = () => {
    if (isSpinning || attemptsRemaining <= 0) return;

    // Deduct attempt immediately in persistent storage
    const consumed = consumeAttempt("wheel");
    if (!consumed) return;

    sounds.playClick();
    setIsSpinning(true);
    setSelectedReward(null);

    // Randomize target
    const targetIndex = Math.floor(Math.random() * numSegments);
    const targetSegment = SEGMENTS[targetIndex];

    // Calculate rotation angle so that targetIndex lands at TOP (angle -Math.PI / 2)
    // Needle is at -PI/2 in canvas space (top)
    const extraSpins = 5 + Math.floor(Math.random() * 3); // 5 to 7 full rotations
    const sliceMiddle = targetIndex * arcSize + arcSize / 2;
    // We want (finalRot + sliceMiddle) % 2PI == 3PI/2 (top)
    const targetAngle = (3 * Math.PI) / 2 - sliceMiddle;
    const currentNorm = currentRotationRef.current % (2 * Math.PI);
    const delta = (targetAngle - currentNorm + 4 * Math.PI) % (2 * Math.PI);
    const totalRotation = currentRotationRef.current + extraSpins * (2 * Math.PI) + delta;

    const startTime = performance.now();
    const duration = 3800; // ~3.8 seconds
    const startRot = currentRotationRef.current;
    let lastTickAngle = startRot;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Realistic cubic bezier / quintic ease-out
      const ease = 1 - Math.pow(1 - progress, 4);
      const currentRot = startRot + (totalRotation - startRot) * ease;
      currentRotationRef.current = currentRot;
      setRotation(currentRot);

      // Tick sound every slice crossed
      if (Math.abs(currentRot - lastTickAngle) >= arcSize * 0.9) {
        sounds.playTick();
        lastTickAngle = currentRot;
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setSelectedReward(targetSegment);
        addReward(targetSegment.labelAr);
        addBadge("عجلة الحظ");
        addPoints(50);
        updateGame("wheel", { completed: true, lastResult: "win" });

        // Show win celebration
        setTimeout(() => {
          setShowSuccess(true);
        }, 400);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <GameHeader
        title={t.games.wheel.name}
        description={t.games.wheel.description}
        attemptsRemaining={attemptsRemaining}
      />

      <div className="flex flex-col items-center">
        {/* Wheel Board Container */}
        <Card padding="md" className="relative flex flex-col items-center overflow-hidden w-full max-w-md">
          <div className="relative aspect-square w-full max-w-[340px] sm:max-w-[380px] p-2 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={700}
              height={700}
              className="w-full h-full object-contain filter drop-shadow-[0_0_24px_rgba(59,130,246,0.35)]"
            />
          </div>

          {/* Action button */}
          <div className="mt-6 w-full px-4">
            <Button
              onClick={spin}
              disabled={isSpinning || attemptsRemaining <= 0}
              variant="primary"
              size="lg"
              fullWidth
              className="font-bold text-base tracking-wide"
            >
              <Sparkles className="h-5 w-5" />
              <span>{isSpinning ? t.games.wheel.spinning : t.games.wheel.spinBtn}</span>
            </Button>
          </div>

          <p className="mt-3 text-xs text-foreground-muted">
            {lang === "ar"
              ? "كل لفة تستهلك محاولة واحدة — لديك 3 محاولات بالكامل."
              : "Each spin consumes 1 attempt — you have 3 total attempts."}
          </p>
        </Card>
      </div>

      {/* Success Modal */}
      {showSuccess && selectedReward && (
        <SuccessModal
          rewardTitle={`${selectedReward.icon} ${
            lang === "ar" ? selectedReward.labelAr : selectedReward.labelEn
          }`}
          onClose={() => setShowSuccess(false)}
        />
      )}

      {/* Out of attempts modal */}
      {!isSpinning && attemptsRemaining <= 0 && !showSuccess && (
        <LockedModal challengeName={t.games.wheel.name} />
      )}
    </div>
  );
}
