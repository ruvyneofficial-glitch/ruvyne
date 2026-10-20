import { sanityFetch } from "@/lib/sanity.client";
import { imageFocus, imageUrl, type SanityImage } from "@/lib/image";
import { getAllArticleCards } from "./getArticleCards";

export type Category = {
  title: string;
  slug: string;
  intro: string;
  cover: string;
  coverFocus?: string;
  coverAlt: string;
  showOnHomepage: boolean;
};

type RawCategory = {
  title: string;
  slug: string;
  intro?: string | null;
  cover?: SanityImage;
  showOnHomepage?: boolean | null;
};

const QUERY = /* groq */ `
*[_type == "category" && defined(slug.current)] | order(coalesce(order, 10) asc, title asc){
  title,
  "slug": slug.current,
  intro,
  cover,
  showOnHomepage
}`;

export async function getCategories(): Promise<Category[]> {
  const data = await sanityFetch<RawCategory[]>(QUERY);

  if (data?.length) {
    return data.map((c) => ({
      title: c.title,
      slug: c.slug,
      intro: c.intro ?? "",
      cover: imageUrl(c.cover),
      coverFocus: imageFocus(c.cover),
      coverAlt: c.cover?.alt ?? "",
      showOnHomepage: c.showOnHomepage !== false,
    }));
  }

  // Before the categories migration (and offline), the categories are the
  // distinct labels on the articles themselves.
  const cards = await getAllArticleCards();
  const bySlug = new Map(cards.map((c) => [c.categorySlug, c.label]));
  return Array.from(bySlug)
    .filter(([slug, title]) => slug && title)
    .sort(([, a], [, b]) => a.localeCompare(b))
    .map(([slug, title]) => ({
      title,
      slug,
      intro: "",
      cover: "",
      coverAlt: "",
      showOnHomepage: true,
    }));
}

export function findCategory(categories: Category[], value: string) {
  return categories.find((c) => c.slug === value || c.title === value);
}
