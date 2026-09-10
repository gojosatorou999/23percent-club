"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

/** Contextual CTA into a related blog post — README §5.1. */
export function BlogCta({ teaser, href = "/learn/blog" }: { teaser: string; href?: string }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-start gap-2 rounded border border-line bg-surface-2 p-6">
      <p className="font-body text-sm text-content">{teaser}</p>
      <Link
        href={href}
        onClick={() => trackEvent("tool_cta_clicked", { from: pathname, to: href })}
        className="font-body text-sm font-medium text-accent hover:underline"
      >
        Read more on the blog
      </Link>
    </div>
  );
}
