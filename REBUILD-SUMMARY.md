# 23percent club rebuild summary

**Date:** 19 September 2026
**Branch:** `rebuild/v3` (5 commits, not pushed; `main` untouched)
**Backup of the previous site:** `Documents/23%/v2-pre-rebuild-snapshot`

The whole site was rebuilt from scratch in five phases as a connected financial education product, not a static site. It has accounts, a dashboard, progress tracking, calculators, diagnostics, a course, a kids' section, a blog and events, all linked to each other.

## Verification

| Check | Result |
| --- | --- |
| Lint, type check, production build | Pass (all 184 pages prerendered as static HTML) |
| Unit tests | 61 pass (calculator accuracy, tax, diagnostics, content integrity) |
| Browser tests (Playwright) | 120 pass on Chrome, Firefox, Safari (Mac), iPhone and Android |
| Page sweep | 37 pages on 7 browser/device setups, down to a 360px phone: no console errors, no sideways scrolling |
| Lighthouse (throttled mobile) | Performance 79–89; accessibility, best practices and SEO 100 |

## Calculator accuracy

The calculators match Groww's own published examples to the rupee:

| Calculator | Inputs | Result |
| --- | --- | --- |
| SIP | ₹25,000/month, 12%, 10 years | ₹58,08,477 |
| PPF | ₹1.5 lakh/year, 7.1%, 15 years | ₹40,68,209 |
| SWP | ₹50,000, ₹1,000/month, 10%, 1 year | ₹42,565 |
| NPS | ₹3,000/month, 10%, 26 years | ₹44.35 lakh |
| Flat vs reducing | ₹1 lakh, 10%, 12 years | EMI ₹1,528 vs ₹1,195 |
| Gratuity | ₹30,000, 5 years | ₹86,538.46 |

Income tax uses the FY 2025-26 slabs, which Budget 2026 kept unchanged for FY 2026-27. The brokerage calculator uses the higher F&O securities transaction tax (STT) rates in force since 1 April 2026.

## What was built

### Phase 1: Foundation
- Tekhelet colour palette, with its own gradient for each tool family
- Light and dark themes
- Interactive background of financial symbols that reacts to mouse and touch
- Smooth scrolling for mouse and trackpad; native scrolling kept on phones
- Header with menus, bottom tab bar on phones, Ctrl+K site search
- Accounts (sign up, log in) and the home page with a live SIP demo

### Phase 2: Tools
- 42 calculators: 34 of Groww's 35, plus goal planner, FIRE, emergency fund, net worth, asset allocation, rebalancing, prepay-or-invest and cost of delay
- Each has charts, a year-by-year table, the formula, FAQs and a link to the matching lesson
- Save to dashboard, and share links that keep your inputs

### Phase 3: Learning
- 23 School of Finance: 13 modules, 39 lessons, interactive visuals, worked Indian examples, quizzes and printable certificates
- 23percent club Universe: interactive map of asset classes, the order money should flow in, learning paths, regulators
- Glossary of 91 terms

### Phase 4: Diagnosis and Junior
- Investor personality test: 18 questions, 5 dimensions, 6 personality types, recommended lessons
- Financial health check: 22 questions, 9 areas, score out of 100, top 3 priorities
- Tax Saving Maximizer: old vs new regime, unused deduction room, break-even point
- 23percent club Junior for kids (8–12) and teens (13–17): stories, 5 games, week-long challenges, quizzes, stars, parent guide

### Phase 5: Dashboard and the rest
- Dashboard: overview, learning progress, goals, money tracker (net worth, monthly savings, investments, habits), saved items, badges, activity, profile, settings
- Recommended next steps that connect the sections (health check, then lessons, then tools, then dashboard)
- Insights: 12 articles across 11 categories
- Events & Live: registration and calendar download for upcoming sessions, key takeaways from past ones
- Sitemap, structured data for search engines, cookie-free analytics (switched on by environment setting)

## Things to know

- **Accounts are stored on the user's device** (in the browser), not on a server, so they don't sync between devices. The code is set up so moving to a server touches one file: `src/lib/store/store.ts`.
- **Events are a sample schedule.** Replace them with real sessions and joining links in `src/content/events.ts`.
- **Groww's margin calculator is not included.** It needs live exchange data.
- **Two Groww pages are inconsistent.** The RD example (₹62,730.85) doesn't match Groww's own stated formula (₹62,646.63), so the site follows the formula. The retirement page example can't be reproduced, so a standard method is used.
- **The logo screenshot didn't come through**, so the existing heartbeat-and-plus logo is kept exactly as it was.
- **"UI-UX Pro Max" is not installed on this machine.** The frontend-design and data-visualisation skills were used instead.
- **Mobile speed is limited mainly by web fonts** loading on a slow connection.
- **An unexplained reset happened partway through.** Something reset the folder to its last commit and wiped early work. The other Claude session open on this folder says it wasn't responsible, so the cause is unknown. The lost work was redone, and every phase was committed.

## Updating content

| What | Where |
| --- | --- |
| Articles | `src/content/insights/*.mdx` |
| Events | `src/content/events.ts` |
| Lessons and quizzes | `src/content/school/` |
| Savings scheme rates (review every quarter) | `RATES` in `src/lib/calc/schemes.ts` |
| Tax slabs (review every Budget) | `src/lib/calc/tax.ts` |

Step-by-step instructions are in `CONTENT-GUIDE.md`; the full technical overview is in `README.md`.

## Commands

```bash
npm run dev        # local development
npm run verify     # lint + type check + unit tests + production build
npm run test:e2e   # browser tests on Chrome, Firefox, Safari, iPhone, Android
```
