"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, Bookmark, Clock3, GraduationCap, LayoutDashboard, Settings, Target, UserRound, Wallet } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAccount, useHydrated } from "@/lib/store/store";
import { Avatar } from "@/components/layout/AccountControls";

export const DASH_LINKS = [
  { href: "/dashboard", label: "Overview", Icon: LayoutDashboard },
  { href: "/dashboard/learning", label: "Learning", Icon: GraduationCap },
  { href: "/dashboard/goals", label: "Goals", Icon: Target },
  { href: "/dashboard/tracker", label: "Money tracker", Icon: Wallet },
  { href: "/dashboard/saved", label: "Saved", Icon: Bookmark },
  { href: "/dashboard/achievements", label: "Achievements", Icon: Award },
  { href: "/dashboard/activity", label: "Activity", Icon: Clock3 },
  { href: "/dashboard/profile", label: "Profile", Icon: UserRound },
  { href: "/dashboard/settings", label: "Settings", Icon: Settings },
];

export function DashNav() {
  const pathname = usePathname();
  const account = useAccount();
  const hydrated = useHydrated();
  return (
    <>
      {/* Mobile: horizontal tabs */}
      <nav aria-label="Dashboard" className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 lg:hidden">
        {DASH_LINKS.map(({ href, label }) => (
          <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} data-active={pathname === href} className="chip shrink-0">
            {label}
          </Link>
        ))}
      </nav>
      {/* Desktop: sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-[calc(var(--nav-h)+24px)] rounded-[24px] border border-line bg-surface p-3">
          <div className="flex items-center gap-3 px-2 pb-3 pt-1">
            {hydrated && account ? <Avatar name={account.name} className="h-10 w-10 text-sm" /> : <span className="g-aurora h-10 w-10 rounded-full" aria-hidden />}
            <div className="min-w-0">
              <p className="truncate font-semibold">{hydrated && account ? account.name : "Guest"}</p>
              <p className="truncate text-xs text-ink-3">{hydrated && account ? account.email : "Progress saved on this device"}</p>
            </div>
          </div>
          <div className="hairline mb-2" />
          <ul className="space-y-0.5">
            {DASH_LINKS.map(({ href, label, Icon }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link href={href} aria-current={active ? "page" : undefined} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] transition-colors", active ? "bg-accent-soft font-semibold text-accent" : "text-ink-2 hover:bg-surface-2")}>
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
}

export function GuestBanner() {
  const hydrated = useHydrated();
  const account = useAccount();
  if (!hydrated || account) return null;
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-[22px] border border-accent/30 bg-accent-soft p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <p className="text-ink">
        <b>You&apos;re exploring as a guest.</b> Everything you do is saved on this device. Create a free account to put your name on it and your certificates.
      </p>
      <div className="flex shrink-0 gap-2">
        <Link href="/signup?next=/dashboard" className="btn btn-primary btn-sm">
          Create account
        </Link>
        <Link href="/login?next=/dashboard" className="btn btn-ghost btn-sm">
          Log in
        </Link>
      </div>
    </div>
  );
}
