"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "@/lib/i18n/context";
import { ProgressProvider } from "@/lib/progress/context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ProgressProvider>{children}</ProgressProvider>
    </LanguageProvider>
  );
}
