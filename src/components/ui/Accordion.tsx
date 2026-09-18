"use client";

import { useId, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export function AccordionItem({ q, children, defaultOpen = false }: { q: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-line">
      <h3 className="m-0 font-sans text-base font-normal tracking-normal">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-6 py-5 text-left text-[1.05rem] font-semibold leading-snug text-ink"
        >
          {q}
          <span
            className={cn(
              "grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line transition-transform duration-300",
              open && "rotate-45 border-accent bg-accent text-on-accent",
            )}
            aria-hidden
          >
            <Plus className="h-4 w-4" />
          </span>
        </button>
      </h3>
      <div
        id={id}
        role="region"
        className="grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="pb-6 pr-10 text-ink-2 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="border-t border-line">
      {items.map((it, i) => (
        <AccordionItem key={it.q} q={it.q} defaultOpen={i === 0}>
          {it.a}
        </AccordionItem>
      ))}
    </div>
  );
}
