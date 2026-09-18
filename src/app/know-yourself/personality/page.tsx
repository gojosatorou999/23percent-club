import { PageHero } from "@/components/ui/PageHero";
import { PersonalityTest } from "@/components/diagnose/Personality";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Investor personality test",
  description: "Discover your investor personality: an 18-question behavioural assessment across risk appetite, patience, discipline, composure and curiosity, with personalised lessons.",
  path: "/know-yourself/personality",
});

export default function PersonalityPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { name: "Know yourself", path: "/know-yourself" },
          { name: "Investor personality", path: "/know-yourself/personality" },
        ]}
        title="What kind of investor are you, really?"
        lead="How you behave when markets fall, when a tip arrives or when a bonus lands matters more than any fund you pick. This test shows your tendencies so you can build rules around them."
      />
      <section className="pb-24">
        <div className="wrap">
          <PersonalityTest />
        </div>
      </section>
    </>
  );
}
