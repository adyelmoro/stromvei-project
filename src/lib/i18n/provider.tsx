"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { translations, STORAGE_KEY } from "./index";
import type { Language, Translations } from "./index";

interface I18nContextValue {
  lang: Language;
  t: Translations;
  setLang: (lang: Language) => void;
}

import no from "./no";

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
