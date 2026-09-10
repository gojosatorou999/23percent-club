import type { Metadata } from "next";
import { SEBI_DISCLAIMER } from "@/lib/compliance";
import { METHODOLOGY } from "@/lib/methodology";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Expandable } from "@/components/ui/Expandable";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Disclosures",
  description:
    "The SEBI disclaimer, every calculator's methodology, and this site's data sources — in one place.",
};

const METHODOLOGY_ORDER = [
  "sip",
  "step-up-sip",
  "lumpsum",
  "inflation",
] as const;

export default function DisclosuresPage() {
  return (
    <>
      <PageHero title="Disclosures" width="prose" />

      <Section>
        <Container width="prose" className="flex flex-col gap-10">
          <Reveal
            variant="soft"
            className="rounded border border-alert-amber/30 bg-alert-amber/10 px-5 py-4"
          >
            <p className="font-body text-sm leading-relaxed text-amber-text">
              {SEBI_DISCLAIMER}
            </p>
          </Reveal>

          <div className="flex flex-col gap-4">
            {/* Heading and standfirst reveal as one block — a heading that
                arrives a beat ahead of its own intro reads as a bug. */}
            <Reveal variant="soft" className="flex flex-col gap-3">
              <h2 className="font-display text-xl font-semibold text-content">
                Calculator methodology
              </h2>
              <p className="font-body text-sm text-content-2">
                Every formula below is the exact same one used on the
                corresponding calculator page — this is the single source both
                read from, so they can never state it differently.
              </p>
            </Reveal>
            <div className="flex flex-col gap-3">
              {METHODOLOGY_ORDER.map((slug, i) => {
                const m = METHODOLOGY[slug];
                return (
                  <Reveal key={slug} index={i}>
                    <Expandable title={m.name}>
                      <code className="mb-3 block rounded-md bg-surface-3 px-3 py-2 font-mono text-xs text-accent">
                        {m.formula}
                      </code>
                      <p className="mb-3">{m.explanation}</p>
                      <p className="text-amber-text">
                        {m.assumptionCaveat}
                      </p>
                    </Expandable>
                  </Reveal>
                );
              })}
            </div>
          </div>

          <Reveal variant="soft" className="flex flex-col gap-3">
            <h2 className="font-display text-xl font-semibold text-content">
              Data sources
            </h2>
            <p className="font-body text-sm leading-relaxed text-content-2">
              Calculator output is pure arithmetic on the numbers you enter — it
              doesn&apos;t depend on any external data source. Education content
              (blog posts, Money Basics, Investing Legends) cites its sources
              inline and in a &quot;Sources&quot; list at the end of each page;
              nothing on this site states a specific figure, rate, or quote
              without one.
            </p>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
