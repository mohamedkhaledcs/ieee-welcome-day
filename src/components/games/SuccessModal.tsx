"use client";

import { motion } from "framer-motion";
import { Award, Gift, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  LinktreeIcon,
  TikTokIcon,
  WebsiteIcon,
} from "@/components/icons/SocialIcons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { socialLinks } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/context";
import { sounds } from "@/lib/sounds";

interface SuccessModalProps {
  rewardTitle?: string;
  onClose?: () => void;
}

const socialPlatforms = [
  {
    key: "linktree",
    name: "Linktree",
    href: socialLinks.linktree,
    icon: LinktreeIcon,
    accent: "hover:border-[#43E660] hover:text-[#43E660]",
  },
  {
    key: "website",
    name: "Website",
    href: socialLinks.website,
    icon: WebsiteIcon,
    accent: "hover:border-accent-cyan hover:text-accent-cyan",
  },
  {
    key: "instagram",
    name: "Instagram",
    href: socialLinks.instagram,
    icon: InstagramIcon,
    accent: "hover:border-[#E1306C] hover:text-[#E1306C]",
  },
  {
    key: "tiktok",
    name: "TikTok",
    href: socialLinks.tiktok,
    icon: TikTokIcon,
    accent: "hover:border-[#00f2fe] hover:text-[#00f2fe]",
  },
  {
    key: "linkedin",
    name: "LinkedIn",
    href: socialLinks.linkedin,
    icon: LinkedInIcon,
    accent: "hover:border-[#0077B5] hover:text-[#0077B5]",
  },
  {
    key: "facebook",
    name: "Facebook",
    href: socialLinks.facebook,
    icon: FacebookIcon,
    accent: "hover:border-[#1877F2] hover:text-[#1877F2]",
  },
] as const;

export function SuccessModal({ rewardTitle }: SuccessModalProps) {
  const { t, lang } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    sounds.playWin();

    // Lightweight celebration confetti particle canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);

    const colors = ["#3b82f6", "#22d3ee", "#e11d48", "#facc15", "#10b981", "#a855f7"];
    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h * 0.5 - 50,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 4 - 2,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 6 - 3,
    }));

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();

        if (p.y > h) {
          p.y = -20;
          p.x = Math.random() * w;
        }
      });
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md overflow-y-auto">
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-10 w-full h-full"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="relative z-20 w-full max-w-lg my-8"
      >
        <Card
          padding="lg"
          className="border-accent-blue/40 shadow-glow relative overflow-hidden bg-gradient-to-b from-[#0a1628] to-[#050b18] text-center"
        >
          {/* Glowing background halo */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent-blue/20 rounded-full blur-3xl pointer-events-none" />

          {/* Icon Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-accent-blue/20 border border-accent-blue/40 shadow-glow text-accent-cyan"
          >
            <Award className="h-10 w-10 animate-bounce" />
          </motion.div>

          {/* Celebratory Headings */}
          <h2 className="text-3xl font-extrabold text-foreground mb-1">
            {lang === "ar" ? "عاش! 🎉" : "Awesome! 🎉"}
          </h2>
          <p className="text-lg font-semibold text-accent-cyan mb-3">
            {lang === "ar" ? "حليت التحدي صح!" : "You solved the challenge correctly!"}
          </p>

          {/* Reward announcement if present */}
          {rewardTitle && (
            <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-blue/15 border border-accent-blue/30 text-white font-medium text-sm">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>{rewardTitle}</span>
            </div>
          )}

          {/* Physical Booth CTA */}
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-border/80 mb-6 space-y-1">
            <div className="flex items-center justify-center gap-2 text-foreground font-bold text-base sm:text-lg">
              <Gift className="h-5 w-5 text-amber-400 shrink-0" />
              <span>
                {lang === "ar"
                  ? "روح لفرعنا في IEEE وخد جائزتك 🎁"
                  : "Head to our IEEE branch and claim your reward 🎁"}
              </span>
            </div>
            <p className="text-sm text-foreground-muted">
              {lang === "ar" ? "التيم في انتظارك!" : "The team is waiting for you!"}
            </p>
          </div>

          {/* Social Conversion Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              {lang === "ar"
                ? "تابعنا وخليك دايمًا عارف الجديد."
                : "Follow us and stay up to date."}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {socialPlatforms.map((p) => {
                const Icon = p.icon;
                return (
                  <a
                    key={p.key}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 p-2.5 rounded-xl border border-border bg-white/[0.03] text-xs font-medium text-foreground-muted transition-all duration-200 ${p.accent}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{p.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/challenges" className="flex-1">
              <Button fullWidth variant="primary" size="md">
                {t.completion.viewAllChallenges}
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button fullWidth variant="secondary" size="md">
                {t.common.returnHome}
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
