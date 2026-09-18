import type { ReactNode } from "react";
import { PageHero } from "./PageHero";

export function LegalPage({ title, path, updated, children }: { title: string; path: string; updated: string; children: ReactNode }) {
  return (
    <>
      <PageHero crumbs={[{ name: title, path }]} title={title} lead={`Last updated ${updated}.`} />
      <section className="section-tight pb-24">
        <div className="wrap">
          <div className="prose">{children}</div>
        </div>
      </section>
    </>
  );
}
