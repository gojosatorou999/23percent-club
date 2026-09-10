import type { Metadata } from "next";
import { getPublishedLegends } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { LegendCard } from "@/components/cards/LegendCard";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Investing Legends",
  description:
    "Legend stories, taught like a teacher would — the sharper, less obvious version of the lesson everyone already repeats.",
};

export default function LegendsIndexPage() {
  const legends = getPublishedLegends();

  return (
    <>
      <PageHero
        title="Investing Legends"
        intro="Legend stories, taught like a teacher would — the sharper, less obvious version of the lesson everyone already repeats, and how it actually applies to an Indian retail investor today."
        seam="offWhite"
      />

      <Section tone="muted">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {legends.map((legend, i) => (
              <Reveal
                key={legend.slug}
                index={i}
                count={legends.length}
                className="h-full"
              >
                <LegendCard legend={legend} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
