import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getArticles } from "@/app/functions/getArticles";
import { getPodcasts } from "@/app/functions/getPodcasts";

/**
 * Generated from the content data so slugs can never drift out of sync,
 * replacing the hand-written sitemap.xml that shipped with the template.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const authors = await getArticles();
  const podcasts = await getPodcasts();
  const lastModified = new Date();

  const staticRoutes = ["", "/magazine", "/podcasts", "/authors"].map(
    (route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified,
    })
  );

  const authorRoutes = authors.map((author) => ({
    url: `${siteConfig.url}/authors/${encodeURIComponent(author.slug)}`,
    lastModified,
  }));

  const articleRoutes = authors.flatMap((author) =>
    author.articles.map((article) => ({
      url: `${siteConfig.url}/magazine/${article.slug}`,
      lastModified,
    }))
  );

  const podcastRoutes = podcasts.map((podcast) => ({
    url: `${siteConfig.url}/podcasts/${podcast.slug}`,
    lastModified,
  }));

  return [
    ...staticRoutes,
    ...authorRoutes,
    ...articleRoutes,
    ...podcastRoutes,
  ];
}
