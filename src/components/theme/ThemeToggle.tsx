"use client";

import { useEffect, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type Theme } from "./theme-script";

/**
 * The light/dark switch in the header.
 *
 * **The DOM is the single source of truth.** `data-theme` on <html> is set
 * by the inline script before first paint, read back by CSS, and written by
 * this button. There is no React state mirroring it, which removes the
 * whole class of bug where the two disagree — and it is why the icon never
 * flips after hydration: which glyph shows is decided by a CSS rule on
 * `:root[data-theme]`, not by a state value React has to catch up to.
 *
 * `useSyncExternalStore` is here only for `aria-pressed`, which has to be a
 * real attribute React renders. It is also the right tool for the job:
 * reading a value that lives outside React on mount is a subscription, not
 * an effect that sets state.
 *
 * A visitor who has never touched this button follows their system, and
 * keeps following it — including when the OS flips to dark at sunset. Once
 * they click, the choice is theirs and the system listener stops overriding
 * it.
 */

const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Fired by this component after it writes the attribute, so the store
 * re-reads. The DOM has no change event for an attribute, and a
 * MutationObserver would be a heavier way to learn about a write this
 * component is the only source of.
 */
const THEME_EVENT = "23pc:themechange";

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    // Site data blocked — the accessor itself throws, so this has to be
    // guarded rather than null-checked.
    return null;
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  window.dispatchEvent(new Event(THEME_EVENT));
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

function getServerSnapshot(): Theme {
  // The server cannot know: the answer lives in localStorage and in a media
  // query. Light is the documented default the inline script also falls
  // back to when storage is unreadable.
  return "light";
}

export function ThemeToggle({ tone = "ink" }: { tone?: "ink" | "light" }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);

    function onSystemChange(event: MediaQueryListEvent) {
      // An explicit choice wins over the system, permanently.
      if (readStoredTheme()) return;
      applyTheme(event.matches ? "dark" : "light");
    }

    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, []);

  const isDark = theme === "dark";

  function toggle() {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // The theme still applies for this page view; it just will not
      // survive a reload. Not worth surfacing to the visitor.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      // Naming the action ("Switch to dark theme") would need the current
      // theme to be correct, and the current theme is exactly what the
      // server cannot know. The stable label names the control instead and
      // `aria-pressed` carries the state.
      aria-label="Toggle dark theme"
      aria-pressed={isDark}
      className={`relative flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300 ${
        tone === "light"
          ? "border-white/25 text-white hover:border-white/50 hover:bg-white/10"
          : "border-line text-content-2 hover:border-accent hover:text-accent"
      }`}
    >
      <ThemeIcon />
    </button>
  );
}

/**
 * Sun and moon share one box and cross-fade with a rotation, so the switch
 * reads as one object turning over rather than two icons swapping.
 *
 * Both glyphs are always in the DOM and neither is chosen in JavaScript —
 * `.theme-glyph-sun` / `.theme-glyph-moon` in globals.css key off
 * `:root[data-theme]`. That is what makes the button correct in the very
 * first painted frame, including for a dark-mode visitor on a cold load.
 */
function ThemeIcon() {
  return (
    <span aria-hidden="true" className="relative block h-[18px] w-[18px]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="theme-glyph theme-glyph-sun"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
      </svg>

      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="theme-glyph theme-glyph-moon"
      >
        <path d="M20.5 14.2A8.4 8.4 0 0 1 9.8 3.5a8.4 8.4 0 1 0 10.7 10.7Z" />
      </svg>
    </span>
  );
}
