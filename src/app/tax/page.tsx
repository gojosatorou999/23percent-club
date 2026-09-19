import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { TaxComparator } from "@/components/tax/TaxComparator";
import { Faq } from "@/components/ui/Accordion";
import { faqLd, jsonLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Tax saving maximizer: old vs new regime, FY 2026-27",
  description: "Compare old and new tax regimes with your real deductions, see unused 80C, 80D, NPS and home loan headroom, and find the break-even point. FY 2025-26 and FY 2026-27.",
  path: "/tax",
});

const DEDUCTIONS = [
  { k: "80C", cap: "₹1.5 lakh", regime: "Old", body: "EPF, PPF, ELSS, life insurance premiums, children's tuition fees, home loan principal, 5-year tax-saver FD, NSC, SSY." },
  { k: "80D", cap: "₹25,000 to ₹1 lakh", regime: "Old", body: "Health insurance for yourself and family (₹25,000, or ₹50,000 if 60+) plus parents (₹25,000 or ₹50,000). Preventive check-ups up to ₹5,000 within the limit." },
  { k: "80CCD(1B)", cap: "₹50,000", regime: "Old", body: "Your own NPS contributions, over and above the 80C limit." },
  { k: "80CCD(2)", cap: "14% of basic (new), 10% (old)", regime: "Both", body: "Your employer's contribution to your NPS. One of the few deductions in the new regime." },
  { k: "HRA", cap: "Lowest of three", regime: "Old", body: "Exempt HRA is the least of HRA received, rent minus 10% of basic + DA, and 50% (metro) or 40% of basic + DA." },
  { k: "24(b)", cap: "₹2 lakh", regime: "Old", body: "Interest on a home loan for a self-occupied property." },
  { k: "EPF", cap: "Within 80C", regime: "Old", body: "Your 12% EPF contribution counts toward 80C. Interest on contributions above ₹2.5 lakh a year is taxable." },
  { k: "80E", cap: "No limit", regime: "Old", body: "Interest on an education loan for up to 8 years." },
];

const INSTRUMENTS = [
  ["ELSS", "3 years", "Market-linked", "LTCG 12.5% above ₹1.25L"],
  ["PPF", "15 years", "7.1% (reset quarterly)", "Tax-free"],
  ["NPS", "Until 60", "Market-linked", "60% lumpsum tax-free; annuity taxed"],
  ["Tax-saver FD", "5 years", "About 6.5–7.5%", "Interest taxed at slab"],
  ["NSC", "5 years", "7.7%", "Interest taxed at slab"],
  ["SSY", "21 years", "8.2%", "Tax-free"],
  ["Life insurance", "Policy term", "Low for endowment plans", "Maturity usually exempt within limits"],
];

const FAQS = [
  { q: "Can I switch regimes every year?", a: "Salaried taxpayers without business income can choose either regime every year when filing their return, whatever they declared to their employer. People with business income can switch back to the new regime only once." },
  { q: "Is the new regime better for everyone?", a: "No. It is better when your deductions and exemptions are below the break-even level for your income. With large HRA, a home loan and full 80C, 80D and NPS use, the old regime can still win." },
  { q: "When should I make tax-saving investments?", a: "Early in the financial year, spread through SIPs. Rushing in March leads to poor product choices, and investing earlier gives the money more time to grow." },
  { q: "Does the tool include capital gains?", a: "No. It covers salary and other income taxed at slab rates. Capital gains on shares, funds and property have their own rates; see the tax on investments lesson." },
];

export default function TaxPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqLd(FAQS)) }} />
      <PageHero
        crumbs={[{ name: "Tax saving maximizer", path: "/tax" }]}
        title="Pay the tax you owe. Not a rupee more."
        lead="Enter your salary and deductions once. See your tax under both regimes, how much deduction room you have left, and the exact point at which the old regime starts to win. Rules for FY 2025-26, unchanged for FY 2026-27."
      />

      <section className="pb-16">
        <div className="wrap">
          <TaxComparator slug="income-tax-calculator" maximizer />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="t-h2 max-w-[20ch]">The deductions, explained</h2>
          <p className="t-lead mt-4 max-w-[60ch]">Almost all of them apply only in the old regime. Claim what you already do; don&apos;t buy products just to claim more.</p>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DEDUCTIONS.map((d) => (
              <li key={d.k} className="flex flex-col rounded-[22px] border border-line bg-surface p-5">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display text-2xl font-bold">{d.k}</p>
                  <span className={d.regime === "Both" ? "tag bg-pos-soft text-pos" : "tag"}>{d.regime === "Both" ? "Both regimes" : "Old regime"}</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-accent">{d.cap}</p>
                <p className="mt-3 text-sm text-ink-2">{d.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="t-h2 max-w-[22ch]">Tax-saving instruments, compared</h2>
          <div className="mt-10 overflow-x-auto rounded-[22px] border border-line bg-surface" data-lenis-prevent>
            <table className="w-full min-w-[640px] text-left text-[0.95rem]">
              <thead className="bg-surface-2">
                <tr>
                  {["Instrument", "Lock-in", "Returns", "Tax on returns"].map((h) => (
                    <th key={h} scope="col" className="px-5 py-3 font-semibold text-ink-2">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {INSTRUMENTS.map((r) => (
                  <tr key={r[0]}>
                    {r.map((c, i) => (
                      <td key={i} className={i === 0 ? "px-5 py-3 font-semibold" : "px-5 py-3 text-ink-2"}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="t-h2 max-w-[20ch]">A tax-planning year</h2>
          <ol className="mt-10 grid gap-3 md:grid-cols-4">
            {[
              ["April", "Choose your regime and declare it to your employer. Start tax-saving SIPs now, not in March."],
              ["July to December", "Review salary structure, NPS through your employer, and health cover renewals."],
              ["January to February", "Submit investment and rent proofs to your employer before the deadline."],
              ["By 31 July", "File your return. Match Form 16 with Form 26AS and your AIS, and choose the better regime."],
            ].map(([m, b], i) => (
              <li key={m} className="rounded-[22px] border border-line bg-surface p-5">
                <span className="font-display text-sm font-bold text-accent tnum">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 font-display text-xl font-bold">{m}</p>
                <p className="mt-2 text-sm text-ink-2">{b}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/learn/taxation" className="btn btn-primary">
              Take the taxation module
            </Link>
            <Link href="/tools/hra-calculator" className="btn btn-ghost">
              HRA calculator
            </Link>
          </div>
        </div>
      </section>

      <section className="section pb-24">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <h2 className="t-h2">Tax questions</h2>
          <Faq items={FAQS} />
        </div>
      </section>
    </>
  );
}
