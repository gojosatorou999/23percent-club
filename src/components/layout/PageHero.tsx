import type { ReactNode } from "react";
import { Container } from "./Container";
import { Section } from "./Section";

/**
 * The shared opening band for every interior page.
 *
 * One shape, used everywhere: a deep-field header the page's existing <h1>
 * and standfirst move into, bleeding up behind the fixed nav so the page
 * starts in the atmosphere rather than at a white margin. It is the thing
 * that makes twelve separately-built routes feel like one site — and it is
 * purely a container. Not a word of page copy changes to use it.
 *
 * Kept deliberately short (`py` well under the hero's) so it introduces the
 * page instead of competing with it; on calculator routes the result panel
 * is still the most crafted element on screen, per README §3.3.
 *
 * Nothing in the band animates in. This is the first thing on the page, so
 * a scroll reveal here only delays the page's own headline — reveals are
 * reserved for content below the fold.
 */
export function PageHero({
  title,
  intro,
  eyebrow,
  children,
  seam = "white",
  width = "default",
}: {
  title: string;
  intro?: ReactNode;
  eyebrow?: string;
  /** Anything that belongs under the standfirst — actions, filters, meta. */
  children?: ReactNode;
  /** Ground colour of the section that follows, for the fade-out seam. */
  seam?: "white" | "offWhite";
  /** `prose` narrows the header to the long-form reading measure. */
  width?: "default" | "prose";
}) {
  return (
    <Section
      tone="deepQuiet"
      aurora="header"
      seam={seam}
      horizon
      bleedTop
      className="pb-20 sm:pb-24"
    >
      <Container width={width}>
        <div className="flex flex-col gap-4">
          {eyebrow && (
            <p className="font-body text-xs font-medium uppercase tracking-[0.2em] text-bright-blue">
              {eyebrow}
            </p>
          )}

          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white text-glow-soft sm:text-5xl">
            {title}
          </h1>

          {intro && (
            <p className="max-w-2xl font-body text-base leading-relaxed text-white/80 sm:text-lg">
              {intro}
            </p>
          )}

          {children && <div className="mt-2">{children}</div>}
        </div>
      </Container>
    </Section>
  );
}
