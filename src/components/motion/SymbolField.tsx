"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/*
 * The symbol field — rupee signs, percentages, sigmas and growth arrows
 * drifting in three depth layers. A pointer (or finger) pulls a thin
 * tekhelet thread to every symbol near it and nudges them aside; a click
 * or tap sends out a ripple. Scrolling parallaxes the layers.
 *
 * Performance rules it keeps on every device:
 *  - glyphs are pre-rendered once into sprites, so a frame is only drawImage
 *  - device pixel ratio is capped at 2, particle count scales with area
 *  - the loop sleeps when the tab is hidden or the canvas is off-screen
 *  - reduced-motion users get one still frame, no loop
 */

const GLYPHS = ["₹", "%", "+", "Σ", "∞", "↗", "Δ", "×", "23", "≈", "π", "÷", "◎", "▲", "₹", "%"];

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ox: number;
  oy: number;
  g: number;
  z: number; // depth 0.35..1
  rot: number;
  vr: number;
  heat: number;
}

type Mode = "ambient" | "vivid";

export function SymbolField({ mode = "ambient", className, fixed = false }: { mode?: Mode; className?: string; fixed?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const vivid = mode === "vivid";
    let W = 0;
    let H = 0;
    let particles: P[] = [];
    let sprites: HTMLCanvasElement[] = [];
    let ink = "47 67 199";
    const pointer = { x: -9999, y: -9999, active: false };
    const ripples: { x: number; y: number; r: number; life: number }[] = [];
    let raf = 0;
    let visible = true;
    let running = false;
    let lastScroll = window.scrollY;
    let scrollVel = 0;

    const readInk = () => {
      const host = canvas.parentElement ?? document.documentElement;
      ink = getComputedStyle(host).getPropertyValue("--field-ink").trim() || ink;
    };

    const buildSprites = () => {
      const family = getComputedStyle(document.documentElement).getPropertyValue("--font-bricolage").trim() || "system-ui";
      sprites = GLYPHS.map((g) => {
        const size = 64;
        const c = document.createElement("canvas");
        c.width = c.height = size * 2;
        const x = c.getContext("2d")!;
        x.fillStyle = `rgb(${ink})`;
        x.textAlign = "center";
        x.textBaseline = "middle";
        x.font = `600 ${g.length > 1 ? 50 : 64}px ${family}, system-ui, sans-serif`;
        x.fillText(g, size, size + 4);
        return c;
      });
    };

    const count = () => {
      const area = W * H;
      const base = vivid ? area / 15000 : area / 26000;
      const cores = navigator.hardwareConcurrency || 4;
      const cap = cores <= 4 ? 44 : 78;
      return Math.round(Math.min(cap, Math.max(vivid ? 26 : 18, base)));
    };

    const seed = () => {
      const n = count();
      particles = Array.from({ length: n }, () => {
        const z = 0.35 + Math.random() * 0.65;
        const x = Math.random() * W;
        const y = Math.random() * H;
        return {
          x,
          y,
          ox: x,
          oy: y,
          vx: (Math.random() - 0.5) * 0.18 * z,
          vy: (Math.random() - 0.5) * 0.18 * z - 0.05 * z,
          g: Math.floor(Math.random() * GLYPHS.length),
          z,
          rot: (Math.random() - 0.5) * 0.5,
          vr: (Math.random() - 0.5) * 0.002,
          heat: 0,
        };
      });
    };

    const resize = (force = false) => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.round(rect.width);
      // On phones the URL bar changes the height constantly; only a width
      // change (rotation, window resize) re-seeds the field.
      const h = fixed ? Math.max(rect.height, window.innerHeight) : Math.round(rect.height);
      if (!force && w === W && Math.abs(h - H) < 140) return;
      const widthChanged = w !== W;
      W = w;
      H = h;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (widthChanged || force || particles.length === 0) seed();
    };

    const R = vivid ? 170 : 130;

    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      const sy = window.scrollY;
      scrollVel = scrollVel * 0.85 + (sy - lastScroll) * 0.15;
      lastScroll = sy;
      const baseAlpha = vivid ? 0.5 : 0.13;

      // ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]!;
        rp.r += 9;
        rp.life -= 0.022;
        if (rp.life <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgb(${ink} / ${rp.life * (vivid ? 0.35 : 0.18)})`;
        ctx.lineWidth = 1.25;
        ctx.stroke();
      }

      ctx.lineWidth = 1;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy - scrollVel * 0.02 * p.z * (fixed ? 1 : 0);
        p.rot += p.vr;

        // Pointer: push aside and heat up.
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (pointer.active && d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / R) * 0.9 * p.z;
          p.x += (dx / d) * f;
          p.y += (dy / d) * f;
          p.heat = Math.min(1, p.heat + 0.08);
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgb(${ink} / ${(1 - d / R) * (vivid ? 0.45 : 0.22)})`;
          ctx.stroke();
        } else {
          p.heat *= 0.96;
        }

        for (const rp of ripples) {
          const rx = p.x - rp.x;
          const ry = p.y - rp.y;
          const rd = Math.sqrt(rx * rx + ry * ry) || 1;
          if (Math.abs(rd - rp.r) < 30) {
            p.x += (rx / rd) * 2.2 * rp.life;
            p.y += (ry / rd) * 2.2 * rp.life;
            p.heat = Math.min(1, p.heat + 0.15);
          }
        }

        // wrap
        const m = 40;
        if (p.x < -m) p.x = W + m;
        else if (p.x > W + m) p.x = -m;
        if (p.y < -m) p.y = H + m;
        else if (p.y > H + m) p.y = -m;

        const size = (vivid ? 16 : 13) + p.z * (vivid ? 22 : 16);
        const a = Math.min(1, baseAlpha * (0.35 + p.z * 0.65) + p.heat * (vivid ? 0.45 : 0.3));
        const s = sprites[p.g];
        if (!s) continue;
        ctx.globalAlpha = a;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.drawImage(s, -size / 2, -size / 2, size, size);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      frame();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduce || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const toLocal = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const onMove = (e: PointerEvent) => {
      const p = toLocal(e.clientX, e.clientY);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.active = p.x >= -20 && p.y >= -20 && p.x <= W + 20 && p.y <= H + 20;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onDown = (e: PointerEvent) => {
      const p = toLocal(e.clientX, e.clientY);
      if (p.x < 0 || p.y < 0 || p.x > W || p.y > H) return;
      ripples.push({ x: p.x, y: p.y, r: 4, life: 1 });
      if (ripples.length > 4) ripples.shift();
      if (e.pointerType !== "mouse") {
        pointer.x = p.x;
        pointer.y = p.y;
        pointer.active = true;
        window.setTimeout(() => (pointer.active = false), 700);
      }
    };
    const onVis = () => (document.hidden ? stop() : start());

    readInk();
    buildSprites();
    resize(true);
    frame();
    document.fonts?.ready.then(() => {
      buildSprites();
      if (reduce) frame();
    });

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) frame();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const mo = new MutationObserver(() => {
      readInk();
      buildSprites();
      if (reduce) frame();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [mode, fixed]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none",
        fixed ? "fixed inset-x-0 top-0 -z-10 h-[100lvh] w-full" : "absolute inset-0 h-full w-full",
        className,
      )}
    />
  );
}
