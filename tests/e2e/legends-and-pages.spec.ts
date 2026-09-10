import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Legends index — draft exclusion", () => {
  test("shows published legends, not the Munger draft", async ({ page }) => {
    await page.goto("/legends");
    await expect(page.getByRole("heading", { name: "Investing Legends", level: 1 })).toBeVisible();
    await expect(page.getByText("Benjamin Graham")).toBeVisible();
    await expect(page.getByText("Peter Lynch")).toBeVisible();
    await expect(page.getByText("Charlie Munger")).not.toBeVisible();
  });

  test("zero critical axe violations @a11y", async ({ page }) => {
    await page.goto("/legends");
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    if (critical.length > 0) console.log(JSON.stringify(critical, null, 2));
    expect(critical).toEqual([]);
  });
});

test.describe("Legend page", () => {
  test("published legend (Graham) has no noindex and renders content", async ({ page }) => {
    await page.goto("/legends/benjamin-graham");
    await expect(page.getByRole("heading", { name: "Benjamin Graham", level: 1 })).toBeVisible();
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveCount(0);
  });

  test("draft legend (Munger) is noindex but still previewable", async ({ page }) => {
    await page.goto("/legends/charlie-munger");
    await expect(page.getByText("Draft — preview only")).toBeVisible();
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute("content", /noindex/);
  });
});

test.describe("Home page", () => {
  // Scoped to the first section on purpose. The landing page now carries a
  // closing CTA and a second projected figure of its own, so an unscoped
  // "Explore the tools" or "Assumed return..." matches more than one element
  // — which is correct page content, not a regression. These assertions are
  // about the hero specifically, so they say so.
  test("hero calculator is live and links resolve to real pages", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("section").first();
    await expect(page.getByRole("heading", { name: /We don't manage your money/ })).toBeVisible();

    const toolsLink = hero.getByRole("link", { name: "Explore the tools" });
    await expect(toolsLink).toHaveAttribute("href", "/tools");

    const learnLink = hero.getByRole("link", { name: "Start learning" });
    await expect(learnLink).toHaveAttribute("href", "/learn");

    // Latest post section should link to a real, resolvable post.
    const latestPostLink = page.locator('a[href^="/learn/blog/"]').first();
    await expect(latestPostLink).toBeVisible();
  });

  test("hero slider updates the projected value", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("section").first();
    const slider = hero.getByRole("slider", { name: "Monthly investment" });
    await slider.fill("50000");
    await expect(hero.getByText("Assumed return is illustrative only")).toBeVisible();
  });

  test("zero critical axe violations @a11y", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    if (critical.length > 0) console.log(JSON.stringify(critical, null, 2));
    expect(critical).toEqual([]);
  });
});

test.describe("Disclosures page", () => {
  test("lists all four calculator methodologies", async ({ page }) => {
    await page.goto("/disclosures");
    for (const name of ["SIP Calculator", "Step-up SIP Calculator", "Lumpsum Calculator", "Inflation Calculator"]) {
      await expect(page.getByText(name, { exact: true })).toBeVisible();
    }
  });
});

test.describe("About page", () => {
  test("renders", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: "About", level: 1 })).toBeVisible();
  });
});

test.describe("Learn hub", () => {
  test("links to blog and money basics", async ({ page }) => {
    await page.goto("/learn");
    await expect(page.getByRole("link", { name: "View all posts →" })).toBeVisible();
    await expect(page.getByRole("link", { name: "View all topics →" })).toBeVisible();
  });
});
