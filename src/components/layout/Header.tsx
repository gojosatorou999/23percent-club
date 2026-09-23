"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { NAV, TOP_LINKS } from "@/content/nav";
import { ThemeToggle } from "./ThemeToggle";
import { AccountButton, NotificationBell } from "./AccountControls";
import { openSearch } from "./SearchLauncher";
import { lockScroll } from "@/components/motion/SmoothScroll";
import { cn } from "@/lib/cn";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const navRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState({ left: 0, width: 0, on: false });

  // The pill glides to whichever item is under the pointer, and rests on the current section.
  const pillTo = (el: HTMLElement | null) => {
    if (!el) return setPill((p) => ({ ...p, on: false }));
    setPill({ left: el.offsetLeft, width: el.offsetWidth, on: true });
  };
  const pillHome = () => pillTo(navRef.current?.querySelector<HTMLElement>('[data-current="true"]') ?? null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const [path, setPath] = useState(pathname);
  if (path !== pathname) {
    setPath(pathname);
    setOpenGroup(null);
    setDrawer(false);
  }

  useEffect(() => {
    const id = requestAnimationFrame(pillHome);
    const late = window.setTimeout(pillHome, 900);
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(late);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    lockScroll(drawer);
    return () => lockScroll(false);
  }, [drawer]);

  useEffect(() => {
    if (!openGroup && !drawer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenGroup(null);
        setDrawer(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openGroup, drawer]);

  const enter = (id: string) => {
    window.clearTimeout(closeTimer.current);
    setOpenGroup(id);
  };
  const leave = () => {
    closeTimer.current = window.setTimeout(() => setOpenGroup(null), 140);
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));
  const group = NAV.find((g) => g.id === openGroup);

  return (
    <>
      <header
        className={cn("nav-shell nav-enter fixed inset-x-0 top-0 z-[60]", (scrolled || openGroup || drawer) && "glass")}
        data-scrolled={scrolled || !!openGroup || drawer}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
        onMouseLeave={leave}
      >
        <span className="nav-line" aria-hidden />
        <div className="wrap flex h-[var(--nav-h)] items-center gap-3">
          <Link href="/" className="logo-link mr-2 shrink-0 rounded-lg" aria-label="23percent club home">
            <Logo />
          </Link>

          <nav
            ref={navRef}
            aria-label="Main"
            className="relative hidden flex-1 items-center gap-0.5 lg:flex"
            onMouseLeave={pillHome}
            onFocus={(e) => pillTo((e.target as HTMLElement).closest<HTMLElement>(".nav-link"))}
          >
            <span className="nav-pill" style={{ left: pill.left, width: pill.width, opacity: pill.on ? 1 : 0 }} aria-hidden />
            {NAV.map((g, i) => (
              <div key={g.id} className="nav-item" style={{ ["--d" as string]: i }} onMouseEnter={() => enter(g.id)}>
                <button
                  type="button"
                  aria-expanded={openGroup === g.id}
                  aria-controls="mega-panel"
                  data-current={isActive(g.href)}
                  onMouseEnter={(e) => pillTo(e.currentTarget)}
                  onClick={() => setOpenGroup((o) => (o === g.id ? null : g.id))}
                  className={cn(
                    "nav-link flex h-10 items-center gap-1 rounded-xl px-3.5 text-[0.95rem] font-medium",
                    openGroup === g.id || isActive(g.href) ? "text-ink" : "text-ink-2 hover:text-ink",
                  )}
                >
                  {g.label}
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", openGroup === g.id && "rotate-180")} aria-hidden />
                </button>
              </div>
            ))}
            {TOP_LINKS.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                data-current={isActive(l.href)}
                onMouseEnter={(e) => {
                  leave();
                  pillTo(e.currentTarget);
                }}
                style={{ ["--d" as string]: NAV.length + i }}
                className={cn(
                  "nav-item nav-link flex h-10 items-center rounded-xl px-3.5 text-[0.95rem] font-medium",
                  isActive(l.href) ? "text-ink" : "text-ink-2 hover:text-ink",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={openSearch}
              className="search-pill hidden h-10 items-center gap-2 rounded-xl px-3 text-sm text-ink-3 md:flex"
              aria-label="Search"
            >
              <Search className="h-4 w-4" aria-hidden />
              <span className="pr-6">Search</span>
              <kbd className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[11px]">Ctrl K</kbd>
            </button>
            <button type="button" onClick={openSearch} className="btn btn-quiet btn-icon md:hidden" aria-label="Search">
              <Search className="h-[19px] w-[19px]" aria-hidden />
            </button>
            <ThemeToggle className="hidden sm:inline-flex" />
            <div className="hidden sm:block">
              <NotificationBell />
            </div>
            <AccountButton />
            <button
              type="button"
              onClick={() => setDrawer((d) => !d)}
              className="btn btn-quiet btn-icon lg:hidden"
              aria-label={drawer ? "Close menu" : "Open menu"}
              aria-expanded={drawer}
            >
              {drawer ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </div>

        {/* Desktop mega panel */}
        {group && (
          <div
            id="mega-panel"
            className="mega-in relative hidden lg:block"
            onMouseEnter={() => enter(group.id)}
          >
            <div className="fade-rule" aria-hidden />
            <div className="wrap grid grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] gap-10 py-8">
              <div>
                <p className="font-display text-2xl font-semibold tracking-tight">{group.label}</p>
                <p className="mt-2 max-w-xs text-ink-3">{group.intro}</p>
                <Link href={group.href} className="btn btn-ghost btn-sm mt-5">
                  Open {group.label.toLowerCase()}
                </Link>
              </div>
              <ul className={cn("grid gap-1", group.links.some((l) => l.blurb) ? "grid-cols-2" : "grid-cols-3")}>
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="mega-link block rounded-2xl px-4 py-3 hover:bg-surface-2">
                      <span className="block font-medium text-ink">{l.label}</span>
                      {l.blurb && <span className="mt-0.5 block text-sm text-ink-3">{l.blurb}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[55] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="anim-fade absolute inset-0 bg-bg" />
          <div
            className="anim-rise absolute inset-x-0 bottom-0 overflow-y-auto overscroll-contain"
            style={{ top: "calc(var(--nav-h) + env(safe-area-inset-top))" }}
            data-lenis-prevent
          >
            <div className="wrap pb-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+24px)] pt-4">
              {NAV.map((g) => (
                <section key={g.id} className="border-b border-line py-5">
                  <Link href={g.href} className="font-display text-[1.6rem] font-semibold tracking-tight">
                    {g.label}
                  </Link>
                  <ul className="mt-3 grid grid-cols-1 gap-0.5 xs:grid-cols-2">
                    {g.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="flex min-h-[44px] items-center rounded-xl px-1 text-[1.02rem] text-ink-2 active:bg-surface-2">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
              <section className="border-b border-line py-5">
                <Link href="/events" className="font-display text-[1.6rem] font-semibold tracking-tight">
                  Events and live
                </Link>
              </section>
              <div className="flex items-center justify-between py-5">
                <span className="text-ink-3">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
