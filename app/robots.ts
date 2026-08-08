import { SITE_URL, absoluteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Internal tooling and post-submission pages carry no search value.
        disallow: ["/admin/", "/thank-you", "/contact/success"],
      },
    ],
    sitemap: [absoluteUrl("/sitemap.xml")],
    host: SITE_URL,
  };
}
