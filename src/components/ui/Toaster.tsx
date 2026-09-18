"use client";

import { useEffect, useState } from "react";
import { Award, Check, Info } from "lucide-react";
import { cn } from "@/lib/cn";

interface T {
  id: number;
  title: string;
  body?: string;
  tone: "default" | "gold" | "pos";
}

/** Listens for `club:toast` events so any module can announce without context plumbing. */
export function Toaster() {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    let n = 0;
    const on = (e: Event) => {
      const d = (e as CustomEvent).detail as Omit<T, "id">;
      const id = ++n;
      setItems((xs) => [...xs.slice(-2), { ...d, tone: d.tone ?? "default", id }]);
      window.setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 4200);
    };
    window.addEventListener("club:toast", on);
    return () => window.removeEventListener("club:toast", on);
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 z-[90] flex flex-col items-center gap-2 px-4 bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+12px)] lg:bottom-6 lg:items-end lg:px-6"
    >
      {items.map((t) => (
        <div
          key={t.id}
          className="anim-pop pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-line bg-surface p-3.5 pr-5 lift-lg"
        >
          <span
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
              t.tone === "gold" && "bg-gold-200 text-gold-600",
              t.tone === "pos" && "bg-pos-soft text-pos",
              t.tone === "default" && "bg-accent-soft text-accent",
            )}
          >
            {t.tone === "gold" ? <Award className="h-5 w-5" /> : t.tone === "pos" ? <Check className="h-5 w-5" /> : <Info className="h-5 w-5" />}
          </span>
          <div className="min-w-0">
            <p className="text-[0.95rem] font-semibold leading-snug text-ink">{t.title}</p>
            {t.body && <p className="t-small mt-0.5 text-ink-3">{t.body}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
