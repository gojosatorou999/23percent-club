"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { NAV, TOP_LINKS } from "@/content/nav";
import { ThemeToggle } from "./ThemeToggle";
import { AccountButton, NotificationBell } from "./AccountControls";
import { openSearch } from "./CommandPalette";
import { lockScroll } from "@/components/motion/SmoothScroll";
import { cn } from "@/lib/cn";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

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
        className={cn(
          "fixed inset-x-0 top-0 z-[60] transition-[background-color,border-color,box-shadow] duration-300",
          scrolled || openGroup || drawer ? "glass border-b border-line" : "border-b border-transparent",
        )}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
        onMouseLeave={leave}
      >
        <div className="wrap flex h-[var(--nav-h)] items-center gap-3">
          <Link href="/" className="mr-2 shrink-0 rounded-lg" aria-label="23% Club home">
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden flex-1 items-center gap-0.5 lg:flex">
            {NAV.map((g) => (
              <div key={g.id} onMouseEnter={() => enter(g.id)}>
                <button
                  type="button"
                  aria-expanded={openGroup === g.id}
                  aria-controls="mega-panel"
                  onClick={() => setOpenGroup((o) => (o === g.id ? null : g.id))}
                  className={cn(
                    "flex h-10 items-center gap-1 rounded-xl px-3.5 text-[0.95rem] font-medium transition-colors",
                    openGroup === g.id || isActive(g.href) ? "bg-surface-2 text-ink" : "text-ink-2 hover:text-ink",
                  )}
                >
                  {g.label}
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", openGroup === g.id && "rotate-180")} aria-hidden />
                </button>
              </div>
            ))}
            {TOP_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onMouseEnter={leave}
                className={cn(
                  "flex h-10 items-center rounded-xl px-3.5 text-[0.95rem] font-medium transition-colors",
                  isActive(l.href) ? "bg-surface-2 text-ink" : "text-ink-2 hover:text-ink",
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
              className="hidden h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm text-ink-3 transition-colors hover:border-line-strong md:flex"
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
            className="anim-fade hidden border-t border-line lg:block"
            onMouseEnter={() => enter(group.id)}
          >
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
                    <Link href={l.href} className="block rounded-2xl px-4 py-3 transition-colors hover:bg-surface-2">
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
