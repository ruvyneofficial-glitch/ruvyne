import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getArticleSlugs } from "@/app/functions/getArticleBySlug";
import { getAuthorSlugs } from "@/app/functions/getAuthors";
import { getPageSlugs } from "@/app/functions/getPages";
// Podcasts are switched off.
// import { getPodcastSlugs } from "@/app/functions/getPodcasts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Anything marked "Hide from Google" in the Studio is left out.
  const [articles, authors, pages /*, podcasts */] = await Promise.all([
    getArticleSlugs(true),
    getAuthorSlugs(true),
    getPageSlugs(true),
    // getPodcastSlugs(),
  ]);
  const lastModified = new Date();

  const staticRoutes = ["", "/magazine", /* "/podcasts", */ "/authors"].map(
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
    ...pages.map((slug) => ({
      url: `${siteConfig.url}/${slug}`,
      lastModified,
    })),
    // ...podcasts.map((slug) => ({
    //   url: `${siteConfig.url}/podcasts/${slug}`,
    //   lastModified,
    // })),
  ];
}
