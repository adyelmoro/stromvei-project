import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/provider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { RoutePlannerProvider } from "@/lib/route-planner-context";
import BottomNav from "@/components/layout/BottomNav";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import IOSInstallBanner from "@/components/IOSInstallBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://stromvei-project.vercel.app"),
  title: "StrømVei — Ladekart og ruteplanlegger for Norge",
  description:
    "Finn ladestasjoner og planlegg ruten din. Over 10 000 stasjoner i hele Norge.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: "/icons/icon-192.png",
  },
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
  themeColor: "#0A0E1A",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover", // allows content behind iOS notch in standalone mode
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no" className="dark h-full">
      <head>
        {/* iOS PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="StrømVei" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png" />
      </head>
      <body className={`${inter.className} bg-brand-dark text-white h-full`}>
        <AuthProvider>
          <I18nProvider>
            <RoutePlannerProvider>
              {children}
              <BottomNav />
            </RoutePlannerProvider>
          </I18nProvider>
        </AuthProvider>
        <IOSInstallBanner />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
