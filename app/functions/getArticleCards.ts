import articlesData from "@/json/articles.json";
import { sanityFetch } from "@/lib/sanity.client";
import { dateValue, formatDate, toIsoDate } from "@/lib/dates";
import { imageFocus, imageUrl, type SanityImage } from "@/lib/image";
import { slugify } from "@/lib/site";
import type { ArticleType } from "./getArticles";

export type ArticleCard = {
  title: string;
  slug: string;
  label: string;
  categorySlug: string;
  description: string;
  date: string;
  isoDate: string;
  read: string;
  img: string;
  imgFocus?: string;
  imgAlt: string;
  author: string;
  authorSlug: string;
};

type RawCard = Omit<ArticleCard, "img" | "categorySlug" | "isoDate" | "imgFocus"> & {
  img: SanityImage | string;
  categorySlug?: string | null;
};

export type ArticleCardPage = {
  items: ArticleCard[];
  total: number;
};

export const ARTICLE_SORTS = {
  newest: "Newest",
  oldest: "Oldest",
  az: "A to Z",
  za: "Z to A",
} as const;

export type ArticleSort = keyof typeof ARTICLE_SORTS;

const compare: Record<ArticleSort, (a: ArticleCard, b: ArticleCard) => number> = {
  newest: (a, b) => dateValue(b.date) - dateValue(a.date),
  oldest: (a, b) => dateValue(a.date) - dateValue(b.date),
  az: (a, b) => a.title.localeCompare(b.title),
  za: (a, b) => b.title.localeCompare(a.title),
};

// Category comes from the Category document, or from the old text label on
// articles the categories migration has not reached yet.
const CARD_FIELDS = /* groq */ `
  title,
  "slug": slug.current,
  "label": coalesce(category->title, label),
  "categorySlug": category->slug.current,
  description,
  date,
  read,
  img,
  imgAlt,
  "author": author->name,
  "authorSlug": author->slug.current
`;

const fallbackCards: RawCard[] = (articlesData as unknown as ArticleType[]).flatMap((a) =>
  a.articles.map((x) => ({
    title: x.title,
    slug: x.slug,
    label: x.label,
    description: x.description,
    date: x.date,
    read: x.read,
    img: x.img,
    imgAlt: x.imgAlt,
    author: a.author,
    authorSlug: a.slug,
  }))
);

const localImageBySlug = new Map(fallbackCards.map((c) => [c.slug, c.img as string]));

function present(card: RawCard): ArticleCard {
  const isLocal = typeof card.img === "string";
  let img = isLocal ? (card.img as string) : imageUrl(card.img as SanityImage);
  if (!img) {
    console.warn(`[sanity] no image for ${card.slug}, using the bundled copy`);
    img = localImageBySlug.get(card.slug) ?? "";
  }
  return {
    ...card,
    img,
    imgFocus: isLocal ? undefined : imageFocus(card.img as SanityImage),
    categorySlug: card.categorySlug || slugify(card.label ?? ""),
    date: formatDate(card.date),
    isoDate: toIsoDate(card.date),
  };
}

// shortcut: loads every card and sorts in JS, because documents written before
// the date picker store dates as text ("12 August 2026") that GROQ can only
// sort alphabetically. Once `npx sanity migration run iso-dates` has run and
// the archive reaches the thousands, move ordering and paging back into GROQ.
export async function getAllArticleCards(): Promise<ArticleCard[]> {
  const data = await sanityFetch<RawCard[]>(/* groq */ `*[_type == "article"]{${CARD_FIELDS}}`);
  return (data?.length ? data : fallbackCards).map(present).sort(compare.newest);
}

// `category` is a category's web address, or its name in older links.
export function inCategory(card: ArticleCard, category: string) {
  return card.categorySlug === category || card.label === category;
}

export async function getArticleCards({
  limit = 12,
  offset = 0,
  category,
  sort = "newest",
}: {
  limit?: number;
  offset?: number;
  category?: string;
  sort?: ArticleSort;
} = {}): Promise<ArticleCardPage> {
  const all = await getAllArticleCards();
  const filtered = category && category !== "All" ? all.filter((c) => inCategory(c, category)) : all;
  const sorted = sort === "newest" ? filtered : [...filtered].sort(compare[sort]);

  return {
    items: sorted.slice(offset, offset + limit),
    total: sorted.length,
  };
}

export async function getArticlesByAuthor(authorSlug: string): Promise<ArticleCard[]> {
  return (await getAllArticleCards()).filter((c) => c.authorSlug === authorSlug);
}

export async function searchArticles(query: string): Promise<ArticleCard[]> {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  return (await getAllArticleCards()).filter((c) => {
    const text = [c.title, c.description, c.label, c.author].join(" ").toLowerCase();
    return terms.every((t) => text.includes(t));
  });
}

// The editor's drag-and-drop list (Site settings > Homepage > Most popular)
// wins; until it has stories, the older per-article Popular tick boxes apply.
export async function getPopularArticles(picked: string[], limit = 5): Promise<ArticleCard[]> {
  if (picked.length) {
    const all = await getAllArticleCards();
    return picked
      .map((slug) => all.find((c) => c.slug === slug))
      .filter((c): c is ArticleCard => Boolean(c))
      .slice(0, limit);
  }

  const data = await sanityFetch<RawCard[]>(
    /* groq */ `*[_type == "article" && popular == true] | order(popularity asc) [0...${limit}]{${CARD_FIELDS}}`
  );

  if (data?.length) return data.map(present);

  const popularity = new Map(
    (articlesData as unknown as ArticleType[]).flatMap((a) =>
      a.articles.filter((x) => x.popular).map((x) => [x.slug, x.popularity] as const)
    )
  );

  return fallbackCards
    .filter((c) => popularity.has(c.slug))
    .sort((a, b) => Number(popularity.get(a.slug)) - Number(popularity.get(b.slug)))
    .slice(0, limit)
    .map(present);
}
