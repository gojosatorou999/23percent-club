"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/**
 * Reads UTM parameters from the URL on first load and writes them to
 * sessionStorage so they are available for the duration of the session.
 *
 * Plausible picks up the referrer automatically for source attribution;
 * this gives a secondary store for any client-side use (e.g., passing
 * campaign context to a contact email prefill, analytics debugging).
 *
 * Mounted in the root layout. No render output.
 */
export function UtmCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    let found = false;
    for (const key of UTM_KEYS) {
      const value = searchParams.get(key);
      if (value) {
        sessionStorage.setItem(key, value);
        found = true;
      }
    }
    // Write a timestamp so we know how fresh the attribution is.
    if (found) {
      sessionStorage.setItem("utm_captured_at", String(Date.now()));
    }
  }, [searchParams]);

  return null;
}
