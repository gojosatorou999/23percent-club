import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts, getMoneyBasicsTopics } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { BlogCard } from "@/components/cards/BlogCard";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Education content, structured: the blog, Money Basics explainer hub, and the site's other learning modules.",
};

export default function LearnHubPage() {
  const latestPosts = getPublishedPosts().slice(0, 3);
  const topics = getMoneyBasicsTopics();

  return (
    <>
      <PageHero
        title="Learn"
        intro="Everything on this site that isn't a calculator lives here: the blog, the Money Basics explainer hub, and the site's other education modules as they ship."
        seam="offWhite"
      />

      <Section tone="muted">
        <Container className="flex flex-col gap-14">
          <div className="flex flex-col gap-6">
            <Reveal
              variant="soft"
              className="flex items-baseline justify-between gap-4"
            >
              <h2 className="font-display text-2xl font-semibold text-content">
                Blog
              </h2>
              <Link
                href="/learn/blog"
                className="font-body text-sm font-medium text-accent hover:underline"
              >
                View all posts →
              </Link>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-3">
              {latestPosts.map((post, i) => (
                <Reveal
                  key={post.slug}
                  index={i}
                  count={latestPosts.length}
                  className="h-full"
                >
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <Reveal
              variant="soft"
              className="flex items-baseline justify-between gap-4"
            >
              <h2 className="font-display text-2xl font-semibold text-content">
                Money Basics
              </h2>
              <Link
                href="/learn/money-basics"
                className="font-body text-sm font-medium text-accent hover:underline"
              >
                View all topics →
              </Link>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-5">
              {topics.map((topic, i) => (
                <Reveal
                  key={topic.topic}
                  index={i}
                  count={topics.length}
                  className="h-full"
                >
                  <Link
                    href={`/learn/money-basics/${topic.topic}`}
                    className="block h-full"
                  >
                    <Card
                      surface="glass"
                      lift
                      className="h-full p-4 text-center"
                    >
                      <span className="font-body text-sm font-medium text-content">
                        {topic.title}
                      </span>
                    </Card>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
