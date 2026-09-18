import type { Metadata } from "next";

export const SITE_NAME = "23% Club";
export const TAGLINE = "Learn • Invest • Grow • Compound";
export const DESCRIPTION =
  "23% Club is a financial education platform for India: a 13-module School of Finance, 42 calculators, an investor personality test, a financial health check, a tax saving maximizer and a personal learning dashboard. We don't manage your money. We teach you how to manage it.";

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export function pageMeta({
  title,
  description,
  path,
  image = "/og-default.svg",
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type, images: [image], siteName: SITE_NAME, locale: "en_IN" },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationLd() {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    url: base,
    logo: `${base}/icon.svg`,
    slogan: "We don't manage your money. We teach you how to manage it.",
    description: DESCRIPTION,
    areaServed: "IN",
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${base}${it.path}` })),
  };
}
