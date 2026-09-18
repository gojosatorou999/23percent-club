import { PageHero } from "@/components/ui/PageHero";
import { EventsBoard } from "@/components/events/EventsBoard";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Events and live: webinars, workshops and masterclasses",
  description: "Free live sessions from 23% Club: tax webinars, mutual fund classes, financial planning workshops, behavioural finance masterclasses and family sessions, with takeaways from past events.",
  path: "/events",
});

const BUILD_NOW = Date.now();

export default function EventsPage() {
  return (
    <>
      <PageHero
        tone="deep"
        crumbs={[{ name: "Events", path: "/events" }]}
        title="Learn it live."
        lead="Free webinars, live classes, hands-on workshops and masterclasses. Register in one tap, add it to your calendar, and find the key takeaways from every past session here."
      />
      <section className="section-tight pb-24">
        <div className="wrap">
          <EventsBoard buildNow={BUILD_NOW} />
        </div>
      </section>
    </>
  );
}
