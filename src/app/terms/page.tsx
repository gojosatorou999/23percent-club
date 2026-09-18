import { LegalPage } from "@/components/ui/LegalPage";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Terms of use",
  description: "The terms for using 23% Club's lessons, tools and features.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" path="/terms" updated="19 September 2026">
      <h2>Using 23% Club</h2>
      <p>23% Club offers educational content and tools free of charge. By using the site you agree to use it for personal, lawful, non-commercial learning.</p>
      <h2>No advice</h2>
      <p>
        All content is general education. It does not take your personal circumstances into account and is not investment, tax or legal
        advice. See our <a href="/disclosures">disclosures</a>.
      </p>
      <h2>Accuracy</h2>
      <p>We work hard to keep lessons, rates and formulas correct and current, but we cannot guarantee that every figure is error-free or up to date. Verify important numbers before acting on them.</p>
      <h2>Your account</h2>
      <p>Accounts are stored on your device. You are responsible for keeping access to that device secure. We cannot recover an account or data that has been cleared from your browser.</p>
      <h2>Content</h2>
      <p>Lessons, articles, illustrations and the 23% Club name and logo belong to 23% Club. You may share links and short quotations with attribution.</p>
      <h2>Liability</h2>
      <p>To the extent permitted by law, 23% Club is not liable for any loss arising from decisions made using the site&apos;s content or tools.</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India.</p>
    </LegalPage>
  );
}
