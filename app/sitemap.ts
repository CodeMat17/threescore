import { api } from "@/convex/_generated/api";
import { absoluteUrl } from "@/lib/site";
import { fetchQuery } from "convex/nextjs";
import type { MetadataRoute } from "next";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetched in parallel; each falls back to an empty list so a Convex outage
  // degrades the sitemap rather than failing the build.
  const [posts, services, packages] = await Promise.all([
    fetchQuery(api.blog.getBlog).catch(() => []),
    fetchQuery(api.services.getServices).catch(() => []),
    fetchQuery(api.packages.getPackages).catch(() => []),
  ]);

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/packages", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" as const },
  ].map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    // Real timestamps, so crawlers can tell what actually changed.
    lastModified: new Date(post._creationTime),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: absoluteUrl(`/services/${service.slug}`),
    lastModified: new Date(service._creationTime),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Booking pages were missing from the sitemap entirely — they are the only
  // per-package URLs on the site.
  const packageEntries: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: absoluteUrl(`/packages/booking/${encodeURIComponent(pkg.title)}`),
    lastModified: new Date(pkg._creationTime),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticEntries,
    ...packageEntries,
    ...serviceEntries,
    ...blogEntries,
  ];
}
