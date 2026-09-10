import type { Metadata } from "next";
import Link from "next/link";
import { getMoneyBasicsTopics } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Money Basics",
  description:
    "Loans, credit cards, debt, taxes, and insurance — explained plainly, without selling you a product.",
};

export default function MoneyBasicsIndexPage() {
  const topics = getMoneyBasicsTopics();

  return (
    <>
      <PageHero
        title="Money Basics"
        intro="The five topics that quietly shape every other financial decision. Explainer hubs, not product comparisons — we don't name a lender, card, or policy here."
        seam="offWhite"
      />

      <Section tone="muted">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {topics.map((topic, i) => (
              <Reveal
                key={topic.topic}
                index={i}
                count={topics.length}
                className="h-full"
              >
                <Link
                  href={`/learn/money-basics/${topic.topic}`}
                  className="group block h-full"
                >
                  <Card
                    surface="glass"
                    lift
                    className="flex h-full flex-col gap-3 p-6"
                  >
                    <h2 className="font-display text-xl font-semibold text-content transition-colors group-hover:text-accent">
                      {topic.title}
                    </h2>
                    <p className="font-body text-sm leading-relaxed text-content-2">
                      {topic.excerpt}
                    </p>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
