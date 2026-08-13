import { SITE } from "@/lib/utils/categories";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/read/", "/saved"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
