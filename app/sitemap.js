import { CATEGORIES, SITE } from "@/lib/utils/categories";
import { LANGUAGES } from "@/lib/utils/languages";

export default function sitemap() {
  const staticRoutes = ["", "/search", "/categories", "/authors", "/free-books", "/languages"].map((path) => ({
    url: `${SITE.url}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.8,
  }));

  const subjects = CATEGORIES.map((item) => ({
    url: `${SITE.url}/subject/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const languages = LANGUAGES.map((item) => ({
    url: `${SITE.url}/language/${item.code}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...subjects, ...languages];
}
