"use client";

import { useState, useRef } from "react";
import type { HTMLAttributes } from "react";

/**
 * A copy button for MDX code blocks.
 *
 * Wraps the <pre> element so the button can be positioned absolutely
 * inside the code block without touching the underlying <code> content.
 * Copies the text content of the block via the Clipboard API (with a
 * manual selection fallback for older browsers). Shows a checkmark for
 * 2s, then resets.
 *
 * Not imported directly by MdxComponents — the `pre` renderer creates this
 * wrapper so code blocks get the button automatically.
 */

const RESET_DELAY_MS = 2000;

export function CopyableCode({
  children,
  ...props
}: HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  async function copy() {
    if (!preRef.current) return;
    const text = preRef.current.textContent ?? "";

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for browsers without Clipboard API (rare but real on
      // some mobile WebViews).
      const range = document.createRange();
      range.selectNodeContents(preRef.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      document.execCommand("copy");
      sel?.removeAllRanges();
    }

    setCopied(true);
    setTimeout(() => setCopied(false), RESET_DELAY_MS);
  }

  return (
    <div className="relative my-6 overflow-hidden rounded border border-line bg-surface-2">
      <pre
        ref={preRef}
        className="overflow-x-auto px-5 py-4 font-mono text-sm leading-relaxed text-content"
        {...props}
      >
        {children}
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded border border-line bg-surface-3 text-content-2 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
      >
        {copied ? (
          // Checkmark
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 6.5L5.5 10L11 3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          // Copy icon
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="4"
              y="4"
              width="8"
              height="8"
              rx="1"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              d="M9 4V2.5A0.5 0.5 0 0 0 8.5 2H1.5A0.5 0.5 0 0 0 1 2.5V9.5A0.5 0.5 0 0 0 1.5 10H4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
