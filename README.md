# 23% Club

**Learn • Invest • Grow • Compound.** A financial education platform for India: *we don't manage your money, we teach you how to manage it.*

The previous build contract (v2, Sapphire design) lives in git history and in `../v2-pre-rebuild-snapshot/`.

## What's in the product

| Area | Route | What it does |
| --- | --- | --- |
| Home | `/` | Live SIP demo in the hero, problem → solution story, the seven-step journey, feature showcases |
| 23 School of Finance | `/learn` | 13 modules, 39 lessons, interactive visuals, worked examples, 5-question quizzes, printable certificates |
| Tools | `/tools` | 42 calculators: every Groww calculator (formulas verified against Groww's own examples) plus goal planner, FIRE, emergency fund, net worth, allocation, rebalancing, prepay-or-invest, cost of delay |
| Know yourself | `/know-yourself` | Investor personality (18 questions, 5 dimensions, 6 archetypes) and financial health check (22 questions, 9 areas) |
| Tax saving maximizer | `/tax` | Old vs new regime (FY 2025-26 / 2026-27), deduction headroom, break-even point |
| Universe | `/universe` | Interactive map of asset classes, money-flow order, learning paths, regulators, 90-term glossary |
| Junior | `/junior` | Kids (8–12) and teens (13–17): stories, 5 games, challenges, quizzes, stars; parent guide |
| Insights | `/insights` | MDX articles across 11 categories |
| Events | `/events` | Upcoming sessions with one-tap registration and `.ics` export; past sessions with takeaways |
| Dashboard | `/dashboard` | Overview, learning, goals, money tracker (net worth, monthly savings, investments, habits), saved items, badges, activity, profile, settings |

Everything connects: a health check ranks weak areas → recommends lessons and tools → progress, badges and certificates land in the dashboard → the dashboard suggests the next step (`src/lib/recommend.ts`).

## Stack

Next.js 16 (App Router, fully static), React 19, TypeScript, Tailwind CSS 4, Lenis (inertial wheel scrolling; native momentum on touch), Fuse.js (search, lazy-loaded), next-mdx-remote (Insights), Zod, Vitest, Playwright. Fonts: Bricolage Grotesque (display) and Geist (text), self-hosted by `next/font`.

## Accounts and data

Accounts, progress and trackers are stored in the browser (`localStorage`, key `23club:v1`) through one store: `src/lib/store/store.ts`. Guest activity moves into an account on sign-up. Users can export or delete everything from **Dashboard → Settings**.

To move to a server later (Supabase, Firebase, your own API), replace `read`/`persist` and the account functions in `store.ts`; every screen talks only to that module.

## Design system

`src/app/globals.css` holds the Tekhelet palette (`tk-50…950`, Murex violet, Tide, Gold for achievements), semantic light/dark tokens, the type scale, and one named gradient per tool family (`g-tekhelet`, `g-murex`, `g-tide`, …). Chart colours were validated for colour-blind separation in both themes. The interactive background is `src/components/motion/SymbolField.tsx`.

## Editing content

| Content | File |
| --- | --- |
| Lessons and quizzes | `src/content/school/m01…m13-*.ts` (structure in `src/content/school-outline.ts`) |
| Calculator list / explainers | `src/content/tools-meta.ts`, `src/content/tool-docs.ts` |
| Calculator maths | `src/lib/calc/*.ts` (tested in `tests/calc.test.ts`) |
| Scheme rates (PPF, SSY, NSC, SCSS, POMIS, EPF) | `RATES` in `src/lib/calc/schemes.ts` — review every quarter |
| Tax slabs | `src/lib/calc/tax.ts` — review every Budget |
| Articles | `src/content/insights/*.mdx` (frontmatter validated at build) |
| Events | `src/content/events.ts` (add `joinUrl` / `recordingUrl` when available) |
| Glossary, Universe, Junior, FAQ | `src/content/*.ts` |

See `CONTENT-GUIDE.md` for step-by-step instructions.

## Commands

```bash
npm run dev          # local development
npm run verify       # lint + typecheck + unit tests + production build
npm run test         # unit tests: Groww parity, tax, diagnostics, content integrity
npm run test:e2e     # Playwright: Chrome, Firefox, Safari, iPhone, Android
npm run lighthouse   # Lighthouse CI budgets
```

## Environment

Copy `.env.example`. `NEXT_PUBLIC_SITE_URL` is used for canonical URLs, the sitemap and structured data. Plausible analytics (cookie-free) are enabled only when `NEXT_PUBLIC_ANALYTICS_ENABLED=true`.

## Compliance

All content is education, not investment advice; 23% Club is not a SEBI-registered adviser. Diagnostics are self-assessments, not SEBI risk profiles. Every calculator shows its formula. See `/disclosures`.
