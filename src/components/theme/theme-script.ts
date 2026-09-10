/**
 * The theme resolution rules, in one place, shared by the inline <head>
 * script and the toggle so the two can never disagree about what "dark"
 * means or where it is stored.
 */
export const THEME_STORAGE_KEY = "23pc-theme";

export type Theme = "light" | "dark";

/**
 * Runs synchronously in <head>, before the browser paints anything.
 *
 * This has to be a string of source rather than an imported function: it is
 * injected with dangerouslySetInnerHTML so it executes during HTML parsing,
 * which is the only point early enough to matter. A React component — even
 * one that runs on hydration — is thousands of milliseconds too late, and
 * the visitor watches a white page flash before it turns dark. That flash
 * is the single defect a dark mode is judged on, so this is deliberately
 * the first thing in the document.
 *
 * Wrapped in try/catch because `localStorage` does not merely return null
 * when a browser is set to block site data — the accessor itself throws.
 * An exception here would abort the script and take the `.js` flag with it,
 * which would disable every scroll reveal on the site. Failing to light
 * mode is a fine outcome; failing to a page with no animations is not.
 */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`.trim();
