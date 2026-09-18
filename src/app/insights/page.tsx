import { PageHero } from "@/components/ui/PageHero";
import { InsightsList } from "@/components/insights/InsightsList";
import { getInsights } from "@/lib/insights";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Insights: personal finance articles and case studies",
  description: "Plain-language articles on personal finance, investing, mutual funds, tax, money psychology, market education and the mistakes that cost Indian investors most.",
  path: "/insights",
});

export default function InsightsPage() {
  const posts = getInsights().map(({ slug, title, excerpt, category, date, readTime, author }) => ({ slug, title, excerpt, category, date, readTime, author }));
  return (
    <>
      <PageHero
        crumbs={[{ name: "Insights", path: "/insights" }]}
        title="Insights"
        lead="Essays, case studies and explainers on how money actually behaves. Written to be understood, not to sell you anything."
      />
      <section className="pb-24">
        <div className="wrap">
          <InsightsList posts={posts} />
        </div>
      </section>
    </>
  );
}
