"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  Gamepad2,
  Layers,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
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
import {
  gameIds,
  nonTechnicalTracks,
  socialLinks,
  technicalTracks,
} from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/context";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const socialPlatforms = [
  { key: "linktree", name: "Linktree", href: socialLinks.linktree, icon: LinktreeIcon },
  { key: "website", name: "Website", href: socialLinks.website, icon: WebsiteIcon },
  { key: "instagram", name: "Instagram", href: socialLinks.instagram, icon: InstagramIcon },
  { key: "tiktok", name: "TikTok", href: socialLinks.tiktok, icon: TikTokIcon },
  { key: "linkedin", name: "LinkedIn", href: socialLinks.linkedin, icon: LinkedInIcon },
  { key: "facebook", name: "Facebook", href: socialLinks.facebook, icon: FacebookIcon },
] as const;

export default function HomePage() {
  const { t, lang } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subtle floating particles in hero
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let h = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const onResize = () => {
      if (!canvas) return;
      w = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      h = canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    window.addEventListener("resize", onResize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#38bdf8";

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const CtaArrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <>
      {/* Hero Section */}
      <section className="gradient-hero relative overflow-hidden min-h-[85vh] flex items-center justify-center">
        {/* Particle Canvas */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-0 opacity-40"
        />

        {/* Background campus graphic with deep cosmic overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Image
            src="/images/hero-campus.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050b18]/60 via-[#050b18]/80 to-[#050b18]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Branding Logo */}
            <div className="mb-6 flex justify-center">
              <div className="relative p-2 rounded-3xl bg-gradient-to-br from-accent-blue/20 to-accent-cyan/10 border border-accent-blue/30 shadow-glow">
                <Image
                  src="/images/logo.jpg"
                  alt="IEEE OCS SB Logo"
                  width={90}
                  height={90}
                  className="rounded-2xl shadow-glow"
                  priority
                />
              </div>
            </div>

            {/* Sub-tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/30 text-accent-cyan text-xs sm:text-sm font-semibold mb-6 shadow-glow">
              <Sparkles className="h-4 w-4" />
              <span>IEEE OCS SB Student Activity • Welcome Day 2026</span>
            </div>

            {/* Hero Main Heading */}
            <h1 className="font-extrabold text-4xl sm:text-6xl lg:text-7xl font-sans tracking-tight text-foreground mb-4">
              <span className="text-gradient">ARE YOU READY?</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-foreground-muted mb-8 text-balance max-w-2xl mx-auto leading-relaxed">
              {t.landing.heroSubtitle}
            </p>

            {/* Primary CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/challenges">
                <Button size="lg" className="gap-2 font-bold text-base sm:text-lg shadow-glow px-8 py-4">
                  <Gamepad2 className="h-5 w-5" />
                  <span>{t.landing.cta}</span>
                  <CtaArrow className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/tracks">
                <Button variant="secondary" size="lg" className="font-semibold text-sm sm:text-base">
                  <Layers className="h-4 w-4" />
                  <span>{t.landing.exploreTracks}</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro Mission Card */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <Card padding="lg" className="border-accent-blue/20 bg-card/90">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              {t.landing.introTitle}
            </h2>
            <p className="text-foreground-muted leading-relaxed text-base sm:text-lg">
              {t.landing.introBody}
            </p>
          </Card>
        </motion.div>
      </section>

      {/* Tracks & Challenges Previews */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Tracks Card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card hover padding="lg" className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="rounded-2xl bg-accent-blue/15 border border-accent-blue/30 p-3 text-accent-blue">
                    <Code2 className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                      {t.landing.tracksPreviewTitle}
                    </h3>
                    <p className="text-sm text-foreground-muted">
                      {t.landing.tracksPreviewBody}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {[...technicalTracks, ...nonTechnicalTracks].map((track) => (
                    <span
                      key={track}
                      className="text-xs font-medium px-3 py-1 rounded-full bg-white/[0.04] text-foreground-muted border border-border"
                    >
                      {track}
                    </span>
                  ))}
                </div>
              </div>

              <Link href="/tracks">
                <Button variant="outline" size="md" fullWidth>
                  {t.landing.exploreTracks}
                </Button>
              </Link>
            </Card>
          </motion.div>

          {/* Challenges Card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card hover padding="lg" className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="rounded-2xl bg-accent-cyan/15 border border-accent-cyan/30 p-3 text-accent-cyan">
                    <Gamepad2 className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                      {t.landing.challengesPreviewTitle}
                    </h3>
                    <p className="text-sm text-foreground-muted">
                      {t.landing.challengesPreviewBody}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {gameIds.map((id) => (
                    <span
                      key={id}
                      className="text-xs font-medium px-3 py-1 rounded-full bg-white/[0.04] text-foreground-muted border border-border"
                    >
                      {t.games[id].name}
                    </span>
                  ))}
                </div>
              </div>

              <Link href="/challenges">
                <Button variant="primary" size="md" fullWidth className="font-bold">
                  {t.landing.viewChallenges}
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Social Conversion Banner */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="text-center p-8 rounded-3xl border border-border bg-card shadow-card"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {t.landing.socialTitle}
          </h2>
          <p className="text-foreground-muted mb-6 max-w-lg mx-auto text-sm sm:text-base">
            {t.landing.socialBody}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 max-w-3xl mx-auto">
            {socialPlatforms.map((p) => {
              const Icon = p.icon;
              return (
                <a
                  key={p.key}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 rounded-xl border border-border bg-white/[0.02] text-xs font-semibold text-foreground-muted hover:text-accent-cyan hover:border-accent-cyan/30 hover:bg-white/[0.05] transition-all"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{p.name}</span>
                </a>
              );
            })}
          </div>
        </motion.div>
      </section>
    </>
  );
}
