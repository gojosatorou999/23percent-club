"use client";

import { useEffect, useState } from "react";

const DISMISSED_KEY = "cookie-notice-dismissed";

/**
 * A single-line cookie notice, session-dismissed.
 *
 * ## Why this is not a consent banner
 *
 * This site uses Plausible Analytics, which is cookieless and collects no
 * personal data. There is nothing to consent to under GDPR or the Indian
 * Digital Personal Data Protection Act — the notice is transparency, not a
 * gate. Treating it as one (with "Accept / Reject" buttons, dark patterns,
 * and cookie walls) would be misleading. A factual one-liner that can be
 * dismissed is the honest version.
 *
 * Dismissed state lives in sessionStorage (not localStorage) so it resets
 * per session rather than permanently — a returning visitor from a new tab
 * gets a gentle reminder, not a permanently hidden notice.
 *
 * ## Why it is at the bottom, not the top
 *
 * A banner that covers the first screen on arrival is the pattern that made
 * cookie banners infamous. The notice appears after 1.5s — enough time for
 * the visitor to see the page, not a surprise on arrival — and sits at the
 * bottom where it can't obscure content.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session.
    if (sessionStorage.getItem(DISMISSED_KEY)) return;

    // Delay the appearance so it doesn't fight with the page load.
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      data-cookie-banner
      role="region"
      aria-label="Cookie notice"
      className="fixed bottom-20 left-4 right-4 z-40 sm:bottom-6 sm:left-auto sm:right-24 sm:max-w-sm"
    >
      <div className="flex items-center gap-3 rounded border border-line bg-surface-3 px-4 py-3 shadow-sm">
        <p className="flex-1 font-body text-xs leading-snug text-content-2">
          This site uses{" "}
          <a
            href="https://plausible.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline"
          >
            Plausible Analytics
          </a>
          {" "}— no cookies, no personal data.
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss cookie notice"
          className="shrink-0 rounded px-2.5 py-1.5 font-body text-xs font-medium text-content-2 transition-colors hover:bg-surface-2 hover:text-content focus-visible:outline-2 focus-visible:outline-accent"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
