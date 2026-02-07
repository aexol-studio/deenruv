import type { MetadataRoute } from "next";
import { source } from "@/lib/source";
import { i18n } from "@/lib/i18n";
import { toAbsoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const seen = new Set<string>();
  const routes: MetadataRoute.Sitemap = [];

  const pushRoute = (url: string, priority: number) => {
    if (seen.has(url)) return;
    seen.add(url);
    routes.push({
      url,
      lastModified: now,
      changeFrequency: "weekly",
      priority,
    });
  };

  for (const lang of i18n.languages) {
    pushRoute(toAbsoluteUrl(`/${lang}`), 1.0);
  }

  for (const page of source.getPages()) {
    pushRoute(toAbsoluteUrl(page.url), 0.8);
  }

  return routes;
}
