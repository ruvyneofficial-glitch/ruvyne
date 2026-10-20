import { sanityFetch } from "@/lib/sanity.client";
import { imageFocus, imageUrl, type SanityImage } from "@/lib/image";
import type { RichTextBlock } from "@/lib/legacyBody";
import { toSeo, type RawSeo, type Seo } from "@/lib/seo";

// Free-form pages (About, Contact, Privacy…) made in the Studio, at /<slug>.
export type SitePage = {
  title: string;
  slug: string;
  intro: string;
  cover: string;
  coverFocus?: string;
  coverAlt: string;
  body: RichTextBlock[];
  seo: Seo;
};

type RawPage = {
  title: string;
  slug: string;
  intro?: string | null;
  cover?: SanityImage;
  body?: RichTextBlock[] | null;
  seo?: RawSeo;
};

export async function getPageBySlug(slug: string): Promise<SitePage | null> {
  const data = await sanityFetch<RawPage | null>(
    /* groq */ `*[_type == "page" && slug.current == $slug][0]{title, "slug": slug.current, intro, cover, body, seo}`,
    { slug }
  );
  if (!data) return null;

  const cover = imageUrl(data.cover);
  return {
    title: data.title,
    slug: data.slug,
    intro: data.intro ?? "",
    cover,
    coverFocus: imageFocus(data.cover),
    coverAlt: data.cover?.alt ?? "",
    body: data.body ?? [],
    seo: toSeo(data.seo, { title: data.title, description: data.intro, image: cover }),
  };
}

// The sitemap leaves out pages marked "Hide from Google".
export async function getPageSlugs(onlyIndexable = false): Promise<string[]> {
  const filter = onlyIndexable ? ` && seo.noindex != true` : "";
  const data = await sanityFetch<string[]>(
    /* groq */ `*[_type == "page" && defined(slug.current)${filter}].slug.current`
  );
  return data ?? [];
}
