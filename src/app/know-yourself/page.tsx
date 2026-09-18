import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { DiagnoseMock } from "@/components/home/Mockups";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Know yourself: investor personality and financial health",
  description: "Two free self-assessments: discover your investor personality across five behavioural dimensions, and score your financial health across nine areas.",
  path: "/know-yourself",
});

export default function KnowYourselfPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Know yourself", path: "/know-yourself" }]}
        title="Understand yourself before you change anything."
        lead="Most money mistakes come from how we behave, not what we know. Start with an honest look at both: how you react to risk and loss, and where your finances stand today."
      />
      <section className="section-tight pb-24">
        <div className="wrap grid gap-6 lg:grid-cols-2">
          <Link href="/know-yourself/personality" className="hover-card group flex flex-col overflow-hidden rounded-[32px] border border-line bg-surface">
            <div className="g-murex grain p-7 text-white sm:p-9">
              <p className="text-white/80">18 questions, about 4 minutes</p>
              <h2 className="mt-2 font-display text-[2rem] font-bold leading-tight tracking-tight sm:text-[2.5rem]">Investor personality</h2>
              <p className="mt-3 max-w-[44ch] text-white/85">Your archetype, a five-dimension behaviour profile, your strengths and blind spots, and the lessons that suit you.</p>
            </div>
            <div className="flex-1 bg-bg p-5 sm:p-7">
              <DiagnoseMock />
            </div>
          </Link>
          <div className="grid gap-6">
            <Link href="/know-yourself/health" className="hover-card flex flex-col justify-between overflow-hidden rounded-[32px] border border-line bg-surface">
              <div className="g-night grain p-7 text-white sm:p-9">
                <p className="text-white/80">22 questions, about 4 minutes</p>
                <h2 className="mt-2 font-display text-[2rem] font-bold leading-tight tracking-tight sm:text-[2.5rem]">Financial health check</h2>
                <p className="mt-3 max-w-[44ch] text-white/85">A score out of 100 across income, savings, spending, emergency fund, debt, insurance, investing, retirement and habits.</p>
              </div>
              <div className="flex flex-wrap gap-2 p-5 sm:p-7">
                {["Income", "Savings", "Spending", "Emergency", "Debt", "Insurance", "Investing", "Retirement", "Habits"].map((a) => (
                  <span key={a} className="chip">
                    {a}
                  </span>
                ))}
              </div>
            </Link>
            <Link href="/tax" className="hover-card flex flex-col overflow-hidden rounded-[32px] border border-line bg-surface sm:flex-row">
              <div className="g-gilded grain p-7 text-white sm:w-1/2">
                <h2 className="font-display text-[1.7rem] font-bold leading-tight tracking-tight">Tax saving maximizer</h2>
                <p className="mt-2 text-white/85">Old vs new regime, your deduction headroom and the break-even point.</p>
              </div>
              <ul className="grid flex-1 content-center gap-2 p-5 text-sm sm:p-6">
                {["Both regimes side by side", "80C, 80D, NPS and home loan headroom", "Break-even deductions for your income"].map((t) => (
                  <li key={t} className="rounded-xl bg-surface-2 px-3 py-2.5 font-medium">
                    {t}
                  </li>
                ))}
              </ul>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
