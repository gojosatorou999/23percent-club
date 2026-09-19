import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { PARENT_GUIDE } from "@/content/junior";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Parent guide: teaching children about money",
  description: "An age-by-age guide to teaching children about money in India, with conversation starters and family activities from 23percent club Junior.",
  path: "/junior/parents",
});

export default function ParentsPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { name: "Junior", path: "/junior" },
          { name: "Parents", path: "/junior/parents" },
        ]}
        title="Children learn money from watching you."
        lead="The most effective money lessons happen at home, in small, regular moments. Here's what to teach at each age, questions that start good conversations, and activities the whole family can do."
      />
      <section className="section-tight">
        <div className="wrap">
          <h2 className="t-h2">Age by age</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PARENT_GUIDE.ages.map((a, i) => (
              <li key={a.band} className="rounded-[24px] border border-line bg-surface p-5">
                <span className={`${["g-sea", "g-tide", "g-aurora", "g-tekhelet"][i]} inline-block rounded-full px-3 py-1 text-sm font-semibold text-white`}>{a.band}</span>
                <ul className="mt-4 space-y-2 text-ink-2">
                  {a.ideas.map((x) => (
                    <li key={x} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {x}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section-tight">
        <div className="wrap grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="t-h2">Conversation starters</h2>
            <ul className="mt-6 space-y-3">
              {PARENT_GUIDE.starters.map((s) => (
                <li key={s} className="rounded-2xl border border-line bg-surface p-4 font-display text-lg font-medium tracking-tight">
                  “{s}”
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="t-h2">Family activities</h2>
            <ul className="mt-6 grid gap-3">
              {PARENT_GUIDE.activities.map((a) => (
                <li key={a.t} className="rounded-2xl border border-line bg-surface p-5">
                  <p className="font-semibold">{a.t}</p>
                  <p className="mt-1 text-ink-2">{a.b}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="section-tight pb-24">
        <div className="wrap flex flex-col gap-3 sm:flex-row">
          <Link href="/junior/kids" className="btn btn-primary">
            Explore with a child (8–12)
          </Link>
          <Link href="/junior/teens" className="btn btn-ghost">
            Share with a teen (13–17)
          </Link>
          <Link href="/tools/sukanya-samriddhi-yojana-calculator" className="btn btn-quiet">
            Plan for a daughter&apos;s future
          </Link>
        </div>
      </section>
    </>
  );
}
