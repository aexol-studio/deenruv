import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://deenruv.com";
  const languages = ["en", "pl"];
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [];

  // Landing pages
  for (const lang of languages) {
    routes.push({
      url: `${baseUrl}/${lang}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          pl: `${baseUrl}/pl`,
        },
      },
    });
  }

  // Docs pages - add key documentation pages
  const docPages = [
    "docs",
    "docs/guides/getting-started/installation",
    "docs/guides/getting-started/configuration",
  ];

  for (const page of docPages) {
    for (const lang of languages) {
      routes.push({
        url: `${baseUrl}/${lang}/${page}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en/${page}`,
            pl: `${baseUrl}/pl/${page}`,
          },
        },
      });
    }
  }

  return routes;
}
