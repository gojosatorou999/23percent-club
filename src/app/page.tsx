import Link from "next/link";
import {
  getPublishedPosts,
  getPublishedLegends,
  getMoneyBasicsTopics,
} from "@/lib/content";
import { organizationJsonLd, jsonLdScriptContent } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { BlogCard } from "@/components/cards/BlogCard";
import { HomeHero } from "@/components/home/HomeHero";
import { CompoundingSequence } from "@/components/home/CompoundingSequence";
import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";
import { Drift } from "@/components/motion/Drift";
import { TiltPanel } from "@/components/motion/TiltPanel";
import { CountOnView } from "@/components/motion/CountOnView";
import { CompoundCurve } from "@/components/visuals/CompoundCurve";

/**
 * The landing page is one continuous scroll with a deliberate rhythm:
 * deep, deep, deep — then light, muted, deep, light, deep. Alternating the
 * grounds is what stops a long page reading as one endless column, and the
 * deep bands are where the atmosphere and the arithmetic live.
 *
 * Every number on this page is derived, never asserted. The counts come
 * from the content directory at build time and the projection comes from
 * the same `calculateSip` the calculators use — README §0.1 rule 4 forbids
 * inventing financial data, and "1,200 happy investors" on a hero is
 * exactly the kind of number this site does not get to have.
 */

const PILLARS = [
  {
    href: "/tools",
    title: "Tools",
    body: "Four calculators — SIP, step-up SIP, lumpsum, inflation — that do the arithmetic on your assumptions and never recommend a fund.",
    detail: "One tested engine, 100% branch coverage, shared by all four.",
  },
  {
    href: "/learn",
    title: "Learn",
    body: "A structured blog and a Money Basics hub covering loans, credit cards, debt, taxes, and insurance. Education, never advice.",
    detail: "Every figure carries a primary source, or it doesn't get stated.",
  },
  {
    href: "/legends",
    title: "Legends",
    body: "Investing legend stories, taught like a teacher would — the sharper, less obvious version of the lesson, not the easy one.",
    detail: "The lesson people usually get wrong, not the one on the poster.",
  },
] as const;

/**
 * The principles strip. Every line is a statement about how this site is
 * built that is enforced somewhere in the repo — the compliance script, the
 * content schema, the test suite — rather than a marketing claim.
 */
const PRINCIPLES = [
  "No fund recommendations",
  "No affiliate links, ever",
  "No product names in any explainer",
  "Every figure carries a source",
  "Arithmetic you can reproduce",
  "Assumptions you control",
  "Education, not advice",
] as const;

const TOOLS = [
  {
    href: "/tools/sip-calculator",
    name: "SIP",
    why: "What your monthly discipline actually adds up to.",
  },
  {
    href: "/tools/step-up-sip-calculator",
    name: "Step-up SIP",
    why: "What a small yearly increase does to the same plan.",
  },
  {
    href: "/tools/lumpsum-calculator",
    name: "Lumpsum",
    why: "What a one-time amount could become on its own.",
  },
  {
    href: "/tools/inflation-calculator",
    name: "Inflation",
    why: "The number every other calculator has to outrun.",
  },
] as const;

