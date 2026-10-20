"use client";

import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  LinktreeIcon,
  TikTokIcon,
  WebsiteIcon,
} from "@/components/icons/SocialIcons";
import { socialLinks } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/context";

const socialItems = [
  { key: "linktree" as const, href: socialLinks.linktree, icon: LinktreeIcon },
  { key: "website" as const, href: socialLinks.website, icon: WebsiteIcon },
  { key: "instagram" as const, href: socialLinks.instagram, icon: InstagramIcon },
  { key: "facebook" as const, href: socialLinks.facebook, icon: FacebookIcon },
  { key: "linkedin" as const, href: socialLinks.linkedin, icon: LinkedInIcon },
  { key: "tiktok" as const, href: socialLinks.tiktok, icon: TikTokIcon },
] as const;

const quickLinks = [
  { href: "/", key: "home" as const },
  { href: "/about", key: "about" as const },
  { href: "/tracks", key: "tracks" as const },
  { href: "/challenges", key: "challenges" as const },
];

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-background-secondary mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-sm font-bold text-foreground mb-2">
              {t.nav.brand}
            </h3>
            <p className="text-sm text-foreground-muted">{t.footer.tagline}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map(({ href, key }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-foreground-muted hover:text-accent-blue transition-colors"
                  >
                    {t.nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              {t.footer.social}
            </h4>
            <ul className="space-y-2">
              {socialItems.map(({ key, href, icon: Icon }) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-accent-cyan transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    {t.social[key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center">
          <p className="text-xs text-foreground-muted">
            © {new Date().getFullYear()} {t.nav.brand}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
