# Content guide

How to publish and update content without touching page code. After any change, run `npm run verify`; the build fails loudly if content is malformed.

## Publish an article (Insights)

1. Create `src/content/insights/your-slug.mdx`. The file name must equal the `slug`.
2. Frontmatter:

```yaml
---
title: "Plain, specific title"
slug: "your-slug"
date: "2026-10-01"          # YYYY-MM-DD
category: "tax"             # see src/content/insight-categories.ts
readTime: 6
author: "23% Club Editorial"
excerpt: "One or two sentences, under 220 characters."
status: "published"          # or "draft" (page renders, not listed, noindex)
sources: ["Source name"]
---
```

3. In the body you can use `<Callout>…</Callout>`, `<CalculatorEmbed tool="sip-calculator" />` (any tool slug) and `<SourceCitation label="…" />`.

## Add or change an event

Edit `src/content/events.ts`. Times use IST with the offset, e.g. `2026-11-08T11:00:00+05:30`. Events move from Upcoming to Past automatically. Set `joinUrl` before the session and `recordingUrl` afterwards.

## Update rates

- Small savings rates change quarterly: `RATES` in `src/lib/calc/schemes.ts` (they are defaults users can override).
- EPF rate: same object.
- Income-tax slabs, rebate and standard deduction: `src/lib/calc/tax.ts`. Update the tests in `tests/calc.test.ts` alongside.
- Brokerage and STT: `src/lib/calc/brokerage.ts`.

## Edit a lesson or quiz

Each module lives in `src/content/school/mNN-*.ts`: an intro, three sections (paragraphs support `**bold**`), one visual (`visual.kind` from `types.ts`), a worked example, takeaways, an optional linked tool, and a five-question quiz (`answer` is the zero-based index of the correct option). Lesson titles and order live in `src/content/school-outline.ts`. Tests check that every outlined lesson has content and every quiz answer exists.

## Add a calculator

1. Metadata in `src/content/tools-meta.ts` (name, category, gradient, glyph, related module).
2. Explainer, formula and FAQs in `src/content/tool-docs.ts`.
3. Maths in `src/lib/calc/` with a test.
4. Inputs and outputs in `src/lib/tools/configs.tsx` (or a custom component registered in `src/components/tools/custom/index.tsx`).

The page, sitemap entry, search entry and structured data are generated automatically.

## Voice

Plain English, sentence case, active voice. Explain, don't sell. No buy/sell calls, no return promises, no named stock recommendations. Indian examples and rupee figures, checked by calculation.
