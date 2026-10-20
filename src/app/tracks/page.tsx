"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Camera,
  Code,
  Database,
  Gamepad2,
  Layout,
  Megaphone,
  Shield,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
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
  nonTechnicalTracks,
  socialLinks,
  technicalTracks,
} from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/context";

const trackIcons: Record<string, typeof Code> = {
  "Front-End": Code,
  "Back-End": Database,
  "Cyber Security": Shield,
  "Data Analysis": BarChart3,
  Flutter: Smartphone,
  "UI/UX": Layout,
  Media: Camera,
  HR: Users,
  PR: Megaphone,
};

const socialPlatforms = [
  { key: "linktree", name: "Linktree", href: socialLinks.linktree, icon: LinktreeIcon },
  { key: "website", name: "Website", href: socialLinks.website, icon: WebsiteIcon },
  { key: "instagram", name: "Instagram", href: socialLinks.instagram, icon: InstagramIcon },
  { key: "tiktok", name: "TikTok", href: socialLinks.tiktok, icon: TikTokIcon },
  { key: "linkedin", name: "LinkedIn", href: socialLinks.linkedin, icon: LinkedInIcon },
  { key: "facebook", name: "Facebook", href: socialLinks.facebook, icon: FacebookIcon },
] as const;

export default function TracksPage() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 text-accent-cyan text-xs font-semibold border border-accent-blue/20 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>IEEE OCS SB Academy Pathways</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground mb-3 tracking-tight">
            {t.tracks.title}
          </h1>
          <p className="text-foreground-muted max-w-xl mx-auto text-sm sm:text-base">
            {t.tracks.subtitle}
          </p>
        </div>

        {/* Technical Tracks Grid */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-2.5 w-2.5 rounded-full bg-accent-blue animate-pulse" />
            <h2 className="text-2xl font-bold text-foreground">
              {t.tracks.technicalTitle}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {technicalTracks.map((track, i) => {
              const Icon = trackIcons[track] ?? Code;
              return (
                <motion.div
                  key={track}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Card hover padding="md" className="h-full border-accent-blue/20 flex flex-col justify-between">
                    <div>
                      <div className="p-3 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 inline-block mb-3 text-accent-blue">
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{track}</h3>
                      <p className="text-sm text-foreground-muted leading-relaxed">
                        {t.tracks.descriptions[track]}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Non-Technical Tracks Grid */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-2.5 w-2.5 rounded-full bg-accent-cyan animate-pulse" />
            <h2 className="text-2xl font-bold text-foreground">
              {t.tracks.nonTechnicalTitle}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nonTechnicalTracks.map((track, i) => {
              const Icon = trackIcons[track] ?? Users;
              return (
                <motion.div
                  key={track}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Card hover padding="md" className="h-full border-accent-cyan/20 flex flex-col justify-between">
                    <div>
                      <div className="p-3 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 inline-block mb-3 text-accent-cyan">
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{track}</h3>
                      <p className="text-sm text-foreground-muted leading-relaxed">
                        {t.tracks.descriptions[track]}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Social Conversion CTA */}
        <Card padding="lg" className="text-center bg-gradient-to-b from-card to-background-secondary border-accent-blue/30 shadow-card">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {t.tracks.followCta}
          </h2>
          <p className="text-foreground-muted mb-6 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            {t.tracks.followBody}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 max-w-3xl mx-auto mb-8">
            {socialPlatforms.map((p) => {
              const Icon = p.icon;
              return (
                <a
                  key={p.key}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-border bg-white/[0.02] text-xs font-semibold text-foreground-muted hover:text-accent-cyan hover:border-accent-cyan/40 hover:bg-white/[0.05] transition-all"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{p.name}</span>
                </a>
              );
            })}
          </div>

          <div className="flex justify-center">
            <Link href="/challenges">
              <Button size="lg" className="gap-2 font-bold shadow-glow">
                <Gamepad2 className="h-5 w-5" />
                <span>{t.common.startChallenge}</span>
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
