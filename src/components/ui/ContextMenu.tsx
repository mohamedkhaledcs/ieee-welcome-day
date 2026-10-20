"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Gamepad2,
  Home,
  Info,
  Layers,
  RotateCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { socialLinks } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/context";

interface ContextMenuState {
  x: number;
  y: number;
  isOpen: boolean;
}

export function ContextMenu() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [menu, setMenu] = useState<ContextMenuState>({ x: 0, y: 0, isOpen: false });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const hasCoarse = window.matchMedia("(pointer: coarse)").matches;
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (hasCoarse && hasTouch) {
      setIsDesktop(false);
      return;
    }
    setIsDesktop(true);

    const handleContextMenu = (e: MouseEvent) => {
      // Don't intercept if user is selecting text in an input or text area
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      e.preventDefault();

      // Clamp within window
      const menuWidth = 220;
      const menuHeight = 280;
      const x = Math.min(e.clientX, window.innerWidth - menuWidth - 10);
      const y = Math.min(e.clientY, window.innerHeight - menuHeight - 10);

      setMenu({ x, y, isOpen: true });
    };

    const handleClick = () => setMenu((prev) => ({ ...prev, isOpen: false }));
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu((prev) => ({ ...prev, isOpen: false }));
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleClick);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!isDesktop || !menu.isOpen) return null;

  const navigateTo = (path: string) => {
    setMenu((prev) => ({ ...prev, isOpen: false }));
    router.push(path);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.12 }}
        style={{ top: menu.y, left: menu.x }}
        className="fixed z-[9999] w-56 rounded-2xl border border-border bg-[#0a1628]/95 p-1.5 shadow-2xl backdrop-blur-xl text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-3 py-1.5 font-bold tracking-wider text-[10px] text-accent-cyan uppercase border-b border-border/50 mb-1">
          {lang === "ar" ? "IEEE OCS SB قائمة" : "IEEE OCS SB Menu"}
        </div>

        <button
          onClick={() => navigateTo("/")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-white/5 transition-colors text-start"
        >
          <Home className="h-4 w-4 text-accent-blue" />
          <span>{t.contextMenu.home}</span>
        </button>

        <button
          onClick={() => navigateTo("/challenges")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-white/5 transition-colors text-start"
        >
          <Gamepad2 className="h-4 w-4 text-accent-cyan" />
          <span>{t.contextMenu.challenges}</span>
        </button>

        <button
          onClick={() => navigateTo("/tracks")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-white/5 transition-colors text-start"
        >
          <Layers className="h-4 w-4 text-accent-blue" />
          <span>{t.contextMenu.tracks}</span>
        </button>

        <button
          onClick={() => navigateTo("/about")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-white/5 transition-colors text-start"
        >
          <Info className="h-4 w-4 text-accent-cyan" />
          <span>{t.contextMenu.about}</span>
        </button>

        <div className="my-1 border-t border-border/50" />

        <a
          href={socialLinks.linktree}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenu((prev) => ({ ...prev, isOpen: false }))}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-foreground-muted hover:text-[#43E660] hover:bg-white/5 transition-colors text-start"
        >
          <span>{t.contextMenu.linktree}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>

        <div className="my-1 border-t border-border/50" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setMenu((prev) => ({ ...prev, isOpen: false }));
              window.history.back();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>{t.contextMenu.back}</span>
          </button>
          <button
            onClick={() => {
              setMenu((prev) => ({ ...prev, isOpen: false }));
              window.location.reload();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <RotateCw className="h-3 w-3" />
            <span>{t.contextMenu.reload}</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
