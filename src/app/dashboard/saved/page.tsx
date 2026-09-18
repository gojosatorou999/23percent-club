import { SavedDash } from "@/components/dashboard/Misc";
import { getInsights } from "@/lib/insights";

export const metadata = { title: "Saved" };

export default function Page() {
  return <SavedDash articles={getInsights().map((p) => ({ slug: p.slug, title: p.title }))} />;
}
