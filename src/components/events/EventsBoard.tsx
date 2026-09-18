"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock, Users } from "lucide-react";
import { EVENTS, eventWhen, type EventType } from "@/content/events";
import { RegisterButton } from "./EventActions";
import { useHydrated } from "@/lib/store/store";
import { cn } from "@/lib/cn";

/** Build-time "now" until hydration, then the viewer's clock — no hydration mismatch, correct after load. */
export function useNow(buildNow: number) {
  const hydrated = useHydrated();
  // eslint-disable-next-line react-hooks/purity
  return hydrated ? Date.now() : buildNow;
}

export function EventStatus({ slug, start, buildNow }: { slug: string; start: string; buildNow: number }) {
  const now = useNow(buildNow);
  const past = new Date(start).getTime() < now;
  return (
    <div className="flex flex-col gap-3">
      <span className={cn("tag w-fit", past ? "bg-surface-3 text-ink-3" : "bg-pos-soft text-pos")}>{past ? "Past session" : "Upcoming, free"}</span>
      <RegisterButton slug={slug} past={past} />
    </div>
  );
}

const TYPES: (EventType | "All")[] = ["All", "Webinar", "Live class", "Workshop", "Masterclass", "Junior"];

export function EventsBoard({ buildNow }: { buildNow: number }) {
  const now = useNow(buildNow);
  const [type, setType] = useState<EventType | "All">("All");
  const list = EVENTS.filter((e) => type === "All" || e.type === type);
  const upcoming = list.filter((e) => new Date(e.start).getTime() >= now).sort((a, b) => a.start.localeCompare(b.start));
  const past = list.filter((e) => new Date(e.start).getTime() < now).sort((a, b) => b.start.localeCompare(a.start));

  return (
    <div>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Event type">
        {TYPES.map((t) => (
          <button key={t} type="button" role="tab" aria-selected={type === t} onClick={() => setType(t)} className="chip shrink-0">
            {t}
          </button>
        ))}
      </div>

      <h2 className="t-h3 mt-10">Upcoming</h2>
      {upcoming.length === 0 && <p className="mt-4 text-ink-3">No upcoming sessions of this type. Check back soon.</p>}
      <ul className="mt-5 grid gap-4 lg:grid-cols-2">
        {upcoming.map((e) => {
          const w = eventWhen(e.start);
          return (
            <li key={e.slug} className="flex flex-col overflow-hidden rounded-[28px] border border-line bg-surface sm:flex-row">
              <Link href={`/events/${e.slug}`} className={cn(e.gradient, "grain flex shrink-0 flex-row items-center gap-4 p-5 text-white sm:w-36 sm:flex-col sm:justify-center sm:gap-0 sm:text-center")}>
                <span className="text-sm font-semibold text-white/80">{w.day}</span>
                <span className="font-display text-5xl font-bold leading-none">{w.date}</span>
                <span className="font-semibold">{w.month}</span>
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <span className="tag w-fit">{e.type}</span>
                <Link href={`/events/${e.slug}`} className="mt-2 font-display text-xl font-bold leading-snug tracking-tight hover:text-accent">
                  {e.title}
                </Link>
                <p className="mt-2 flex-1 text-[0.95rem] text-ink-2">{e.summary}</p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-3">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {w.time}, {e.minutes} min
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-4 w-4" /> {e.audience}
                  </span>
                </div>
                <div className="mt-4">
                  <RegisterButton slug={e.slug} past={false} compact />
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {past.length > 0 && (
        <>
          <h2 className="t-h3 mt-16">Past sessions and key takeaways</h2>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {past.map((e) => (
              <li key={e.slug}>
                <Link href={`/events/${e.slug}`} className="hover-card flex h-full flex-col rounded-[24px] border border-line bg-surface p-5">
                  <span className="text-sm text-ink-3">
                    {e.type}, {eventWhen(e.start).month} {eventWhen(e.start).year}
                  </span>
                  <span className="mt-1 font-display text-lg font-bold leading-snug">{e.title}</span>
                  <ul className="mt-3 space-y-1.5 text-sm text-ink-2">
                    {e.takeaways.slice(0, 2).map((t) => (
                      <li key={t} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
