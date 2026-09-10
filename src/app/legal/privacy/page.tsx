import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How 23% Club handles your data. Short version: we collect almost none of it.",
};

const LAST_UPDATED = "10 September 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        intro={`Last updated: ${LAST_UPDATED}`}
      />

      <Section>
        <Container width="prose">
          <div className="prose-body">
            <h2>What we collect</h2>
            <p>
              Almost nothing. This site uses{" "}
              <a
                href="https://plausible.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                Plausible Analytics
              </a>
              , an open-source, privacy-first analytics tool. Plausible does not
              use cookies, does not track individuals across sites, and does not
              collect personally identifiable information. The data it gathers
              (page views, referrers, country-level location) is aggregated and
              anonymous.
            </p>
            <p>
              You can verify this at{" "}
              <a
                href="https://plausible.io/data-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                plausible.io/data-policy
              </a>
              .
            </p>

            <h2>Cookies</h2>
            <p>
              We set one first-party item in your browser: a{" "}
              <code>theme</code> preference stored in <code>localStorage</code>{" "}
              so the light/dark toggle persists between visits. This is not a
              tracking cookie and contains no personal data. Plausible itself
              sets no cookies.
            </p>

            <h2>Calculator data</h2>
            <p>
              All calculator inputs (SIP amounts, rates, horizons) are processed
              entirely in your browser. They are never sent to our servers, never
              logged, and never stored. We have no record of any number you have
              ever typed into any of our tools.
            </p>

            <h2>Third parties</h2>
            <p>
              We do not sell, rent, or share any data with advertisers or data
              brokers. The only third-party service this site uses is Plausible
              Analytics (privacy policy above). Google Fonts is loaded from our
              own build output, not from Google&apos;s CDN, so no request is
              made to Google on page load.
            </p>

            <h2>Your rights</h2>
            <p>
              Because we collect no personal data, there is no profile to delete
              or export. If you have questions, email{" "}
              <a href="mailto:hello@23percentclub.com">
                hello@23percentclub.com
              </a>
              .
            </p>

            <h2>Changes</h2>
            <p>
              If this policy changes materially, we will update the date at the
              top of this page and note the change in our blog.
            </p>
          </div>

          <div className="mt-12 border-t border-line pt-6">
            <Link
              href="/legal/tos"
              className="font-body text-sm text-accent hover:underline"
            >
              Terms of Service
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
