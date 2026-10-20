"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getTranslation,
  type Language,
  type TranslationKeys,
} from "./translations";

const LANG_STORAGE_KEY = "ieee-ocs-lang";

interface LanguageContextValue {
  lang: Language;
  t: TranslationKeys;
  dir: "rtl" | "ltr";
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLang(): Language {
  if (typeof window === "undefined") return "ar";
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === "ar" || stored === "en") return stored;
  } catch {
    /* ignore */
  }
  return "ar";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("ar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLangState(getInitialLang());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang, mounted]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === "ar" ? "en" : "ar"));
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      t: getTranslation(lang),
      dir: lang === "ar" ? "rtl" : "ltr",
      setLang,
      toggleLang,
    }),
    [lang, setLang, toggleLang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
