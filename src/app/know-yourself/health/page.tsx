import { PageHero } from "@/components/ui/PageHero";
import { HealthCheck } from "@/components/diagnose/Health";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Financial health check",
  description: "Score your financial health out of 100 across nine areas, from emergency fund and debt to insurance and retirement, and get your top three priorities with lessons and tools.",
  path: "/know-yourself/health",
});

export default function HealthPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { name: "Know yourself", path: "/know-yourself" },
          { name: "Financial health check", path: "/know-yourself/health" },
        ]}
        title="How healthy are your finances?"
        lead="A doctor checks your vitals before prescribing anything. Do the same for your money: nine areas, one score, and the three things that will help most."
      />
      <section className="pb-24">
        <div className="wrap">
          <HealthCheck />
        </div>
      </section>
    </>
  );
}
