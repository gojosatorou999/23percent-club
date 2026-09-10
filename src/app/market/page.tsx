import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Market",
  description: "Live market data — coming soon.",
  robots: { index: false, follow: true },
};

/**
 * Placeholder only — not the Phase 2 deliverable. README §5.6 specifies
 * carrying over the existing TradingView embeds from the legacy static
 * site "as-is, re-skinned in the new nav shell." That legacy site
 * doesn't exist in this repo (Phase 2 is blocked — see BUILD-STATE.md).
 *
 * This page exists only so the sitewide Navbar's "Market" link (part of
 * the fixed IA — README §4.1 — not something to remove over a temporary
 * content gap) doesn't 404, per the Phase 8 "zero broken links" gate.
 * Replace this file with the real ported market.html content once the
 * legacy assets are available; don't fabricate market data or widgets
 * in the meantime.
 */
export default function MarketPage() {
  return (
    <>
      <PageHero
        title="Market"
        width="prose"
        intro="Live market data is coming to this page. We're not publishing anything here until it's the real, working integration — not a placeholder chart or invented numbers."
      />

      <Section>
        <Container width="prose">
          <Reveal
            as="p"
            variant="soft"
            className="font-body text-sm text-content-2"
          >
            In the meantime, the{" "}
            <Link
              href="/tools"
              className="text-accent underline decoration-border hover:decoration-accent"
            >
              calculators
            </Link>{" "}
            and the{" "}
            <Link
              href="/learn/blog"
              className="text-accent underline decoration-border hover:decoration-accent"
            >
              blog
            </Link>{" "}
            are live.
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
