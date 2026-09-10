"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoHorizontal } from "@/components/brand/LogoHorizontal";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SiteSearch } from "@/components/search/SiteSearch";
import type { SearchDoc } from "@/lib/search-index";
import { Container } from "./Container";

const NAV_ITEMS = [
  { label: "Tools", href: "/tools" },
  { label: "Learn", href: "/learn" },
  { label: "Legends", href: "/legends" },
  { label: "Market", href: "/market" },
  { label: "About", href: "/about" },
] as const;

/**
 * Roughly the tallest a deep band's fade-to-white seam gets (see
 * `.deep-seam` in globals.css). Trimmed off the band's bottom edge so the
 * header turns solid before it reaches the part of the band that is already
 * dissolving into the page below.
 */
const SEAM_ALLOWANCE = 120;

function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * A fixed header with two states.
 *
 * Over a deep-field band it is invisible — no background, white type — so
 * the band reads as one uninterrupted image from the top of the screen.
 * The moment that band scrolls out from behind it, the header materialises
 * as light glass with the original ink-on-white nav.
 *
 * Which state it starts in is measured, not configured: the header looks at
 * whether the first section of the page is a `.deep-field` and, if so,
 * tracks that element's bottom edge. Pages get the effect automatically by
 * opening with a deep band, and a page that doesn't simply gets the solid
 * header from the first frame.
 */
