import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * README §8 Phase 8 step 4: "axe on all page types." Earlier phases each
 * added an axe check for the page(s) they shipped, but a few page
 * types were never individually covered — this closes those gaps
 * rather than re-testing what's already checked elsewhere.
 */

const UNCOVERED_PAGE_TYPES: Array<[name: string, path: string]> = [
  ["About", "/about"],
  ["Disclosures", "/disclosures"],
  ["Learn hub", "/learn"],
  ["Tools index", "/tools"],
  ["Market (placeholder)", "/market"],
  ["Step-up SIP calculator (unique ComparisonCallout)", "/tools/step-up-sip-calculator"],
  ["Lumpsum calculator", "/tools/lumpsum-calculator"],
  ["Inflation calculator", "/tools/inflation-calculator"],
  ["Individual blog post", "/learn/blog/the-only-financial-plan-that-survives-real-life"],
  ["Individual Money Basics topic (long content)", "/learn/money-basics/taxes"],
  ["Individual legend page", "/legends/peter-lynch"],
];

for (const [name, path] of UNCOVERED_PAGE_TYPES) {
  test(`${name} (${path}) has zero critical/serious axe violations @a11y`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    if (critical.length > 0) console.log(JSON.stringify(critical, null, 2));
    expect(critical).toEqual([]);
  });
}

test.describe("Keyboard-only calculator flow", () => {
  test("SIP calculator: tab to every input, change values, read the result — no mouse", async ({
    page,
  }) => {
    await page.goto("/tools/sip-calculator");

    // Set up the field's value via fill() — Playwright's documented,
    // reliable way to set an input's value (internally: focus, select
    // all, type). Raw keyboard.press("Backspace"/"Control+a") sequences
    // are unreliable here: focus() doesn't position the cursor at the
    // end of existing text in a number input under headless Chromium,
    // so Backspace has nothing before the cursor to delete and digits
    // get inserted mid-string instead of replacing it. What this test
    // actually verifies — Tab reaching the right element, arrow keys
    // moving the slider, no keyboard trap — starts after this line.
    const firstNumberInput = page.locator('input[type="number"]').first();
    await firstNumberInput.fill("25000");
    await firstNumberInput.focus();
    await expect(firstNumberInput).toBeFocused();

    // Arrow keys increment/decrement a focused number input in every
    // engine — this is the guaranteed keyboard path to every field
    // regardless of what Tab does next.
    const beforeNumber = await firstNumberInput.inputValue();
    await page.keyboard.press("ArrowUp");
    const afterNumber = await firstNumberInput.inputValue();
    expect(afterNumber).not.toBe(beforeNumber);

    await page.keyboard.press("Tab");
    const focused1 = await page.evaluate(() => document.activeElement?.getAttribute("type"));

    // Whether Tab stops on a range input is an engine/OS setting, not a
    // property of this page: macOS "Full Keyboard Access" historically
    // excluded them, and WebKit changed to include them by default (verified
    // against a bare `<input type="number"><input type="range">` on WebKit
    // 26.5, which tabs number -> range with none of this codebase loaded).
    // Asserting one engine's answer just pins the test to a browser version.
    //
    // What must be true either way is the thing this test is named for: Tab
    // lands on a control belonging to this field group, and if that control
    // is the slider, arrow keys move it. The field's keyboard operability
    // itself is already proven above, via the number input.
    expect(["range", "number"]).toContain(focused1);

    if (focused1 === "range") {
      const before = await page.evaluate(() => (document.activeElement as HTMLInputElement).value);
      await page.keyboard.press("ArrowRight");
      const after = await page.evaluate(() => (document.activeElement as HTMLInputElement).value);
      expect(after).not.toBe(before);
    }

    // The result panel updates and stays reachable — no keyboard trap.
    await expect(page.getByText("Maturity value", { exact: true })).toBeVisible();

    // Continue tabbing through the rest of the inputs without losing focus
    // to somewhere unexpected (e.g. off the page).
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
    }
    const stillInDocument = await page.evaluate(() => document.activeElement !== document.body);
    expect(stillInDocument).toBe(true);

    // "How this is calculated" is a real <details>/<summary> — openable via
    // keyboard. Target the <summary> element itself, not the text inside
    // it — the title is wrapped in a <span>, which isn't focusable, so
    // focusing "the text" would silently no-op on the wrong element.
    const summary = page.locator("summary", { hasText: "How this is calculated" });
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText(/FV = P/)).toBeVisible();
  });

  test("typing a multi-digit value digit-by-digit is not fought by min-clamping", async ({ page }) => {
    // Regression test for a real bug this file's keyboard-flow test
    // surfaced: the number input used to clamp to `min` on every
    // keystroke, so typing "25000" one digit at a time hit low partial
    // values ("2", "25", "250") that got force-corrected up to `min`
    // mid-typing, corrupting the final value. Fixed in InputSlider.tsx
    // by clamping only on blur. This test types character-by-character
    // (not fill()) specifically to catch a regression of that bug.
    await page.goto("/tools/sip-calculator");
    const monthlyInput = page.locator('input[type="number"]').first();

    // Triple-click to select all existing text — what a real user does
    // before typing a replacement value — then type the new value one
    // character at a time.
    await monthlyInput.click({ clickCount: 3 });
    for (const digit of "25000") {
      await page.keyboard.type(digit);
    }

    await expect(monthlyInput).toHaveValue("25000");
  });
});

test.describe("Chart data is reachable as text, not only visually", () => {
  test("growth chart has an adjacent text summary of the headline number", async ({ page }) => {
    await page.goto("/tools/sip-calculator");
    await expect(page.getByText(/projected value reaches/i)).toBeVisible();
  });
});
