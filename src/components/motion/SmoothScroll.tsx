"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/*
 * Inertial scrolling for mouse wheels and trackpads (Windows, macOS, Linux).
 * Touch devices keep the platform's own native momentum — on iOS and Android
 * that is already the smoothest scroll available, and replacing it only adds
 * latency. Reduced-motion users get plain native scrolling everywhere.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    if (reduce.matches || (coarse.matches && !window.matchMedia("(any-pointer: fine)").matches)) return;

    const lenis = new Lenis({
      lerp: 0.095,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      autoRaf: true,
      anchors: { offset: -88 },
      allowNestedScroll: true,
      prevent: (node: HTMLElement) => !!node.closest?.("[data-lenis-prevent]"),
    });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  // A route change lands at the top instantly — never an animated glide
  // from wherever the previous page was.
  useEffect(() => {
    const lenis = window.__lenis;
    if (!lenis) return;
    if (window.location.hash) return;
    lenis.scrollTo(0, { immediate: true, force: true });
    const id = window.setTimeout(() => lenis.resize(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}

/** Scroll to an element or the top, through Lenis when it is running. */
export function scrollToTarget(target: number | HTMLElement = 0) {
  if (window.__lenis) window.__lenis.scrollTo(target, { offset: typeof target === "number" ? 0 : -96 });
  else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else target.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Lock page scroll while a dialog or sheet is open (Lenis + native, iOS-safe). */
export function lockScroll(locked: boolean) {
  const root = document.documentElement;
  if (locked) {
    window.__lenis?.stop();
    const sw = window.innerWidth - root.clientWidth;
    root.style.setProperty("--sbw", `${sw}px`);
    root.style.overflow = "hidden";
    document.body.style.paddingRight = sw ? `${sw}px` : "";
  } else {
    window.__lenis?.start();
    root.style.overflow = "";
    document.body.style.paddingRight = "";
  }
}
