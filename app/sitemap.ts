import { api } from "@/convex/_generated/api";
import {
  blogPosts as fallbackPosts,
  services as servicesFallback,
} from "@/lib/data";
import { fetchQuery } from "convex/nextjs";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://threescoretours.com"
  ).replace(/\/$/, "");

  // Static routes
  const staticRoutes = [
    "/",
    "/packages",
    "/services",
    "/about",
    "/blog",
    "/contact",
  ];

  // Fetch dynamic blog slugs from Convex; fall back to local data if Convex is unavailable during build
  let blogEntries: Array<{ slug: string; _creationTime?: number }>;
  try {
    blogEntries = await fetchQuery(api.blog.getBlog, {});
  } catch {
    blogEntries = fallbackPosts.map((p) => ({ slug: p.slug }));
  }

  const blogRoutes = blogEntries.map((b) => ({
    url: `${base}/blog/${b.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
    lastModified: b._creationTime ? new Date(b._creationTime) : undefined,
  }));

  // Fetch dynamic service slugs; fall back to static service keys
  let serviceEntries: Array<{ slug: string; _updatedTime?: number }>;
  try {
    serviceEntries = await fetchQuery(api.services.getServices, {});
  } catch {
    serviceEntries = servicesFallback.map((s) => ({ slug: s.key }));
  }

  const serviceRoutes = serviceEntries.map((s) => ({
    url: `${base}/services/${s.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${base}${route}`,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));

  return [...staticEntries, ...blogRoutes, ...serviceRoutes];
}
