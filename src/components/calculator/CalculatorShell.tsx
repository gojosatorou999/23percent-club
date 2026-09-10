import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

/**
 * The page-level chrome for a calculator route: the deep-field header band
 * and the quiet working section the form sits in.
 *
 * Kept separate from <CalculatorBody> — and rendered by the route's own
 * server component rather than from inside the form — so none of it (the
 * band, the aurora layers, the section wrappers) is pulled into the client
 * bundle. A form is a client component, and everything a client component
 * imports becomes client code whether it is interactive or not; on the
 * calculator routes, which already ship ~250KB of charting, the shell has no
 * business being in there.
 *
 * The deep field also stops at the seam on purpose. README §3.3 makes the
 * result panel the most crafted element in the repo and everything around it
 * quiet — an atmospheric background behind a number someone is reading would
 * be exactly the wrong place to spend the effect.
 */
export function CalculatorShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <>
      <Section
        tone="deepQuiet"
        aurora="header"
        seam="offWhite"
        horizon
        bleedTop
        className="pb-16 sm:pb-20"
      >
        <Container>
          <div className="flex flex-col gap-3">
            {/*
              Held at the original heading scale, and without the glow the
              other bands get. Two reasons, and they agree: README §3.3 wants
              everything around the result panel quiet, and this <h1> is the
              LCP element on the heaviest routes on the site — it repaints when
              the display font swaps in, and a bigger, shadowed headline makes
              that repaint measurably more expensive.
            */}
            <h1 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-2xl font-body text-base leading-relaxed text-white/80 sm:text-lg">
              {description}
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container className="flex flex-col gap-12">{children}</Container>
      </Section>
    </>
  );
}
