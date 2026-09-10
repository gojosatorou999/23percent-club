import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "23% Club — a financial education platform built from Hyderabad. We don't manage your money. We teach you how to manage it.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About"
        width="prose"
        intro="23% Club is a financial education and behavioural-investing platform for Indian retail investors, built from Hyderabad. It teaches SIP discipline, compounding, and long-term wealth building through calculators, structured education content, and storytelling — not through managing anyone's money."
      />

      <Section>
        <Container width="prose" className="flex flex-col gap-10">
          {/*
            Each heading reveals together with the paragraph it introduces.
            Animating them separately leaves a heading sitting alone above
            empty space for a beat, which reads as a loading bug rather than
            as motion.
          */}
          <Reveal variant="soft" className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-semibold text-content">
              The founder
            </h2>
            <p className="font-body text-base leading-relaxed text-content">
              Saikumar studied at IIT Madras and went through the NISM (National
              Institute of Securities Markets) certification route into the
              markets — the formal path India has built for people who want to
              work seriously in finance. That background is the reason 23% Club
              exists as an education platform rather than an advisory or
              distribution business: the constraint was deliberate from the
              start, not a limitation the platform grew into.
            </p>
          </Reveal>

          <Reveal variant="soft" className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-semibold text-content">
              The boundary
            </h2>
            <p className="font-body text-base leading-relaxed text-content">
              23% Club doesn&apos;t manage anyone&apos;s money, and doesn&apos;t
              take a cut from any fund, broker, or insurer for pointing you
              toward them. The calculators on this site don&apos;t recommend an
              instrument — they do the arithmetic on whatever assumptions you
              enter, honestly, whether the number that comes out is encouraging
              or not. Everything published here is educational content, not
              personalised financial advice.
            </p>
          </Reveal>

          <Reveal variant="soft" className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-semibold text-content">
              The mission
            </h2>
            <p className="font-body text-base leading-relaxed text-content">
              We don&apos;t manage your money. We teach you how to manage it.
            </p>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
