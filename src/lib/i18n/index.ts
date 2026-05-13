import no from "./no";
import en from "./en";
import type { Translations } from "./no";

export type Language = "no" | "en";
export type { Translations };

export const translations: Record<Language, Translations> = { no, en };

export const STORAGE_KEY = "stromvei-lang";

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}
