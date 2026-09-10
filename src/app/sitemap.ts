import type { MetadataRoute } from "next";
import { getPublishedPosts, getMoneyBasicsTopics, getPublishedLegends } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

/**
 * Excludes /dev/* (never listed here to begin with) and every draft
 * route — getPublishedPosts()/getPublishedLegends() already filter
 * status: draft, so Munger and any future draft post are excluded
 * automatically rather than by a second manual check here.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/tools/sip-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/tools/step-up-sip-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/tools/lumpsum-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/tools/inflation-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/learn/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/learn/money-basics`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/legends`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/disclosures`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/legal/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/legal/tos`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = getPublishedPosts().map((post) => ({
    url: `${base}/learn/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const moneyBasicsRoutes: MetadataRoute.Sitemap = getMoneyBasicsTopics().map((topic) => ({
    url: `${base}/learn/money-basics/${topic.topic}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const legendRoutes: MetadataRoute.Sitemap = getPublishedLegends().map((legend) => ({
    url: `${base}/legends/${legend.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...blogRoutes, ...moneyBasicsRoutes, ...legendRoutes];
}
