"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LayoutDashboard, LogOut, Settings, UserRound } from "lucide-react";
import { logOut, update, useAccount, useHydrated, useProfile } from "@/lib/store/store";
import { relativeTime } from "@/lib/format";
import { cn } from "@/lib/cn";

function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [path, setPath] = useState(pathname);
  if (path !== pathname) {
    setPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return { open, setOpen, ref };
}

export function Avatar({ name, className = "h-9 w-9 text-sm" }: { name: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className={cn("g-aurora grid shrink-0 place-items-center rounded-full font-semibold text-white", className)} aria-hidden>
      {initials || "?"}
    </span>
  );
}

export function NotificationBell() {
  const hydrated = useHydrated();
  const profile = useProfile();
  const { open, setOpen, ref } = usePopover();
  const unread = hydrated ? profile.notifications.filter((n) => !n.read).length : 0;

  const markAll = () => update((d) => ({ notifications: d.notifications.map((n) => ({ ...n, read: true })) }));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="btn btn-quiet btn-icon relative"
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Bell className="h-[19px] w-[19px]" aria-hidden />
        {unread > 0 && (
          <span className="absolute right-2 top-2 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-on-accent">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="anim-pop absolute right-[-56px] top-[calc(100%+10px)] z-50 w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-line bg-surface lift-lg sm:right-0">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-semibold">Notifications</p>
            {unread > 0 && (
              <button type="button" onClick={markAll} className="text-sm font-medium text-accent">
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-[60dvh] overflow-y-auto" data-lenis-prevent>
            {profile.notifications.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-ink-3">
                Nothing yet. Finish a lesson or register for an event and updates will appear here.
              </li>
            )}
            {profile.notifications.slice(0, 20).map((n) => (
              <li key={n.id} className="border-b border-line last:border-0">
                <Link
                  href={n.href ?? "/dashboard"}
                  onClick={() => update((d) => ({ notifications: d.notifications.map((x) => (x.id === n.id ? { ...x, read: true } : x)) }))}
                  className="flex gap-3 px-4 py-3 transition-colors hover:bg-surface-2"
                >
                  <span className={cn("mt-2 h-2 w-2 shrink-0 rounded-full", n.read ? "bg-transparent" : "bg-accent")} />
                  <span className="min-w-0">
                    <span className="block text-[0.95rem] font-medium leading-snug">{n.title}</span>
                    <span className="mt-0.5 block text-sm text-ink-3">{n.body}</span>
                    <span className="mt-1 block text-xs text-ink-3">{relativeTime(n.at)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function AccountButton() {
  const hydrated = useHydrated();
  const account = useAccount();
  const router = useRouter();
  const { open, setOpen, ref } = usePopover();

  if (!hydrated) return <span className="skeleton hidden h-10 w-24 sm:block" aria-hidden />;

  if (!account) {
    return (
      <div className="flex items-center gap-1.5">
        <Link href="/login" className="btn btn-quiet btn-sm hidden sm:inline-flex">
          Log in
        </Link>
        <Link href="/signup" className="btn btn-primary btn-sm">
          Join free
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-2 rounded-full p-0.5 pr-0.5 transition-colors hover:bg-surface-2 sm:pr-3"
      >
        <Avatar name={account.name} />
        <span className="hidden max-w-[8rem] truncate text-sm font-medium sm:block">{account.name.split(" ")[0]}</span>
      </button>
      {open && (
        <div className="anim-pop absolute right-0 top-[calc(100%+10px)] z-50 w-64 overflow-hidden rounded-2xl border border-line bg-surface p-1.5 lift-lg">
          <div className="px-3 py-2.5">
            <p className="truncate font-semibold">{account.name}</p>
            <p className="truncate text-sm text-ink-3">{account.email}</p>
          </div>
          <div className="hairline my-1" />
          {[
            { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
            { href: "/dashboard/profile", label: "Profile", Icon: UserRound },
            { href: "/dashboard/settings", label: "Settings", Icon: Settings },
          ].map(({ href, label, Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] hover:bg-surface-2">
              <Icon className="h-[18px] w-[18px] text-ink-3" aria-hidden />
              {label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              logOut();
              setOpen(false);
              router.push("/");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[0.95rem] hover:bg-surface-2"
          >
            <LogOut className="h-[18px] w-[18px] text-ink-3" aria-hidden />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