export default function Home() {
  const posts = getPublishedPosts();
  const legends = getPublishedLegends();
  const topics = getMoneyBasicsTopics();
  const latestPosts = posts.slice(0, 3);

  const stats = [
    { value: TOOLS.length, label: "Calculators", sub: "on one tested engine" },
    { value: posts.length, label: "Written lessons", sub: "each one sourced" },
    { value: topics.length, label: "Money Basics topics", sub: "loans to insurance" },
    // The one that matters most, and the only one that is a zero. It stays
    // in the row precisely because it is the site's whole boundary.
    { value: 0, label: "Products recommended", sub: "by design, not omission" },
  ];

  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScriptContent(organizationJsonLd()),
        }}
      />

      {/* ── 1. Hero ──────────────────────────────────────────────────────
          Nothing animates in here; see the note in HomeHero. The band moves,
          the message is simply present. */}
      <Section
        tone="deepQuiet"
        aurora="hero"
        bleedTop
        className="flex min-h-[88svh] items-center pb-16"
      >
        <Container>
          <HomeHero />
        </Container>
      </Section>

      {/* ── 2. Principles strip ──────────────────────────────────────────
          A thin band between the hero and the sequence. No seam and no
          aurora: it is a rule, not a moment, and it exists to keep the deep
          field unbroken while the page states its boundaries. */}
      <Section tone="deepFlat" className="!py-0">
        <div className="border-y border-white/10 py-5">
          <Marquee durationSeconds={54}>
            {PRINCIPLES.map((line) => (
              <span key={line} className="flex items-center">
                <span className="whitespace-nowrap px-6 font-body text-sm font-medium text-white/70">
                  {line}
                </span>
                <span
                  aria-hidden="true"
                  className="h-1 w-1 rounded-full bg-bright-blue"
                />
              </span>
            ))}
          </Marquee>
        </div>
      </Section>

      {/* ── 3. The pinned sequence ───────────────────────────────────────
          The centrepiece. `containsSticky` is load-bearing — see Section. */}
      <Section
        tone="deepRise"
        aurora="band"
        seam="white"
        containsSticky
        className="!py-0"
      >
        <CompoundingSequence />
      </Section>

      {/* ── 4. What is actually here ─────────────────────────────────────
          Counts, not claims. Each one is read from the content directory at
          build time, so the row cannot drift from what shipped. */}
      <Section>
        <Container>
          <Reveal
            as="h2"
            variant="mask"
            className="max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-content sm:text-4xl"
          >
            What is actually here
          </Reveal>

          {/*
            A list, not a <dl>. The description-list markup this started as
            is invalid here and axe is right to flag it: a <dl> may only
            directly contain <dt>/<dd> groups, so the wrapper each stat needs
            for its reveal and its top rule has nowhere legal to live. Worse,
            <dt> must precede <dd>, and the whole point of a stat tile is the
            figure reading first. A <ul> says exactly as much about this
            content and says it correctly.
          */}
          <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal
                key={stat.label}
                as="li"
                index={i}
                count={stats.length}
                variant="soft"
                className="flex flex-col gap-1 border-t border-line pt-5"
              >
                <p className="font-display text-5xl font-semibold tracking-tight text-accent">
                  <CountOnView value={stat.value} />
                </p>
                <p className="font-display text-base font-semibold text-content">
                  {stat.label}
                </p>
                <p className="font-body text-sm text-content-2">{stat.sub}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── 4b. The curve ────────────────────────────────────────────────
          A divider that draws itself as the reader scrolls past it: the
          straight line is what you put in, the curve is what it becomes.
          No numbers, no axis, no claim — the shape is the whole argument,
          and the arithmetic behind it lives one section further down where
          the visitor supplies the assumptions. */}
      <Section className="!pt-0 !pb-10">
        <Container>
          <CompoundCurve />
        </Container>
      </Section>

      {/* ── 5. Tools ─────────────────────────────────────────────────────
          Off-white ground on purpose: white glass needs something to be
          glass against, and it disappears on a white page. */}
      <Section tone="muted">
        <Container>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <Reveal
              as="h2"
              variant="mask"
              className="max-w-xl font-display text-3xl font-semibold leading-tight tracking-tight text-content sm:text-4xl"
            >
              Four calculators, one engine
            </Reveal>
            <Reveal variant="soft" delay={120}>
              <Link
                href="/tools"
                className="font-body text-sm font-medium text-accent hover:underline"
              >
                See all tools →
              </Link>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TOOLS.map((tool, i) => (
              <Reveal
                key={tool.href}
                index={i}
                count={TOOLS.length}
                variant="scale"
                className="h-full"
              >
                <TiltPanel className="h-full">
                  <Link href={tool.href} className="group block h-full">
                    <Card
                      surface="glass"
                      lift
                      className="flex h-full flex-col gap-3 p-6"
                    >
                      <span
                        aria-hidden="true"
                        className="font-body text-xs font-medium tabular-nums text-content-2"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-xl font-semibold text-content transition-colors group-hover:text-accent">
                        {tool.name}
                      </h3>
                      <p className="font-body text-sm leading-relaxed text-content-2">
                        {tool.why}
                      </p>
                    </Card>
                  </Link>
                </TiltPanel>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 6. Three pillars ─────────────────────────────────────────────
          Back onto the deep field. The columns drift at different depths so
          the row separates as it passes rather than sliding by as one plane. */}
      <Section tone="deepQuiet" seam="white" className="pb-36">
        <Container className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <Reveal
              as="p"
              variant="soft"
              className="font-body text-xs font-medium uppercase tracking-[0.22em] text-bright-blue"
            >
              The shape of the site
            </Reveal>
            <Reveal
              as="h2"
              variant="mask"
              className="max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-white text-glow-soft sm:text-4xl"
            >
              Three pillars, one boundary
            </Reveal>
          </div>

          {/*
            The drift is on the grid, not on the cards.
            Drifting the columns independently was the first attempt and it
            is wrong: these are bordered panels on a shared baseline, so a
            30px offset between neighbours does not read as depth — it reads
            as a broken grid. Moving the whole row against the heading gives
            the same separation with nothing to misalign against.
          */}
          {/*
            An indexed list, not three cards in a row.

            Three equal cards side by side is the most recognisable layout on
            the template internet, and it flattens what is actually a ranked
            argument: Tools is where a visitor should start, Learn is what
            makes the tools mean anything, Legends is the long tail. Stacking
            them with a rule between and the index set large restores that
            order, gives the copy a full measure to breathe in, and reads the
            same on a phone as on a desktop instead of collapsing from three
            columns to one.
          */}
          <Drift depth={46}>
            <ul className="flex flex-col">
              {PILLARS.map((pillar, i) => (
                <Reveal
                  key={pillar.href}
                  as="li"
                  index={i}
                  variant="soft"
                  className="border-t border-white/15 first:border-t-0"
                >
                  <Link
                    href={pillar.href}
                    className="group flex flex-col gap-3 py-7 sm:flex-row sm:gap-10"
                  >
                    <span
                      aria-hidden="true"
                      className="font-display text-sm font-medium tabular-nums text-bright-blue sm:w-16 sm:shrink-0 sm:pt-1"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex flex-1 flex-col gap-2">
                      <span className="font-display text-2xl font-semibold text-white transition-colors group-hover:text-bright-blue sm:text-3xl">
                        {pillar.title}
                      </span>
                      <span className="max-w-2xl font-body text-base leading-relaxed text-white/85">
                        {pillar.body}
                      </span>
                      <span className="max-w-2xl font-body text-sm leading-relaxed text-white/60">
                        {pillar.detail}
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </Drift>
        </Container>
      </Section>

      {/* ── 7. Writing ───────────────────────────────────────────────────── */}
      {latestPosts.length > 0 && (
        <Section>
          <Container className="flex flex-col gap-10">
            <Reveal
              variant="soft"
              className="flex flex-wrap items-baseline justify-between gap-4"
            >
              <h2 className="font-display text-3xl font-semibold tracking-tight text-content sm:text-4xl">
                Latest from the blog
              </h2>
              <Link
                href="/learn/blog"
                className="font-body text-sm font-medium text-accent hover:underline"
              >
                View all posts →
              </Link>
            </Reveal>

            <div className="grid gap-6 lg:grid-cols-3">
              {latestPosts.map((post, i) => (
                <Reveal
                  key={post.slug}
                  index={i}
                  count={latestPosts.length}
                  className="h-full"
                >
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </div>

            {legends.length > 0 && (
              <Reveal variant="soft" className="mt-4">
                <div className="hairline" />
                <div className="mt-8 flex flex-wrap items-baseline justify-between gap-4">
                  <p className="max-w-xl font-body text-base leading-relaxed text-content-2">
                    Or read how{" "}
                    {legends.map((legend, i) => (
                      <span key={legend.slug}>
                        {i > 0 && (i === legends.length - 1 ? " and " : ", ")}
                        <Link
                          href={`/legends/${legend.slug}`}
                          className="font-medium text-accent hover:underline"
                        >
                          {legend.name}
                        </Link>
                      </span>
                    ))}{" "}
                    actually thought about risk — the sharper version of the
                    lesson, not the one on the poster.
                  </p>
                  <Link
                    href="/legends"
                    className="font-body text-sm font-medium text-accent hover:underline"
                  >
                    All legends →
                  </Link>
                </div>
              </Reveal>
            )}
          </Container>
        </Section>
      )}

      {/* ── 8. Close ─────────────────────────────────────────────────────
          The last band opens all the way to Sapphire and ends on the horizon
          hairline, so the page hands off to the footer on accent light
          rather than stopping. */}
      <Section tone="deep" horizon className="py-28 sm:py-36">
        <Container>
          <div className="flex flex-col items-start gap-6">
            <Reveal
              as="h2"
              variant="mask"
              className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white text-glow sm:text-5xl"
            >
              Start with the arithmetic. The rest follows.
            </Reveal>
            <Reveal
              as="p"
              variant="soft"
              index={1}
              className="max-w-xl font-body text-lg leading-relaxed text-white/80"
            >
              No signup, no email, no product. Move a slider and see what your
              own assumptions imply.
            </Reveal>
            <Reveal index={2} className="flex flex-wrap gap-3">
              <Link
                href="/tools/sip-calculator"
                className="glow-cta inline-flex items-center justify-center rounded-full bg-bright-blue px-6 py-3 font-body text-sm font-medium text-on-accent transition-all duration-300 hover:opacity-90"
              >
                Open the SIP Calculator
              </Link>
              <Link
                href="/learn"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 font-body text-sm font-medium text-white transition-all duration-300 hover:bg-white/20"
              >
                Browse the lessons
              </Link>
            </Reveal>
          </div>
        </Container>
      </Section>
    </div>
  );
}