export function Navbar({ searchIndex }: { searchIndex: SearchDoc[] }) {
  const pathname = usePathname();
  const [isOverDeep, setIsOverDeep] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const bandsRef = useRef<HTMLElement[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Re-collect the page's deep bands on every navigation: the new page may
  // have none, and the old page's elements are gone.
  useEffect(() => {
    // Matching on the class rather than on a prop keeps this automatic — any
    // section that renders a deep band gets the transparent header while it
    // is behind it, with no per-page wiring.
    const content = document.getElementById("page-content");
    bandsRef.current = content
      ? [...content.querySelectorAll<HTMLElement>(".deep-field")]
      : [];

    let frame = 0;

    function measure() {
      frame = 0;
      // Measured off the header's own box rather than the --nav-h token, so
      // it stays correct if the header's height ever changes at a breakpoint.
      const navHeight = headerRef.current?.getBoundingClientRect().height ?? 64;

      // Transparent whenever deep pixels are passing behind the header — not
      // only over the page's first band. SEAM_ALLOWANCE keeps it from staying
      // transparent over a band's dissolve-to-white footer, where white type
      // would end up sitting on a whitening background.
      const overDeep = bandsRef.current.some((band) => {
        const rect = band.getBoundingClientRect();
        return (
          rect.top <= navHeight && rect.bottom - SEAM_ALLOWANCE > navHeight
        );
      });
      setIsOverDeep(overDeep);
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  const close = useCallback(() => setIsOpen(false), []);

  // A drawer that survives a navigation is a bug in every design system.
  // Adjusting state during render rather than in an effect is React's own
  // recommendation for "reset some state when a prop changes" — it avoids
  // the extra commit an effect would cost, and closes the drawer even on a
  // navigation the drawer's own links didn't trigger (browser Back).
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        toggleRef.current?.focus();
      }
    }

    // Scroll-lock the page behind the drawer, and restore exactly what was
    // there before rather than assuming `overflow: visible`.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    // Move focus into the panel so the drawer is immediately keyboard-
    // operable, not something you have to tab across the page to reach.
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  // An open drawer puts its own dark panel behind the header, so the header
  // drops its light background then too — otherwise a white bar would sit on
  // top of the drawer.
  const onDeep = isOverDeep;
  const isBare = isOverDeep || isOpen;

  return (
    <>
      <header
        ref={headerRef}
        // z-60 keeps the header — and with it the hamburger, which becomes
        // the drawer's close button once it animates to an X — above the
        // drawer panel.
        className={`fixed inset-x-0 top-0 z-[60] h-[var(--nav-h)] transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          isBare
            ? "bg-transparent"
            : "border-b border-line bg-surface/85 backdrop-blur-md"
        }`}
      >
        {/*
          A transparent header still needs its own ground. Without this
          gradient the nav labels compete with whatever content is scrolling
          under them; with it, that content reads as passing behind the header
          instead of colliding with it.
        */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-ink/75 via-ink/40 to-transparent transition-opacity duration-500 ${
            isBare ? "opacity-100" : "opacity-0"
          }`}
        />

        <Container className="flex h-full items-center justify-between">
          {/* The drawer carries its own lockup; two at once is clutter. */}
          <Link
            href="/"
            className={`shrink-0 ${isOpen ? "invisible" : ""}`}
            aria-label="23% Club home"
            onClick={close}
          >
            <LogoHorizontal tone={onDeep ? "light" : "ink"} />
          </Link>

          <div className="flex items-center gap-3 sm:gap-6">
            <nav aria-label="Primary" className="hidden sm:block">
              <ul className="flex items-center gap-8">
                {NAV_ITEMS.map((item) => {
                  const isActive = isActivePath(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`inline-block border-b-2 py-1 font-body text-sm font-medium transition-colors ${
                          onDeep
                            ? isActive
                              ? "border-bright-blue text-white"
                              : "border-transparent text-white/75 hover:text-white"
                            : isActive
                              ? "border-bright-blue text-accent"
                              : "border-transparent text-content-2 hover:text-accent"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/*
              The toggle sits outside <nav> on purpose: it is a page
              control, not a destination, and putting it inside the
              "Primary" navigation landmark would announce it as one more
              place to go. It stays visible at every width — a theme switch
              buried in a drawer is one a visitor on a phone never finds.
            */}
            {/* Follows `isBare`, not `onDeep`: with the drawer open the
                header is over the drawer's own deep panel. */}
            {/* Search sits beside the theme toggle for the same reason it is
                outside <nav>: it is a control, not a destination. Visible at
                every width, because search is the primary way anyone finds a
                specific article on a phone. */}
            <SiteSearch index={searchIndex} tone={isBare ? "light" : "ink"} />

            <ThemeToggle tone={isBare ? "light" : "ink"} />

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              data-open={isOpen}
              className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full sm:hidden"
            >
              <span className="flex h-[14px] w-6 flex-col justify-between">
                {(["burger-top", "burger-mid", "burger-bot"] as const).map(
                  (line) => (
                    <span
                      key={line}
                      aria-hidden="true"
                      // Literal white over a deep band — that band is dark in
                      // both themes. Over the solid header it follows the
                      // body text colour, so it inverts with the theme.
                      className={`burger-line ${line} block h-[2px] w-full rounded-full ${
                        isBare ? "bg-white" : "bg-content"
                      }`}
                    />
                  ),
                )}
              </span>
            </button>
          </div>
        </Container>
      </header>

      {/*
        The drawer is a sibling of <header>, not a child. It has to be: the
        header's `backdrop-filter` makes it a containing block for fixed
        descendants, so a drawer nested inside it gets clipped to the
        header's own 64px box instead of filling the viewport.
      */}
      <MobileDrawer
        ref={panelRef}
        isOpen={isOpen}
        pathname={pathname}
        onClose={close}
      />
    </>
  );
}

function MobileDrawer({
  ref,
  isOpen,
  pathname,
  onClose,
}: {
  ref: React.Ref<HTMLDivElement>;
  isOpen: boolean;
  pathname: string;
  onClose: () => void;
}) {
  return (
    <div className="sm:hidden" data-open={isOpen}>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`drawer-scrim fixed inset-0 z-40 bg-ink/60 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        ref={ref}
        id="mobile-nav"
        data-open={isOpen}
        inert={!isOpen}
        className="drawer-panel deep-field deep-field-quiet on-deep fixed bottom-0 right-0 top-0 z-50 flex w-[85%] max-w-[340px] flex-col justify-between px-7 pb-10 pt-6"
      >
        <div className="relative z-10 flex h-11 items-center">
          <LogoHorizontal tone="light" />
        </div>

        <nav aria-label="Primary, mobile" className="relative z-10">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item, i) => {
              const isActive = isActivePath(pathname, item.href);
              return (
                <li
                  key={item.href}
                  className="drawer-item"
                  // The reference's stagger, to the millisecond: the first
                  // link waits 150ms for the panel to be most of the way
                  // in, then each one follows 75ms behind the last.
                  style={{ ["--stagger" as string]: `${150 + i * 75}ms` }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className={`block py-3 font-display text-2xl font-semibold transition-colors ${
                      isActive
                        ? "text-bright-blue"
                        : "text-white hover:text-bright-blue"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          className="drawer-item relative z-10 flex flex-col gap-4"
          style={{ ["--stagger" as string]: "450ms" }}
        >
          <div className="hairline hairline-deep" />
          <p className="font-body text-sm leading-relaxed text-white/80">
            We don&apos;t manage your money. We teach you how to manage it.
          </p>
          <Link
            href="/disclosures"
            onClick={onClose}
            className="font-body text-sm font-medium text-bright-blue"
          >
            Disclosures
          </Link>
        </div>
      </div>
    </div>
  );
}
