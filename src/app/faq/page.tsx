import { Faq } from "@/components/ui/Accordion";
import { PageHero } from "@/components/ui/PageHero";
import { FAQ_GROUPS } from "@/content/faq";
import { faqLd, jsonLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Frequently asked questions",
  description: "Answers about 23percent club's lessons, calculators, diagnostics, accounts and privacy.",
  path: "/faq",
});

export default function FaqPage() {
  const all = FAQ_GROUPS.flatMap((g) => g.items);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqLd(all)) }} />
      <PageHero crumbs={[{ name: "FAQ", path: "/faq" }]} title="Questions, answered" lead="If your question isn't here, the lesson or tool it relates to usually covers it in more depth." />
      <section className="section-tight pb-24">
        <div className="wrap grid gap-12 lg:grid-cols-[14rem_1fr]">
          <nav aria-label="FAQ sections" className="hidden lg:block">
            <ul className="sticky top-28 space-y-1">
              {FAQ_GROUPS.map((g) => (
                <li key={g.title}>
                  <a href={`#${g.title.toLowerCase().replace(/\W+/g, "-")}`} className="block rounded-xl px-3 py-2 text-ink-2 hover:bg-surface-2">
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-14">
            {FAQ_GROUPS.map((g) => (
              <section key={g.title} id={g.title.toLowerCase().replace(/\W+/g, "-")}>
                <h2 className="t-h3 mb-4">{g.title}</h2>
                <Faq items={g.items} />
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
