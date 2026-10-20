"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(true);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device supports primary fine pointer (desktop mouse)
    const hasCoarse = window.matchMedia("(pointer: coarse)").matches;
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (hasCoarse && hasTouch) {
      setIsTouch(true);
      return;
    }

    setIsTouch(false);
    setMounted(true);

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive =
          target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest("[role='button']") ||
          target.closest(".interactive") ||
          window.getComputedStyle(target).cursor === "pointer";
        setIsHovered(Boolean(interactive));
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, []);

  // Smooth trailing follower animation loop
  useEffect(() => {
    if (isTouch || !mounted) return;

    let animId: number;
    const updateTrail = () => {
      setTrailPos((prev) => {
        const dx = pos.x - prev.x;
        const dy = pos.y - prev.y;
        return {
          x: prev.x + dx * 0.2,
          y: prev.y + dy * 0.2,
        };
      });
      animId = requestAnimationFrame(updateTrail);
    };

    animId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(animId);
  }, [pos, isTouch, mounted]);

  if (isTouch || !mounted || !isVisible) return null;

  return (
    <>
      {/* Primary pointer dot */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-accent-cyan shadow-[0_0_12px_#22d3ee] transition-transform duration-75"
        style={{
          width: isHovered ? "10px" : "6px",
          height: isHovered ? "10px" : "6px",
          transform: `translate3d(${pos.x - (isHovered ? 5 : 3)}px, ${
            pos.y - (isHovered ? 5 : 3)
          }px, 0) scale(${isClicking ? 0.7 : 1})`,
        }}
      />

      {/* Trailing follower circle */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full border border-accent-blue/50 bg-accent-blue/10 backdrop-blur-[1px] transition-all duration-150 ease-out"
        style={{
          width: isHovered ? "42px" : "26px",
          height: isHovered ? "42px" : "26px",
          transform: `translate3d(${trailPos.x - (isHovered ? 21 : 13)}px, ${
            trailPos.y - (isHovered ? 21 : 13)
          }px, 0) scale(${isClicking ? 0.85 : 1})`,
          boxShadow: isHovered
            ? "0 0 20px rgba(59, 130, 246, 0.35)"
            : "0 0 10px rgba(59, 130, 246, 0.15)",
        }}
      />
    </>
  );
}
