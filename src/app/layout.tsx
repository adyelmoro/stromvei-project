import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/provider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { RoutePlannerProvider } from "@/lib/route-planner-context";
import BottomNav from "@/components/layout/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://stromvei-project.vercel.app"),
  title: "StrømVei — Ladekart og ruteplanlegger for Norge",
  description:
    "Finn ladestasjoner og planlegg ruten din. Over 10 000 stasjoner i hele Norge.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "StrømVei — Norway's EV charging map and route planner",
    description:
      "Find charging stations and plan your route. Over 10,000 stations across Norway.",
    siteName: "StrømVei",
    url: "https://stromvei-project.vercel.app",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StrømVei — EV charging map and route planner for Norway",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StrømVei — Norway's EV charging map and route planner",
    description:
      "Find charging stations and plan your route. Over 10,000 stations across Norway.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0066FF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no" className="dark h-full">
      <body className={`${inter.className} bg-brand-dark text-white h-full`}>
        <AuthProvider>
          <I18nProvider>
            <RoutePlannerProvider>
              {children}
              <BottomNav />
            </RoutePlannerProvider>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
