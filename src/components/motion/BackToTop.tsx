"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { scrollToTarget } from "./SmoothScroll";
import { cn } from "@/lib/cn";

const SPARKS = 12;
const R = 25;
const C = 2 * Math.PI * R;

/*
 * Back to top. A spinning aurora ring, a scroll-progress arc, orbiting
 * sparks and a glass core. Clicking it launches: the arrow rockets off,
 * a shockwave and a burst of sparks fire, then the page glides home.
 */
export function BackToTop() {
  const [show, setShow] = useState(false);
  const [launching, setLaunching] = useState(false);
  const arc = useRef<SVGCircleElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      setShow(window.scrollY > 480);
      if (arc.current) arc.current.style.strokeDashoffset = String(C * (1 - p));
      if (label.current) label.current.textContent = `${Math.round(p * 100)}%`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  const launch = () => {
    if (launching) return;
    setLaunching(true);
    window.setTimeout(() => scrollToTarget(0), 260);
    window.setTimeout(() => setLaunching(false), 1100);
  };

  return (
    <button
      type="button"
      onClick={launch}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={cn("btt", show && "btt-show", launching && "btt-launch")}
    >
      <span className="btt-aura" aria-hidden />
      <span className="btt-ring" aria-hidden />
      <span className="btt-orbit" aria-hidden>
        <i />
        <i />
        <i />
      </span>
      <svg className="btt-progress" viewBox="0 0 60 60" aria-hidden>
        <circle cx="30" cy="30" r={R} className="btt-track" />
        <circle ref={arc} cx="30" cy="30" r={R} className="btt-arc" strokeDasharray={C} strokeDashoffset={C} />
      </svg>
      <span className="btt-core" aria-hidden>
        <ArrowUp className="btt-arrow h-5 w-5" strokeWidth={2.6} />
        <ArrowUp className="btt-arrow-next h-5 w-5" strokeWidth={2.6} />
      </span>
      <span className="btt-wave" aria-hidden />
      <span className="btt-sparks" aria-hidden>
        {Array.from({ length: SPARKS }, (_, i) => (
          <i key={i} style={{ ["--a" as string]: `${(360 / SPARKS) * i}deg` }} />
        ))}
      </span>
      <span className="btt-tip" aria-hidden>
        Top · <span ref={label}>0%</span>
      </span>
    </button>
  );
}
