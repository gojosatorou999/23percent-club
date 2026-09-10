import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms under which 23% Club provides financial education content and calculator tools.",
};

const LAST_UPDATED = "10 September 2026";

export default function TosPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        intro={`Last updated: ${LAST_UPDATED}`}
      />

      <Section>
        <Container width="prose">
          <div className="prose-body">
            <h2>What this site is</h2>
            <p>
              23% Club is a financial education website. Everything here
              — blog posts, Money Basics guides, Legends profiles, and
              calculator tools — is educational content produced for Indian
              retail investors who want to understand how money works.
            </p>
            <p>
              We are not a SEBI-registered investment adviser. Nothing on this
              site is investment advice, a recommendation to buy or sell any
              security, or a solicitation of any kind. The calculators are
              arithmetic tools that apply your own assumptions to standard
              compound-interest formulas; the outputs are illustrations, not
              projections.
            </p>

            <h2>No guarantees on calculator outputs</h2>
            <p>
              The assumed rates of return shown in the calculators are
              illustrative only. Actual returns on any investment vary and can
              be negative. Past performance is not indicative of future results.
              We do not guarantee that any calculation output is accurate,
              complete, or suitable for your personal circumstances.
            </p>

            <h2>Your responsibility</h2>
            <p>
              Investment decisions are yours alone. Please consult a SEBI-registered
              investment adviser before making any financial decision. Using
              this site does not create any advisory relationship between you
              and 23% Club.
            </p>

            <h2>Intellectual property</h2>
            <p>
              All content on this site is original and owned by 23% Club unless
              stated otherwise. You may quote short excerpts for educational
              or journalistic purposes with attribution. Reproducing entire
              articles or substantial portions without permission is not
              permitted.
            </p>

            <h2>External links</h2>
            <p>
              Where content links to external sources (SEBI circulars, RBI
              data, academic papers), those links are provided for reference.
              We do not control external sites and are not responsible for
              their content or availability.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, 23% Club is not liable
              for any loss or damage arising from your use of this site or
              reliance on its content.
            </p>

            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes will
              be subject to the exclusive jurisdiction of courts in India.
            </p>

            <h2>Changes</h2>
            <p>
              We may update these terms. Changes take effect on the date shown
              at the top of this page.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms:{" "}
              <a href="mailto:hello@23percentclub.com">
                hello@23percentclub.com
              </a>
            </p>
          </div>

          <div className="mt-12 border-t border-line pt-6">
            <Link
              href="/legal/privacy"
              className="font-body text-sm text-accent hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
