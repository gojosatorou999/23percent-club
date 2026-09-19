import { LegalPage } from "@/components/ui/LegalPage";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Disclosures",
  description: "What 23percent club is and is not: educational content, not investment advice.",
  path: "/disclosures",
});

export default function DisclosuresPage() {
  return (
    <LegalPage title="Disclosures" path="/disclosures" updated="19 September 2026">
      <h2>Education, not advice</h2>
      <p>
        23percent club provides financial education. Nothing on this website, in our lessons, calculators, assessments, events or articles, is
        investment advice, research, a recommendation or an offer to buy or sell any security, fund or financial product. 23percent club is not
        registered with SEBI as an investment adviser or research analyst.
      </p>
      <p>
        Before acting on anything you learn here, consider your own circumstances and, where appropriate, consult a SEBI-registered investment
        adviser, a chartered accountant or another qualified professional.
      </p>
      <h2>Calculators and projections</h2>
      <p>
        Calculators produce illustrative projections from the assumptions you enter. They use standard formulas, which we publish under every
        result. Actual returns, interest rates, taxes and charges vary, and past performance does not guarantee future results. Government
        scheme rates (PPF, SSY, NSC, SCSS, POMIS) are revised quarterly; each calculator shows the rate it assumes and lets you change it.
      </p>
      <h2>Market risk</h2>
      <p>
        Mutual fund investments are subject to market risks. Read all scheme-related documents carefully. Investments in the securities market
        are subject to market risks; read all related documents carefully before investing.
      </p>
      <h2>Diagnostics</h2>
      <p>
        The investor personality test and financial health check are self-assessment tools for education and self-awareness. They are not a
        risk-profiling or suitability assessment as defined by SEBI regulations, and they do not recommend products.
      </p>
      <h2>Tax</h2>
      <p>
        Tax content and calculators reflect the Income-tax rules for resident individuals for FY 2025-26, which Budget 2026 left unchanged for
        FY 2026-27. Tax law changes; confirm your liability with a professional or the Income Tax Department&apos;s official utilities.
      </p>
      <h2>No conflicts</h2>
      <p>We do not earn commissions, referral fees or any payment from product manufacturers or distributors for anything mentioned on this site.</p>
    </LegalPage>
  );
}
