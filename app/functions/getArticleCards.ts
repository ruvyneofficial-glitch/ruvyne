import articlesData from "@/json/articles.json";
import { sanityFetch } from "@/lib/sanity.client";
import type { ArticleType } from "./getArticles";

export type ArticleCard = {
  title: string;
  slug: string;
  label: string;
  description: string;
  date: string;
  read: string;
  img: string;
  imgAlt: string;
  author: string;
};

export type ArticleCardPage = {
  items: ArticleCard[];
  total: number;
};

const CARD_FIELDS = /* groq */ `
  title,
  "slug": slug.current,
  label,
  description,
  date,
  read,
  "img": img.asset->url,
  imgAlt,
  "author": author->name
`;

const fallbackCards: ArticleCard[] = (articlesData as unknown as ArticleType[])
  .flatMap((a) =>
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
    }))
  )
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const localImageBySlug = new Map(fallbackCards.map((c) => [c.slug, c.img]));

function withImage(card: ArticleCard): ArticleCard {
  if (card.img) return card;
  console.warn(`[sanity] no image for ${card.slug}, using the bundled copy`);
  return { ...card, img: localImageBySlug.get(card.slug) ?? "" };
}

export async function getArticleCards({
  limit = 12,
  offset = 0,
  label,
}: { limit?: number; offset?: number; label?: string } = {}): Promise<ArticleCardPage> {
  const filter =
    label && label !== "All"
      ? `_type == "article" && label == $label`
      : `_type == "article"`;

  const query = /* groq */ `{
    "items": *[${filter}] | order(date desc) [${offset}...${offset + limit}]{${CARD_FIELDS}},
    "total": count(*[${filter}])
  }`;

  const data = await sanityFetch<ArticleCardPage>(
    query,
    label && label !== "All" ? { label } : {}
  );

  if (data?.items) {
    return { items: data.items.map(withImage), total: data.total };
  }

  const filtered =
    label && label !== "All"
      ? fallbackCards.filter((c) => c.label === label)
      : fallbackCards;

  return {
    items: filtered.slice(offset, offset + limit),
    total: filtered.length,
  };
}

export async function getArticlesByAuthor(
  authorSlug: string
): Promise<ArticleCard[]> {
  const data = await sanityFetch<ArticleCard[]>(
    /* groq */ `*[_type == "article" && author->slug.current == $authorSlug] | order(date desc){${CARD_FIELDS}}`,
    { authorSlug }
  );

  if (data?.length) return data.map(withImage);

  const author = (articlesData as unknown as ArticleType[]).find(
    (a) => a.slug === authorSlug
  );
  if (!author) return [];

  const owned = new Set(author.articles.map((x) => x.slug));
  return fallbackCards.filter((c) => owned.has(c.slug));
}

export async function getArticleCategories(): Promise<string[]> {
  const data = await sanityFetch<string[]>(
    /* groq */ `array::unique(*[_type == "article"].label)`
  );
  const labels = data?.length
    ? data
    : Array.from(new Set(fallbackCards.map((c) => c.label)));
  return ["All", ...labels.filter(Boolean).sort()];
}

export async function getPopularArticles(limit = 5): Promise<ArticleCard[]> {
  const data = await sanityFetch<ArticleCard[]>(
    /* groq */ `*[_type == "article" && popular == true] | order(popularity asc) [0...${limit}]{${CARD_FIELDS}}`
  );

  if (data?.length) return data.map(withImage);

  return (articlesData as unknown as ArticleType[])
    .flatMap((a) =>
      a.articles
        .filter((x) => x.popular)
        .map((x) => ({ ...x, author: a.author, popularity: x.popularity }))
    )
    .sort((a, b) => Number(a.popularity) - Number(b.popularity))
    .slice(0, limit)
    .map((x) => ({
      title: x.title,
      slug: x.slug,
      label: x.label,
      description: x.description,
      date: x.date,
      read: x.read,
      img: x.img,
      imgAlt: x.imgAlt,
      author: x.author,
    }));
}
