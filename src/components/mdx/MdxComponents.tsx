import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { AnchorHTMLAttributes, HTMLAttributes } from "react";
import { Callout } from "./Callout";
import { CalculatorEmbed } from "./CalculatorEmbed";
import { SourceCitation } from "@/components/ui/SourceCitation";

/**
 * Prose typography for post bodies — matches the Sapphire Blue type
 * scale (README §3.2) rather than default browser styles. Shared by
 * every compiled post via src/lib/content.ts.
 */
export const mdxComponents: MDXComponents = {
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 mb-4 font-display text-2xl font-semibold text-content" {...props} />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-8 mb-3 font-display text-xl font-semibold text-content" {...props} />
  ),
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-5 font-body text-base leading-relaxed text-content" {...props} />
  ),
  a: ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href?.startsWith("/")) {
      return <Link href={href} className="text-accent underline decoration-border hover:decoration-accent" {...props} />;
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline decoration-border hover:decoration-accent"
        {...props}
      />
    );
  },
  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-5 ml-5 list-disc space-y-2 font-body text-base leading-relaxed text-content" {...props} />
  ),
  ol: (props: HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-5 ml-5 list-decimal space-y-2 font-body text-base leading-relaxed text-content" {...props} />
  ),
  blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-6 border-l-2 border-accent pl-5 font-body text-base italic leading-relaxed text-content-2" {...props} />
  ),
  code: (props: HTMLAttributes<HTMLElement>) => (
    <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-sm text-accent" {...props} />
  ),
  hr: () => <hr className="my-10 border-line" />,
  Callout,
  CalculatorEmbed,
  SourceCitation,
};
