"use client";

import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
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
import { socialLinks } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/context";

interface LockedModalProps {
  challengeName: string;
}

const socialPlatforms = [
  { key: "linktree", name: "Linktree", href: socialLinks.linktree, icon: LinktreeIcon },
  { key: "website", name: "Website", href: socialLinks.website, icon: WebsiteIcon },
  { key: "instagram", name: "Instagram", href: socialLinks.instagram, icon: InstagramIcon },
  { key: "tiktok", name: "TikTok", href: socialLinks.tiktok, icon: TikTokIcon },
  { key: "linkedin", name: "LinkedIn", href: socialLinks.linkedin, icon: LinkedInIcon },
  { key: "facebook", name: "Facebook", href: socialLinks.facebook, icon: FacebookIcon },
] as const;

export function LockedModal({ challengeName }: LockedModalProps) {
  const { t, lang } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md my-8"
      >
        <Card
          padding="lg"
          className="border-red-500/30 text-center shadow-card bg-gradient-to-b from-[#0f172a] to-[#050b18]"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
            <Lock className="h-8 w-8" />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">
            {lang === "ar" ? "خلصت محاولاتك في التحدي ده." : "All attempts used for this challenge."}
          </h2>

          <p className="text-lg font-medium text-red-400 mb-2">
            {lang === "ar" ? "شكراً لمشاركتك ❤️" : "Thank you for participating ❤️"}
          </p>

          <p className="text-sm text-foreground-muted mb-6 leading-relaxed">
            {lang === "ar"
              ? `استنفدت كل المحاولات المتاحة لتحدي (${challengeName}). يمكنك تجربة تحديات أخرى أو متابعة التيم لمعرفة الفعاليات القادمة!`
              : `You have consumed all 3 attempts for (${challengeName}). Explore our other challenges or follow our social channels for upcoming events!`}
          </p>

          <div className="mb-6 p-3 rounded-xl bg-white/[0.03] border border-border">
            <h4 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2.5">
              {t.common.followUs}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {socialPlatforms.map((p) => {
                const Icon = p.icon;
                return (
                  <a
                    key={p.key}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 p-2 rounded-lg border border-border bg-white/[0.02] text-[11px] font-medium text-foreground-muted hover:text-accent-cyan hover:border-accent-cyan/30 transition-colors"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{p.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <Link href="/challenges">
              <Button fullWidth variant="primary" size="md">
                <Sparkles className="h-4 w-4" />
                <span>{t.common.returnChallenges}</span>
              </Button>
            </Link>
            <Link href="/">
              <Button fullWidth variant="ghost" size="sm">
                {t.common.returnHome}
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
