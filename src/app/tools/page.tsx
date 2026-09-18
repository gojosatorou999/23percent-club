import { PageHero } from "@/components/ui/PageHero";
import { ToolsExplorer } from "@/components/tools/ToolsExplorer";
import { TOOLS } from "@/content/tools-meta";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Financial calculators and tools",
  description:
    "42 free financial calculators for India: SIP, step-up SIP, lumpsum, SWP, PPF, EPF, NPS, FD, RD, EMI, income tax, HRA, retirement, FIRE, goal planner and more, with charts and formulas.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Tools", path: "/tools" }]}
        title="Test a decision before you make it."
        lead={`${TOOLS.length} calculators for investing, planning, government schemes, loans and tax. Every one shows its formula, explains the result and links to the lesson behind it. Save any result to your dashboard.`}
      />
      <section className="section-tight pb-24">
        <div className="wrap">
          <ToolsExplorer />
        </div>
      </section>
    </>
  );
}
