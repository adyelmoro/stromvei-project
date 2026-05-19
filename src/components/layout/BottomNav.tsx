"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const tabs = [
    {
      href: "/",
      label: t.nav.map,
      icon: (active: boolean) => (
        // Map pin icon
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={active ? 0 : 1.8}
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" fill={active ? "white" : "none"} stroke={active ? "none" : "currentColor"} strokeWidth="1.8" />
        </svg>
      ),
    },
    {
      href: "/saved",
      label: t.nav.savedShort,
      icon: (active: boolean) => (
        // Bookmark icon
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        </svg>
      ),
    },
    {
      href: "/about",
      label: t.nav.aboutShort,
      icon: (active: boolean) => (
        // Info circle icon
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="12" y1="12" x2="12" y2="16" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 sm:hidden bg-[#0D1527]/95 backdrop-blur-md border-t border-white/10"
      style={{ zIndex: 10 }}
      aria-label="Navigasjon"
    >
      <div className="flex">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={[
                "flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors",
                active ? "text-brand-blue" : "text-white/40 hover:text-white/60",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              {tab.icon(active)}
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area padding for phones with home indicator */}
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
}
