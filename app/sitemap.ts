import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getArticleSlugs } from "@/app/functions/getArticleBySlug";
import { getAuthorSlugs } from "@/app/functions/getAuthors";
import { getPodcastSlugs } from "@/app/functions/getPodcasts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, authors, podcasts] = await Promise.all([
    getArticleSlugs(),
    getAuthorSlugs(),
    getPodcastSlugs(),
  ]);
  const lastModified = new Date();

  const staticRoutes = ["", "/magazine", "/podcasts", "/authors"].map(
    (route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified,
    })
  );

  return [
    ...staticRoutes,
    ...authors.map((slug) => ({
      url: `${siteConfig.url}/authors/${encodeURIComponent(slug)}`,
      lastModified,
    })),
    ...articles.map((slug) => ({
      url: `${siteConfig.url}/magazine/${slug}`,
      lastModified,
    })),
    ...podcasts.map((slug) => ({
      url: `${siteConfig.url}/podcasts/${slug}`,
      lastModified,
    })),
  ];
}
