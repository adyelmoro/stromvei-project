"use client";

import { createContext, useContext, useEffect, useState } from "react";
import no from "./no";
import en from "./en";
import type { Translations } from "./no";

export type Language = "no" | "en";

const translations: Record<Language, Translations> = { no, en };

const STORAGE_KEY = "stromvei-lang";

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}

// --- React context (optional — use if you want a context-based hook) ---

interface I18nContextValue {
  lang: Language;
  t: Translations;
  setLang: (lang: Language) => void;
}

import React from "react";

const I18nContext = createContext<I18nContextValue>({
  lang: "no",
  t: no,
  setLang: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("no");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored === "no" || stored === "en") {
      setLangState(stored);
    }
  }, []);

  function setLang(next: Language) {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <I18nContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}
