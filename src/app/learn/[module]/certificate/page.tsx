import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/PageHero";
import { Certificate } from "@/components/learn/Certificate";
import { MODULES, getModule } from "@/content/school-outline";

export function generateStaticParams() {
  return MODULES.map((m) => ({ module: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  const m = getModule(module);
  return m ? { title: `Certificate: ${m.title}`, robots: { index: false } } : {};
}

export default async function CertificatePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  const m = getModule(module);
  if (!m) notFound();
  return (
    <div className="wrap pb-24 pt-8 sm:pt-12">
      <div className="no-print">
        <Breadcrumbs
          items={[
            { name: "School", path: "/learn" },
            { name: m.short, path: `/learn/${m.slug}` },
            { name: "Certificate", path: `/learn/${m.slug}/certificate` },
          ]}
        />
        <h1 className="t-h2 mb-8 mt-6 text-center">Module {m.n} certificate</h1>
      </div>
      <Certificate slug={m.slug} title={m.title} n={m.n} outcomes={m.outcomes} />
    </div>
  );
}
