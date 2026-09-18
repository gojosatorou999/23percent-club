"use client";

import Link from "next/link";
import { CalendarPlus, Check } from "lucide-react";
import { getEvent, icsFor } from "@/content/events";
import { logActivity, notify, toast, update, useHydrated, useProfile } from "@/lib/store/store";

export function downloadIcs(slug: string) {
  const e = getEvent(slug);
  if (!e) return;
  const blob = new Blob([icsFor(e, window.location.origin)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${e.slug}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Register / unregister, add to calendar. Client-only because it reads the local profile. */
export function RegisterButton({ slug, past, compact = false }: { slug: string; past: boolean; compact?: boolean }) {
  const hydrated = useHydrated();
  const p = useProfile();
  const e = getEvent(slug)!;
  const registered = hydrated && !!p.events[slug];

  if (past) {
    return (
      <Link href={`/events/${slug}`} className={compact ? "btn btn-ghost btn-sm" : "btn btn-ghost"}>
        Read the session notes
      </Link>
    );
  }

  const register = () => {
    update((d) => ({ events: { ...d.events, [slug]: new Date().toISOString() } }));
    notify({ title: `You're registered: ${e.title}`, body: "Add it to your calendar so you don't miss it.", href: `/events/${slug}`, kind: "event" });
    logActivity("event", `Registered for “${e.title}”`, `/events/${slug}`);
    toast("You're registered", "It's in your dashboard. Add it to your calendar too.", "pos");
  };

  const cancel = () => {
    update((d) => {
      const ev = { ...d.events };
      delete ev[slug];
      return { events: ev };
    });
    toast("Registration cancelled");
  };

  if (registered) {
    return (
      <div className="flex flex-wrap gap-2">
        <span className={`inline-flex items-center gap-2 rounded-xl bg-pos-soft px-4 font-semibold text-pos ${compact ? "min-h-[40px] text-sm" : "min-h-[48px]"}`}>
          <Check className="h-4 w-4" /> Registered
        </span>
        <button type="button" onClick={() => downloadIcs(slug)} className={compact ? "btn btn-ghost btn-sm" : "btn btn-ghost"}>
          <CalendarPlus className="h-4 w-4" /> Add to calendar
        </button>
        {!compact && (
          <button type="button" onClick={cancel} className="btn btn-quiet">
            Cancel
          </button>
        )}
      </div>
    );
  }
  return (
    <button type="button" onClick={register} className={compact ? "btn btn-primary btn-sm" : "btn btn-primary"}>
      Register free
    </button>
  );
}
