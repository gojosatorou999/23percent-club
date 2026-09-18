import { PageHero } from "@/components/ui/PageHero";
import { GlossaryList } from "@/components/universe/GlossaryList";
import { GLOSSARY } from "@/content/glossary";
import { jsonLd, pageMeta, siteUrl } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Personal finance glossary",
  description: `${GLOSSARY.length} personal finance and investing terms explained in plain English for Indian investors: SIP, NAV, XIRR, LTCG, 80C, duration and more.`,
  path: "/universe/glossary",
});

export default function GlossaryPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "23% Club personal finance glossary",
    url: `${siteUrl()}/universe/glossary`,
    hasDefinedTerm: GLOSSARY.map((t) => ({ "@type": "DefinedTerm", name: t.term, description: t.def })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <PageHero
        crumbs={[
          { name: "Universe", path: "/universe" },
          { name: "Glossary", path: "/universe/glossary" },
        ]}
        title="Every term, in one breath."
        lead="Plain-English definitions of the words you'll meet in statements, apps and offer documents, each linked to the lesson or tool that goes deeper."
      />
      <section className="pb-24">
        <div className="wrap">
          <GlossaryList />
        </div>
      </section>
    </>
  );
}
