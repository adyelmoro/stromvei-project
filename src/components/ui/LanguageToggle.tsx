"use client";

import { useI18n } from "@/lib/i18n/provider";

export default function LanguageToggle() {
  const { lang, setLang } = useI18n();

  return (
    <div className="flex items-center bg-brand-dark/80 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setLang("no")}
        className={[
          "px-2.5 py-1.5 text-xs font-medium transition-colors",
          lang === "no"
            ? "text-white bg-white/10"
            : "text-white/35 hover:text-white/60",
        ].join(" ")}
        aria-label="Norsk"
        aria-pressed={lang === "no"}
      >
        NO
      </button>
      <div className="w-px h-3 bg-white/10 flex-shrink-0" />
      <button
        onClick={() => setLang("en")}
        className={[
          "px-2.5 py-1.5 text-xs font-medium transition-colors",
          lang === "en"
            ? "text-white bg-white/10"
            : "text-white/35 hover:text-white/60",
        ].join(" ")}
        aria-label="English"
        aria-pressed={lang === "en"}
      >
        EN
      </button>
    </div>
  );
}
