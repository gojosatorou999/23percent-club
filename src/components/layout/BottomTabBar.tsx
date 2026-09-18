"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Calculator, Compass, Home, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/", label: "Home", Icon: Home, match: (p: string) => p === "/" },
  { href: "/learn", label: "Learn", Icon: BookOpen, match: (p: string) => /^\/(learn|universe|insights|junior)/.test(p) },
  { href: "/tools", label: "Tools", Icon: Calculator, match: (p: string) => p.startsWith("/tools") },
  { href: "/know-yourself", label: "Diagnose", Icon: Compass, match: (p: string) => /^\/(know-yourself|tax)/.test(p) },
  { href: "/dashboard", label: "Me", Icon: LayoutDashboard, match: (p: string) => /^\/(dashboard|login|signup)/.test(p) },
];

/** Thumb-reach navigation for phones and small tablets. Hidden from `lg` up. */
export function BottomTabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="glass fixed inset-x-0 bottom-0 z-[58] border-t border-line lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex h-[var(--tabbar-h)] max-w-lg items-stretch justify-around px-2">
        {TABS.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors",
                  active ? "text-accent" : "text-ink-3",
                )}
              >
                <span className={cn("grid h-7 w-12 place-items-center rounded-full transition-colors", active && "bg-accent-soft")}>
                  <Icon className="h-[19px] w-[19px]" strokeWidth={active ? 2.3 : 1.9} aria-hidden />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
