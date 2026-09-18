import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { breadcrumbLd, jsonLd } from "@/lib/seo";

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className={cn("text-sm text-ink-3", className)}>
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />}
              {i === all.length - 1 ? (
                <span aria-current="page" className="text-ink-2">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="hover:text-ink">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbLd(all)) }} />
    </>
  );
}

/**
 * Inner-page opener. `tone="deep"` sets it on the night-tekhelet field;
 * `aside` fills the right column on large screens (a mockup, stats, a ring).
 */
export function PageHero({
  title,
  lead,
  crumbs,
  children,
  aside,
  tone = "light",
  className,
}: {
  title: ReactNode;
  lead?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
  aside?: ReactNode;
  tone?: "light" | "deep";
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden", tone === "deep" ? "deep grain" : "g-soft", className)}>
      <div className={cn("wrap relative grid items-center gap-10 pb-14 pt-8 sm:pt-12 lg:pb-20", !!aside && "lg:grid-cols-[1.15fr_1fr]")}>
        <div className="stagger min-w-0">
          {crumbs && <Breadcrumbs items={crumbs} className="mb-6" />}
          <h1 className="t-display max-w-[16ch]">{title}</h1>
          {lead && <p className="t-lead mt-5 max-w-[58ch]">{lead}</p>}
          {children && <div className="mt-7">{children}</div>}
        </div>
        {aside && <div className="min-w-0">{aside}</div>}
      </div>
    </section>
  );
}

export function SectionHead({ title, lead, className, action }: { title: ReactNode; lead?: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        <h2 className="t-h2">{title}</h2>
        {lead && <p className="t-lead mt-3">{lead}</p>}
      </div>
      {action}
    </div>
  );
}
