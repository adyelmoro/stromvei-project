"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import LanguageToggle from "@/components/ui/LanguageToggle";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-brand-dark text-white pb-24 sm:pb-8">
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          {t.nav.map}
        </Link>
        <span className="text-white font-bold text-sm tracking-tight">
          Strøm<span className="text-brand-blue font-light">Vei</span>
        </span>
        <LanguageToggle />
      </header>

      <main className="max-w-lg mx-auto px-5 py-8 space-y-8">
        {/* Title */}
        <div>
          <h1 className="text-xl font-semibold text-white mb-2">{t.about.pageTitle}</h1>
          <p className="text-white/60 text-sm leading-relaxed">{t.about.description}</p>
        </div>

        {/* Data source */}
        <Section title="Datakilde">
          <p className="text-white/55 text-sm leading-relaxed">{t.about.dataCredit}</p>
          <a
            href="https://nobil.no"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-brand-blue text-sm hover:text-blue-300 transition-colors"
          >
            nobil.no
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </Section>

        {/* Tech stack */}
        <Section title="Teknologi">
          <div className="flex flex-wrap gap-2">
            {[
              "Next.js 16",
              "TypeScript",
              "Tailwind CSS",
              "MapLibre GL JS",
              "OpenFreeMap",
              "Supabase",
              "Nobil API",
              "Nominatim",
              "Vercel",
            ].map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-white/60 text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        </Section>

        {/* Built by */}
        <Section title="Om prosjektet">
          <p className="text-white/55 text-sm leading-relaxed">{t.about.builtBy}</p>
          <a
            href="https://github.com/adyelmoro/stromvei-project"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-brand-blue text-sm hover:text-blue-300 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            {t.about.openSource}
          </a>
        </Section>

        {/* Contact */}
        <Section title="Kontakt">
          <p className="text-white/55 text-sm">{t.about.feedback}</p>
        </Section>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs text-white/30 uppercase tracking-widest mb-3">{title}</h2>
      {children}
    </div>
  );
}
