import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PlausibleScript } from "@/components/analytics/PlausibleScript";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { RouteTransition } from "@/components/motion/RouteTransition";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { UtmCapture } from "@/components/analytics/UtmCapture";
import { THEME_INIT_SCRIPT } from "@/components/theme/theme-script";
import { siteUrl } from "@/lib/seo";
import { buildSearchIndex } from "@/lib/search-index";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_NAME = "23% Club";
const DEFAULT_DESCRIPTION =
  "Financial education and behavioural-investing tools for Indian retail investors. We don't manage your money. We teach you how to manage it.";

/**
 * Sets the `.js` class before first paint.
 *
 * Every scroll-reveal's hidden starting state is scoped to `.js`, so this
 * one line is what makes the animations opt-in rather than load-bearing:
 * with scripting off — or if this script ever fails — the class is absent,
 * nothing is hidden, and the page reads normally. Running it inline in
 * <head> rather than on hydration is what avoids a flash of already-visible
 * content snapping back to hidden.
 */
const JS_FLAG = "document.documentElement.classList.add('js')";

/**
 * Both pre-paint scripts, concatenated into one <script> tag.
 *
 * Order matters only in that both must run before the first paint: the
 * theme attribute decides what colour the page is, and the `.js` class
 * decides whether anything is hidden pending a reveal. Getting either one
 * late produces the same class of defect — a visible correction after the
 * visitor is already looking at the page.
 */
const PRE_PAINT_SCRIPT = `${THEME_INIT_SCRIPT}
${JS_FLAG}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "23% Club — Learn, Invest, Grow, Compound",
    template: "%s | 23% Club",
  },
  description: DEFAULT_DESCRIPTION,
  // Every route inherits these; routes with their own openGraph/twitter
  // block (blog posts, legends) override title/description/images only —
  // Next merges rather than replaces, so siteName/type/locale here still
  // apply everywhere.
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
    title: "23% Club — Learn, Invest, Grow, Compound",
    description: DEFAULT_DESCRIPTION,
    images: ["/og-default.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "23% Club — Learn, Invest, Grow, Compound",
    description: DEFAULT_DESCRIPTION,
    images: ["/og-default.svg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // Read from the content directory at build time and handed to the client
  // header as a prop, so search needs no API route and no client fetch.
  const searchIndex = buildSearchIndex();

  return (
    <html
      lang="en"
      /*
        The pre-paint script deliberately writes to this element before React
        ever sees it — a `data-theme` attribute and a `js` class that are, by
        design, impossible to know at render time on the server. React would
        otherwise report both as hydration mismatches and, in the case of the
        class, "fix" them by reverting to the server's value, which would
        unhide every scroll reveal on the page. Scoped to <html> only; a
        blanket suppression further down the tree would hide real mismatches.
      */
      suppressHydrationWarning
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <PlausibleScript />
        <RevealObserver />
        <ScrollProgress />
        <a
          href="#page-content"
          className="sr-only rounded px-5 py-3 font-body text-sm font-medium focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-surface-3 focus:text-accent focus:outline-2 focus:outline-accent"
        >
          Skip to content
        </a>
        <Navbar searchIndex={searchIndex} />
        {/*
          The header is fixed so a page can open with a full-bleed deep-field
          band running behind it; the offset the header used to take up in
          flow is paid here instead. A section that wants to bleed under the
          header cancels it with Section's `bleedTop`.
        */}
        <main
          id="page-content"
          className="flex flex-1 flex-col pt-[var(--nav-h)]"
        >
          <RouteTransition>{children}</RouteTransition>
        </main>
        <Footer />
        <FloatingActions />
        <CookieBanner />
        {/*
          UtmCapture reads searchParams which requires Suspense in the
          App Router — the fallback is null because this component has no
          visual output, it only writes to sessionStorage.
        */}
        <Suspense fallback={null}>
          <UtmCapture />
        </Suspense>
      </body>
    </html>
  );
}
