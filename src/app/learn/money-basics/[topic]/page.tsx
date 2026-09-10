import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMoneyBasicsTopics, getMoneyBasicsTopic } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SourceCitation } from "@/components/ui/SourceCitation";

export function generateStaticParams() {
  return getMoneyBasicsTopics().map((t) => ({ topic: t.topic }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const page = await getMoneyBasicsTopic(topic);
  if (!page) return {};

  return {
    title: page.frontmatter.title,
    description: page.frontmatter.excerpt,
  };
}

export default async function MoneyBasicsTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const page = await getMoneyBasicsTopic(topic);
  if (!page) notFound();

  const { frontmatter, content } = page;

  return (
    <>
      <PageHero
        title={frontmatter.title}
        width="prose"
        intro={
          frontmatter.updatedAt
            ? `Last updated: ${new Date(frontmatter.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
            : undefined
        }
      />

      <Section>
        <Container width="prose">
          <article>{content}</article>

          {frontmatter.sources.length > 0 && (
            <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6">
              <p className="font-body text-xs font-medium uppercase tracking-wide text-content-2">
                Sources
              </p>
              {frontmatter.sources.map((source) => (
                <SourceCitation key={source} label={source} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
