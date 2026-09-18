import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { Quiz } from "@/components/learn/Quiz";
import { LessonList } from "@/components/learn/Progress";
import { MODULES, getModule } from "@/content/school-outline";
import { getModuleContent } from "@/content/school";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return MODULES.map((m) => ({ module: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  const m = getModule(module);
  if (!m) return {};
  return pageMeta({ title: `Quiz: ${m.title}`, description: `Test what you learned in module ${m.n}, ${m.title}.`, path: `/learn/${m.slug}/quiz` });
}

export default async function QuizPage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  const m = getModule(module);
  const c = getModuleContent(module);
  if (!m || !c) notFound();
  return (
    <div className="wrap grid gap-10 pb-24 pt-8 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
      <div className="min-w-0">
        <Breadcrumbs
          items={[
            { name: "School", path: "/learn" },
            { name: m.short, path: `/learn/${m.slug}` },
            { name: "Quiz", path: `/learn/${m.slug}/quiz` },
          ]}
        />
        <h1 className="t-display mt-6 text-[2.2rem] sm:text-[3rem]">{m.title} quiz</h1>
        <p className="t-lead mt-3 mb-8">Five questions. Score 60% or more, with every lesson done, to earn the certificate.</p>
        <Quiz moduleSlug={m.slug} moduleTitle={m.title} questions={c.quiz} />
      </div>
      <aside className="hidden lg:block">
        <div className="sticky top-[calc(var(--nav-h)+28px)] rounded-[24px] border border-line bg-surface p-3">
          <p className="px-3 pb-2 pt-3 font-semibold">{m.title}</p>
          <LessonList slug={m.slug} current="quiz" />
        </div>
      </aside>
    </div>
  );
}
