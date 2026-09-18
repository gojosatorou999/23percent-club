import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { SymbolField } from "@/components/motion/SymbolField";
import { GAMES } from "@/content/junior";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/cn";

export const metadata = pageMeta({
  title: "23% Club Junior: money lessons and games for kids and teens",
  description: "Financial education for ages 8 to 17: stories, games, quizzes and challenges about saving, needs and wants, compounding, budgeting and staying safe from scams, plus a guide for parents.",
  path: "/junior",
});

export default function JuniorPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(90% 90% at 90% 0%, rgb(236 201 124 / .35), transparent 60%), radial-gradient(80% 80% at 0% 100%, rgb(127 211 240 / .35), transparent 60%)" }} />
        <SymbolField mode="vivid" className="-z-10 opacity-60" />
        <div className="wrap pb-16 pt-8 sm:pb-24 sm:pt-12">
          <Breadcrumbs items={[{ name: "Junior", path: "/junior" }]} />
          <h1 className="t-mega mt-8 max-w-[12ch]">Money is a game you can learn early.</h1>
          <p className="t-lead mt-6 max-w-[54ch]">
            Stories, games, quizzes and weekly challenges that teach saving, choices, compounding and staying safe online. Earn stars as you go. Built for two ages, with a guide for parents.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Link href="/junior/kids" className="g-sea grain hover-card relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-[32px] p-7 text-white">
              <span className="absolute right-6 top-4 font-display text-7xl font-bold opacity-30">8–12</span>
              <span className="font-display text-3xl font-bold">Kids</span>
              <span className="mt-1 text-white/85">Jars, mango stalls and money trees</span>
            </Link>
            <Link href="/junior/teens" className="g-aurora grain hover-card relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-[32px] p-7 text-white">
              <span className="absolute right-6 top-4 font-display text-7xl font-bold opacity-30">13–17</span>
              <span className="font-display text-3xl font-bold">Teens</span>
              <span className="mt-1 text-white/85">Budgets, scams, EMIs and first SIPs</span>
            </Link>
            <Link href="/junior/parents" className="g-gilded grain hover-card relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-[32px] p-7 text-white">
              <span className="font-display text-3xl font-bold">Parents</span>
              <span className="mt-1 text-white/85">Age-by-age guide, conversation starters and family activities</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section-tight pb-24">
        <div className="wrap">
          <h2 className="t-h2">Games</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {GAMES.map((g) => (
              <li key={g.id}>
                <Link href={`/junior/play/${g.id}`} className={cn(g.gradient, "grain hover-card flex h-full min-h-[200px] flex-col rounded-[28px] p-5 text-white")}>
                  <span className="font-display text-4xl font-bold opacity-90">{g.glyph}</span>
                  <span className="mt-auto text-xs font-semibold text-white/75">{g.track === "kids" ? "Ages 8–12" : "Ages 13–17"}</span>
                  <span className="font-display text-lg font-bold leading-tight">{g.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
