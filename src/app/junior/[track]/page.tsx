import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { ChallengeCard, JuniorQuiz, StarsBar, StoryCard } from "@/components/junior/JuniorKit";
import { CHALLENGES, GAMES, JUNIOR_QUIZ, STORIES, type Track } from "@/content/junior";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/cn";

const META: Record<Track, { title: string; lead: string; gradient: string; ages: string }> = {
  kids: { title: "Money adventures for kids", lead: "Read a story, play a game, try a week-long challenge and collect stars. Ask a grown-up to join in.", gradient: "g-sea", ages: "Ages 8–12" },
  teens: { title: "Real money skills for teens", lead: "Budgets, EMIs, scams, compounding and your first investment: the things school usually skips, in games you can finish in five minutes.", gradient: "g-aurora", ages: "Ages 13–17" },
};

export function generateStaticParams() {
  return [{ track: "kids" }, { track: "teens" }];
}

export async function generateMetadata({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  const m = META[track as Track];
  return m ? pageMeta({ title: `${m.title} (${m.ages})`, description: m.lead, path: `/junior/${track}` }) : {};
}

export default async function TrackPage({ params }: { params: Promise<{ track: string }> }) {
  const { track: t } = await params;
  if (t !== "kids" && t !== "teens") notFound();
  const track = t as Track;
  const m = META[track];
  return (
    <>
      <section className={cn(m.gradient, "grain text-white")}>
        <div className="wrap pb-14 pt-8 sm:pt-12">
          <Breadcrumbs
            className="[&_a]:text-white/75 [&_span]:text-white"
            items={[
              { name: "Junior", path: "/junior" },
              { name: track === "kids" ? "Kids" : "Teens", path: `/junior/${track}` },
            ]}
          />
          <p className="mt-8 font-semibold text-white/80">{m.ages}</p>
          <h1 className="t-display mt-1 max-w-[16ch]">{m.title}</h1>
          <p className="mt-4 max-w-[52ch] text-lg text-white/85">{m.lead}</p>
        </div>
      </section>
      <section className="section-tight pb-24">
        <div className="wrap space-y-16">
          <StarsBar track={track} />

          <div>
            <h2 className="t-h3">Stories</h2>
            <ul className="mt-5 grid gap-4 md:grid-cols-3">
              {STORIES[track].map((s, i) => (
                <li key={s.id}>
                  <StoryCard story={s} index={i} track={track} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="t-h3">Games</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {GAMES.filter((g) => g.track === track).map((g) => (
                <li key={g.id}>
                  <Link href={`/junior/play/${g.id}`} className={cn(g.gradient, "grain hover-card flex h-full min-h-[180px] flex-col rounded-[28px] p-6 text-white")}>
                    <span className="font-display text-4xl font-bold">{g.glyph}</span>
                    <span className="mt-auto font-display text-xl font-bold">{g.title}</span>
                    <span className="mt-1 text-sm text-white/80">{g.blurb}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="t-h3">Week-long challenges</h2>
            <p className="mt-1 text-ink-3">Tick off one step a day. Finish all seven for three stars.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {CHALLENGES[track].map((c) => (
                <ChallengeCard key={c.id} c={c} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="t-h3">Quick quiz</h2>
            <p className="mt-1 text-ink-3">Get three or more right for three stars.</p>
            <div className="mt-5 max-w-3xl">
              <JuniorQuiz track={track} questions={JUNIOR_QUIZ[track]} />
            </div>
          </div>

          <Link href="/junior/parents" className="g-gilded grain hover-card flex flex-col justify-between gap-2 rounded-[28px] p-6 text-white sm:flex-row sm:items-center">
            <span>
              <span className="block font-display text-xl font-bold">For parents</span>
              <span className="text-white/85">Conversation starters and family activities for this age.</span>
            </span>
            <span className="font-semibold">Open the guide</span>
          </Link>
        </div>
      </section>
    </>
  );
}
