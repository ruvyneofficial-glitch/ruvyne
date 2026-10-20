import type { Metadata } from "next";
import { shareImageUrl, type SanityImage } from "./image";
import { pageTitle, siteConfig } from "./site";

// The Search & sharing box on stories, authors and pages. Anything left
// empty falls back to the document's own title, summary and image.
export type RawSeo = {
  title?: string | null;
  description?: string | null;
  image?: SanityImage;
  noindex?: boolean | null;
} | null;

export type Seo = { title: string; description: string; image: string; noindex: boolean };

export function toSeo(
  seo: RawSeo | undefined,
  fallback: { title: string; description?: string | null; image?: string }
): Seo {
  return {
    title: seo?.title || fallback.title,
    description: seo?.description || fallback.description || "",
    image: shareImageUrl(seo?.image) || fallback.image || "",
    noindex: Boolean(seo?.noindex),
  };
}

export function seoMetadata(seo: Seo): Metadata {
  const image = seo.image.startsWith("/") ? `${siteConfig.url}${seo.image}` : seo.image;
  return {
    title: pageTitle(seo.title),
    description: seo.description || undefined,
    openGraph: image ? { images: [image] } : undefined,
    robots: seo.noindex ? { index: false, follow: true } : undefined,
  };
}
