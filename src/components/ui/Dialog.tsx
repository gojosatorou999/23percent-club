"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { lockScroll } from "@/components/motion/SmoothScroll";
import { cn } from "@/lib/cn";

/**
 * One dialog for the whole site: a bottom sheet on phones, a centred panel
 * from `sm` up. Locks page scroll (Lenis and native), traps Tab, closes on
 * Escape and on backdrop click, and returns focus to whatever opened it.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  size = "md",
  hideTitle = false,
  position = "center",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  hideTitle?: boolean;
  position?: "center" | "top";
}) {
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    lockScroll(true);
    const t = window.setTimeout(() => {
      const el = panel.current?.querySelector<HTMLElement>("[data-autofocus]") ?? panel.current;
      el?.focus();
    }, 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeRef.current();
      }
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])',
        );
        if (!f.length) return;
        const first = f[0]!;
        const last = f[f.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
      opener?.focus?.();
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[80]" role="presentation">
      <div className="anim-fade absolute inset-0 bg-tk-950/55 backdrop-blur-[3px]" onClick={onClose} aria-hidden />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex justify-center sm:p-6",
          position === "top" ? "items-end sm:items-start sm:pt-[12vh]" : "items-end sm:items-center",
        )}
      >
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          data-lenis-prevent
          className={cn(
            "dlg-panel pointer-events-auto relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[28px] border border-line bg-surface shadow-2xl outline-none sm:rounded-[28px]",
            size === "sm" && "sm:max-w-md",
            size === "md" && "sm:max-w-xl",
            size === "lg" && "sm:max-w-3xl",
          )}
          style={{ background: "var(--surface)" }}
        >
          <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-line-strong sm:hidden" aria-hidden />
          <div className={cn("flex items-center justify-between gap-4 px-5 pt-3 sm:px-6 sm:pt-5", hideTitle && "sr-only")}>
            <h2 id={titleId} className="t-h3">
              {title}
            </h2>
            <button type="button" onClick={onClose} className="btn btn-quiet btn-icon -mr-2" aria-label="Close">
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <div className="overflow-y-auto overscroll-contain px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-6">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
