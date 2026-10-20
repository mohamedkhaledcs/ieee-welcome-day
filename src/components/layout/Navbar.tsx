"use client";

import clsx from "clsx";
import { Menu, Volume2, VolumeX, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/context";
import { useProgress } from "@/lib/progress/context";

const navLinks = [
  { href: "/about", key: "about" as const },
  { href: "/tracks", key: "tracks" as const },
  { href: "/challenges", key: "challenges" as const },
];

export function Navbar() {
  const { t, lang, toggleLang } = useLanguage();
  const { progress, toggleSound } = useProgress();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/images/logo.jpg"
            alt="IEEE OCS SB Logo"
            width={40}
            height={40}
            className="rounded-lg object-cover"
          />
          <div className="leading-tight">
            <span className="block text-sm font-bold tracking-wide text-foreground group-hover:text-accent-blue transition-colors">
              {t.nav.brand}
            </span>
            <span className="block text-[10px] text-foreground-muted uppercase tracking-widest">
              {t.nav.subtitle}
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "px-4 py-2 text-sm rounded-lg transition-colors",
                pathname === href
                  ? "text-accent-blue bg-accent-blue/10"
                  : "text-foreground-muted hover:text-foreground hover:bg-white/5"
              )}
            >
              {t.nav[key]}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-white/5 transition-colors"
            aria-label={progress.soundEnabled ? t.common.soundOff : t.common.soundOn}
          >
            {progress.soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLang}
            aria-label={t.common.language}
          >
            {lang === "ar" ? "EN" : "AR"}
          </Button>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-foreground-muted hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background-secondary px-4 py-3 space-y-1">
          {navLinks.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                "block px-4 py-3 text-sm rounded-lg transition-colors",
                pathname === href
                  ? "text-accent-blue bg-accent-blue/10"
                  : "text-foreground-muted hover:text-foreground hover:bg-white/5"
              )}
            >
              {t.nav[key]}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
