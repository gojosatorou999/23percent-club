"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CommandPalette = dynamic(() => import("./CommandPalette").then((m) => m.CommandPalette), { ssr: false });

/**
 * The search palette (and Fuse.js) load only when someone first asks for
 * search, via the button, Ctrl/Cmd+K or "/", keeping them out of every
 * page's initial JavaScript.
 */
export function SearchLauncher() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    const wake = () => setReady(true);
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        wake();
      }
    };
    const onOpen = () => wake();
    window.addEventListener("keydown", onKey);
    window.addEventListener("club:search-request", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("club:search-request", onOpen);
    };
  }, [ready]);

  return ready ? <CommandPalette initialOpen /> : null;
}

/** Open search from anywhere: wakes the launcher on first use, then the palette itself. */
export function openSearch() {
  window.dispatchEvent(new Event("club:search-request"));
  window.dispatchEvent(new Event("club:search"));
}
