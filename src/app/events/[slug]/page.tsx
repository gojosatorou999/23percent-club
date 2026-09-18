import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Users, UserRound } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { EventStatus } from "@/components/events/EventsBoard";
import { ToolTile } from "@/components/tools/ToolsExplorer";
import { EVENTS, eventWhen, getEvent } from "@/content/events";
import { getModule } from "@/content/school-outline";
import { jsonLd, pageMeta, siteUrl } from "@/lib/seo";
import { cn } from "@/lib/cn";

const BUILD_NOW = Date.now();

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getEvent(slug);
  return e ? pageMeta({ title: e.title, description: e.summary, path: `/events/${slug}` }) : {};
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getEvent(slug);
  if (!e) notFound();
  const w = eventWhen(e.start);
  const mod = e.module ? getModule(e.module) : undefined;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    description: e.summary,
    startDate: e.start,
    endDate: new Date(new Date(e.start).getTime() + e.minutes * 60000).toISOString(),
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: { "@type": "VirtualLocation", url: `${siteUrl()}/events/${slug}` },
    organizer: { "@type": "Organization", name: "23% Club", url: siteUrl() },
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR", url: `${siteUrl()}/events/${slug}` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <section className={cn(e.gradient, "grain text-white")}>
        <div className="wrap pb-14 pt-8 sm:pt-12">
          <Breadcrumbs
            className="[&_a]:text-white/75 [&_span]:text-white"
            items={[
              { name: "Events", path: "/events" },
              { name: e.type, path: `/events/${slug}` },
            ]}
          />
          <p className="mt-8 font-semibold text-white/80">{e.type}</p>
          <h1 className="t-display mt-2 max-w-[20ch]">{e.title}</h1>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-white/85">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" /> {w.label}, {e.minutes} minutes
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4" /> {e.audience}
            </span>
            <span className="inline-flex items-center gap-2">
              <UserRound className="h-4 w-4" /> {e.host}
            </span>
          </div>
        </div>
      </section>
      <section className="section-tight pb-24">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-10">
            <div>
              <h2 className="t-h3">About this session</h2>
              <p className="mt-3 max-w-[64ch] text-lg text-ink-2">{e.summary}</p>
            </div>
            <div>
              <h2 className="t-h3">Agenda</h2>
              <ol className="mt-4 space-y-2">
                {e.agenda.map((a, i) => (
                  <li key={a} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent">{i + 1}</span>
                    {a}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h2 className="t-h3">Key takeaways</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {e.takeaways.map((t) => (
                  <li key={t} className="rounded-2xl bg-surface-2 p-4 text-ink">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <aside className="space-y-5 lg:sticky lg:top-[calc(var(--nav-h)+24px)] lg:self-start">
            <div className="rounded-[24px] border border-line bg-surface p-5">
              <p className="font-display text-xl font-bold">{w.label}</p>
              <p className="mt-1 text-sm text-ink-3">
                Online and free. Registering saves it to your dashboard and calendar; the joining link is published on this page before the session starts.
              </p>
              {e.joinUrl && (
                <a href={e.joinUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-4 w-full">
                  Join the session
                </a>
              )}
              {e.recordingUrl && (
                <a href={e.recordingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-3 w-full">
                  Watch the recording
                </a>
              )}
              <div className="mt-5">
                <EventStatus slug={e.slug} start={e.start} buildNow={BUILD_NOW} />
              </div>
            </div>
            {mod && (
              <Link href={`/learn/${mod.slug}`} className={cn(mod.gradient, "grain hover-card block rounded-[24px] p-5 text-white")}>
                <span className="text-sm text-white/80">Prepare with</span>
                <span className="mt-1 block font-display text-lg font-bold">
                  Module {mod.n}: {mod.title}
                </span>
              </Link>
            )}
            {e.tool && (
              <div className="max-w-[220px]">
                <ToolTile slug={e.tool} compact />
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
