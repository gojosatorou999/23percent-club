import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { SearchLauncher } from "@/components/layout/SearchLauncher";
import { THEME_SCRIPT } from "@/components/layout/ThemeToggle";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SymbolField } from "@/components/motion/SymbolField";
import { Preloader, SPLASH_SCRIPT } from "@/components/motion/Preloader";
import { BackToTop } from "@/components/motion/BackToTop";
import { EdgeLight } from "@/components/motion/EdgeLight";
import { Toaster } from "@/components/ui/Toaster";
import { AuthSync } from "@/components/auth/AuthSync";
import Script from "next/script";

const PLAUSIBLE = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" ? process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN : undefined;
import { DESCRIPTION, SITE_NAME, siteUrl } from "@/lib/seo";
import "./globals.css";
import "./fx.css";

/*
 * Bricolage Grotesque carries headlines and the big numbers — its optical
 * sizing keeps it tight at 100px and legible at 20px. Geist sets body text
 * and every figure in a table, with true tabular numerals. Both are
 * self-hosted by next/font, so Windows, macOS, iOS, Android and Linux all
 * render the same glyphs with no layout shift.
 */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7fd" },
    { media: "(prefers-color-scheme: dark)", color: "#070a24" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "23percent club | Learn how money works", template: "%s | 23percent club" },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ["financial education India", "SIP calculator", "personal finance", "investing course", "tax calculator", "financial literacy"],
  openGraph: { siteName: SITE_NAME, type: "website", locale: "en_IN", images: ["/og-default.svg"] },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, email: false, address: false },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "default" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning className={`${display.variable} ${sans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: SPLASH_SCRIPT }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-surface focus:px-4 focus:py-3 focus:text-accent"
        >
          Skip to content
        </a>
        <Preloader />
        <div className="aurora" aria-hidden>
          <i />
          <i />
          <i />
        </div>
        <SymbolField fixed />
        <EdgeLight />
        <SmoothScroll />
        <Header />
        <main id="main" className="relative min-h-[70vh]" style={{ paddingTop: "calc(var(--nav-h) + env(safe-area-inset-top))" }}>
          {children}
        </main>
        <Footer />
        <BottomTabBar />
        <BackToTop />
        <SearchLauncher />
        <Toaster />
        <AuthSync />
        {PLAUSIBLE && <Script defer data-domain={PLAUSIBLE} src="https://plausible.io/js/script.js" strategy="afterInteractive" />}
      </body>
    </html>
  );
}
