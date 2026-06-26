// robots.txt: allow everything except /drafts/, and point crawlers at the sitemap.
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/drafts/"],
    },
    sitemap: "https://eldanmtz.com/sitemap.xml",
  };
}