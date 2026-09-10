"use client";

import { useEffect, useId, useRef, useState } from "react";
import { formatINR } from "@/lib/formatters";
import { SpringSlider } from "@/components/motion/anime/SpringSlider";

interface InputSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: "₹" | "%" | "years";
  /**
   * `onDeep` re-pitches the control for a glass panel on the deep field:
   * white type, a translucent field, and a track light enough to be seen
   * against Sapphire. The behaviour below is identical in both tones — only
   * the palette moves.
   */
  tone?: "onLight" | "onDeep";
}

/**
 * A slider and a numeric input, both editable, both driving the same
 * state value — README §5.1 shared requirement. Mobile-first: the number
 * input is the primary interaction on touch, the slider on desktop.
 */
export function InputSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "₹",
  tone = "onLight",
}: InputSliderProps) {
  const id = useId();
  const onDeep = tone === "onDeep";
  const isFocused = useRef(false);

  // Displayed text is buffered locally, separate from the committed
  // `value` prop that feeds the compute engine (src/lib/calculators.ts
  // documents that it assumes already-clamped input — it must never see
  // a value outside [min, max]). Buffering locally is what lets typing a
  // multi-digit value like 25000 pass through intermediate states ("2",
  // "25", "250"...) without those partial, out-of-domain values either
  // (a) getting force-corrected up to `min` mid-typing, which fights the
  // user, or (b) flowing live into the calculator engine, which doesn't.
  // Buffering ALSO fixes a re-sync bug the previous single-state version
  // had: with the input bound directly to the numeric `value` prop, any
  // sibling field's re-render (e.g. dragging another slider) forces this
  // field's DOM back to its last-committed number, silently undoing an
  // in-progress edit. A local, focus-guarded buffer isn't touched by
  // unrelated re-renders.
  const [rawText, setRawText] = useState(String(value));

  // Re-sync the buffer from an externally-driven value change (the range
  // slider, or a reset) — but never while the user is actively typing in
  // this field, or their in-progress edit would be overwritten.
  useEffect(() => {
    if (!isFocused.current) setRawText(String(value));
  }, [value]);

  function clamp(next: number): number {
    if (Number.isNaN(next)) return min;
    return Math.min(max, Math.max(min, next));
  }

  function handleNumberFocus() {
    isFocused.current = true;
  }

  // Only commit a keystroke to the engine once it's a real, in-domain
  // number. A partial value that happens to be out of range (typing "9"
  // toward "90" when min is 50, or "5" toward "-50" when min is -100)
  // simply doesn't update the engine yet — it isn't clamped up/down mid-
  // typing, it's just held back until it's valid or the field is blurred.
  // This is what guarantees the engine never computes on an out-of-domain
  // value while the user is still typing.
  function handleNumberChange(raw: string) {
    setRawText(raw);
    if (raw === "") return;
    const parsed = Number(raw);
    if (Number.isNaN(parsed) || parsed < min || parsed > max) return;
    onChange(parsed);
  }

  function handleNumberBlur() {
    isFocused.current = false;
    const parsed = rawText === "" ? value : Number(rawText);
    const clamped = clamp(parsed);
    setRawText(String(clamped));
    onChange(clamped);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className={`font-body text-sm font-medium ${onDeep ? "text-white" : "text-content"}`}
        >
          {label}
        </label>
        <div className="flex items-center gap-1 tabular-nums">
          {unit === "₹" && (
            <span
              className={`font-body text-sm ${onDeep ? "text-white/90" : "text-content-2"}`}
            >
              ₹
            </span>
          )}
          <input
            id={id}
            type="number"
            inputMode="decimal"
            value={rawText}
            min={min}
            max={max}
            step={step}
            onFocus={handleNumberFocus}
            onChange={(e) => handleNumberChange(e.target.value)}
            onBlur={handleNumberBlur}
            // text-base (16px), not text-sm (14px): iOS Safari auto-zooms
            // the whole page on focus of any input below a 16px font size —
            // found during the Phase 8 mobile-device pass. w-28 (up from
            // w-24) gives the larger glyphs room for an 8-digit value
            // (the lumpsum calculator's max is 10,000,000) without wrapping.
            className={`w-28 rounded-md border px-2 py-1 text-right font-body text-base focus-visible:outline-2 ${
              onDeep
                ? "border-white/25 bg-white/10 text-white focus-visible:outline-white"
                : "border-line bg-surface-3 text-content focus-visible:outline-bright-blue"
            }`}
          />
          {unit !== "₹" && (
            <span
              className={`font-body text-sm ${onDeep ? "text-white/90" : "text-content-2"}`}
            >
              {unit === "%" ? "%" : "yr"}
            </span>
          )}
        </div>
      </div>
      {/*
        The rail is a <SpringSlider>, not a bare range input: it renders a
        real range input for the keyboard and for assistive tech, and hands
        pointer input to a spring-released draggable thumb once anime.js has
        loaded. If it never loads — reduced motion, a failed chunk — the
        range input keeps pointer input and this behaves exactly as it did
        before. `clamp` is still applied on the way out because SpringSlider
        reports a stepped value and the engine's contract is a clamped one.
      */}
      <SpringSlider
        label={label}
        value={value}
        onChange={(next) => onChange(clamp(next))}
        min={min}
        max={max}
        step={step}
        tone={tone}
      />
      {unit === "₹" && (
        <p
          className={`font-body text-xs tabular-nums ${onDeep ? "text-white/90" : "text-content-2"}`}
        >
          {formatINR(value)}
        </p>
      )}
    </div>
  );
}
