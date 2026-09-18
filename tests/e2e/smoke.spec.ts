import { expect, test } from "@playwright/test";

const ROUTES = [
  "/",
  "/learn",
  "/learn/money-foundations/what-money-is-for",
  "/learn/money-foundations/quiz",
  "/tools",
  "/tools/sip-calculator",
  "/tools/income-tax-calculator",
  "/tools/xirr-calculator",
  "/know-yourself/personality",
  "/know-yourself/health",
  "/tax",
  "/universe",
  "/universe/glossary",
  "/junior",
  "/junior/play/scam-spotter",
  "/insights",
  "/events",
  "/dashboard",
  "/dashboard/tracker",
  "/signup",
];

for (const route of ROUTES) {
  test(`${route} renders without errors or horizontal scroll`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto(route, { waitUntil: "networkidle" });
    await expect(page.locator("h1").first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test("SIP calculator matches Groww's default result", async ({ page }) => {
  await page.goto("/tools/sip-calculator");
  await expect(page.getByText("₹58,08,477").first()).toBeVisible();
});

test("SIP inputs survive a reload through the URL", async ({ page }) => {
  await page.goto("/tools/sip-calculator?amount=10000&rate=12&years=20");
  await expect(page.getByText("₹99,91,479").first()).toBeVisible();
});

test("search finds a calculator", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Search" }).first().click();
  const box = page.getByRole("dialog").getByRole("textbox", { name: "Search" });
  await expect(box).toBeVisible();
  await box.fill("step up");
  await expect(page.getByRole("option").filter({ hasText: "Step-up SIP calculator" }).first()).toBeVisible();
});

test("sign up, complete a lesson and see it on the dashboard", async ({ page }) => {
  await page.goto("/signup");
  await page.getByLabel("Your name").fill("Test Learner");
  await page.getByLabel("Email").fill(`t${Date.now()}@example.com`);
  await page.getByLabel("Password", { exact: true }).fill("password123");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL("**/dashboard");
  await page.goto("/learn/money-foundations/what-money-is-for");
  // Reaching the end of a lesson marks it complete automatically.
  await page.locator("#lesson-end").scrollIntoViewIfNeeded();
  await expect(page.getByText("Lesson complete", { exact: true }).first()).toBeVisible();
  await page.goto("/dashboard");
  await expect(page.getByText("1/39 lessons")).toBeVisible();
});
