"use client";

import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Compass,
  Heart,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
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

const socialPlatforms = [
  { key: "linktree", name: "Linktree", href: socialLinks.linktree, icon: LinktreeIcon },
  { key: "website", name: "Website", href: socialLinks.website, icon: WebsiteIcon },
  { key: "instagram", name: "Instagram", href: socialLinks.instagram, icon: InstagramIcon },
  { key: "tiktok", name: "TikTok", href: socialLinks.tiktok, icon: TikTokIcon },
  { key: "linkedin", name: "LinkedIn", href: socialLinks.linkedin, icon: LinkedInIcon },
  { key: "facebook", name: "Facebook", href: socialLinks.facebook, icon: FacebookIcon },
] as const;

export default function AboutPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 text-accent-cyan text-xs font-semibold border border-accent-blue/20 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>IEEE OCS SB Student Activity</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground mb-3 tracking-tight">
            {t.about.title}
          </h1>
          <p className="text-foreground-muted max-w-xl mx-auto text-sm sm:text-base">
            {t.about.subtitle}
          </p>
        </div>

        {/* Hero Banner with Team Logo & Mission */}
        <Card padding="lg" className="mb-10 border-accent-blue/30 bg-card/90">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-start">
            <div className="relative p-2 rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-cyan/10 border border-accent-blue/30 shadow-glow shrink-0">
              <Image
                src="/images/logo.jpg"
                alt="IEEE OCS SB Logo"
                width={100}
                height={100}
                className="rounded-xl shadow-glow"
              />
            </div>
            <div className="flex-1">
              <p className="text-base sm:text-lg text-foreground leading-relaxed mb-4">
                {t.about.intro}
              </p>
              <blockquote className="border-s-4 border-accent-blue ps-4 text-accent-cyan italic text-sm sm:text-base">
                &ldquo;{t.about.quote}&rdquo;
              </blockquote>
            </div>
          </div>
        </Card>

        {/* Value Pillars */}
        <div className="grid gap-6 sm:grid-cols-3 mb-12">
          {[
            {
              icon: BookOpen,
              title: t.about.learnTitle,
              body: t.about.learnBody,
              color: "text-accent-blue",
            },
            {
              icon: Users,
              title: t.about.tracksTitle,
              body: t.about.tracksBody,
              color: "text-accent-cyan",
            },
            {
              icon: Heart,
              title: t.about.communityTitle,
              body: t.about.communityBody,
              color: "text-rose-400",
            },
          ].map(({ icon: Icon, title, body, color }) => (
            <Card key={title} hover padding="md" className="flex flex-col justify-between">
              <div>
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-border inline-block mb-3">
                  <Icon className={`h-7 w-7 ${color}`} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-foreground-muted leading-relaxed">{body}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Technical & Non-Technical Tracks Showcase */}
        <Card padding="lg" className="mb-10 border-border">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-accent-blue" />
            <h2 className="text-xl font-bold text-foreground">
              {t.tracks.technicalTitle}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2.5 mb-8">
            {technicalTracks.map((track) => (
              <span
                key={track}
                className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
              >
                {track}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-accent-cyan" />
            <h2 className="text-xl font-bold text-foreground">
              {t.tracks.nonTechnicalTitle}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2.5 mb-8">
            {nonTechnicalTracks.map((track) => (
              <span
                key={track}
                className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20"
              >
                {track}
              </span>
            ))}
          </div>

          {/* Future Tracks Callout */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-border/80 flex items-start gap-3">
            <Compass className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
              {lang === "ar"
                ? "🚀 بنطور مجتمعنا باستمرار: تراكات ومسارات تقنية وفصول تخصصية جديدة قادمة قريباً في مجالات الذكاء الاصطناعي والحوسبة السحابية وغيرها."
                : "🚀 Continuously expanding: new specialized technical tracks and chapters in Artificial Intelligence, Cloud Computing, and more are launching soon."}
            </p>
          </div>
        </Card>

        {/* Social Conversion Card */}
        <Card padding="lg" className="text-center bg-gradient-to-b from-card to-background-secondary border-accent-blue/30 shadow-card">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t.about.followTitle}
          </h2>
          <p className="text-foreground-muted mb-6 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            {t.about.followBody}
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

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/tracks">
              <Button variant="outline" size="md">
                {t.about.ctaTracks}
              </Button>
            </Link>
            <Link href="/challenges">
              <Button variant="primary" size="md" className="font-bold">
                {t.about.ctaChallenges}
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
