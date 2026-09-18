import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { GameHost } from "@/components/junior/GameHost";
import { GAMES } from "@/content/junior";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return GAMES.map((g) => ({ game: g.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;
  const g = GAMES.find((x) => x.id === game);
  return g ? pageMeta({ title: `${g.title}: a money game`, description: g.blurb, path: `/junior/play/${g.id}` }) : {};
}

export default async function GamePage({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;
  const g = GAMES.find((x) => x.id === game);
  if (!g) notFound();
  return (
    <div className="wrap pb-24 pt-8 sm:pt-12">
      <Breadcrumbs
        items={[
          { name: "Junior", path: "/junior" },
          { name: g.track === "kids" ? "Kids" : "Teens", path: `/junior/${g.track}` },
          { name: g.title, path: `/junior/play/${g.id}` },
        ]}
      />
      <h1 className="t-display mt-6">{g.title}</h1>
      <p className="t-lead mt-3 mb-8 max-w-[50ch]">{g.blurb}</p>
      <GameHost id={g.id} />
      <Link href={`/junior/${g.track}`} className="btn btn-ghost mt-8">
        More for {g.track === "kids" ? "kids" : "teens"}
      </Link>
    </div>
  );
}
