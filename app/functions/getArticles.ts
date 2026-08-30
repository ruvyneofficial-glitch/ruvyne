import articlesData from "@/json/articles.json";
import { sanityFetch } from "@/lib/sanity.client";

export type ArticleType = {
  id: number;
  author: string;
  job: string;
  city: string;
  avatar: string;
  imgAlt: string;
  slug: string;
  biography: {
    summary: string;
    body: string;
  };
  articles: Array<{
    title: string;
    popular: boolean;
    popularity: number;
    description: string;
    date: string;
    read: string;
    label: string;
    img: string;
    imgAlt: string;
    slug: string;
    content: Array<{
      img: string;
      summary: string;
      section1: string;
      quote: Array<string>;
      summary2: string;
      section2: string;
    }>;
  }>;
};

type SanityAuthor = {
  _id: string;
  name: string;
  job: string;
  city: string;
  avatar: string;
  imgAlt: string;
  slug: string;
  bioSummary: string;
  bioBody: string;
  articles: Array<{
    title: string;
    slug: string;
    label: string;
    description: string;
    date: string;
    read: string;
    popular: boolean;
    popularity: number;
    img: string;
    imgAlt: string;
    mainImg: string;
    summary: string;
    section1: string;
    quoteText: string;
    quoteAttribution: string;
    summary2: string;
    section2: string;
  }>;
};

const QUERY = /* groq */ `
*[_type == "author"]{
  _id,
  name,
  job,
  city,
  "avatar": avatar.asset->url,
  imgAlt,
  "slug": slug.current,
  bioSummary,
  bioBody,
  "articles": *[_type == "article" && author._ref == ^._id]{
    title,
    "slug": slug.current,
    label,
    description,
    date,
    read,
    popular,
    popularity,
    "img": img.asset->url,
    imgAlt,
    "mainImg": mainImg.asset->url,
    summary,
    section1,
    quoteText,
    quoteAttribution,
    summary2,
    section2
  }
}`;

function adapt(authors: SanityAuthor[]): ArticleType[] {
  return authors.map((a, index) => ({
    id: index + 1,
    author: a.name,
    job: a.job,
    city: a.city,
    avatar: fallbackImage(
      a.avatar,
      authorAvatarBySlug.get(a.slug),
      `author ${a.slug}`
    ),
    imgAlt: a.imgAlt,
    slug: a.slug,
    biography: { summary: a.bioSummary, body: a.bioBody },
    articles: (a.articles ?? []).map((art) => ({
      title: art.title,
      popular: Boolean(art.popular),
      popularity: Number(art.popularity ?? 0),
      description: art.description,
      date: art.date,
      read: art.read,
      label: art.label,
      img: fallbackImage(
        art.img,
        articleImgBySlug.get(art.slug),
        `article ${art.slug} preview`
      ),
      imgAlt: art.imgAlt,
      slug: art.slug,
      content: [
        {
          img: fallbackImage(
            art.mainImg,
            articleMainImgBySlug.get(art.slug),
            `article ${art.slug} header`
          ),
          summary: art.summary,
        },
        { section1: art.section1 },
        { quote: [art.quoteText, art.quoteAttribution] },
        { summary2: art.summary2 },
        { section2: art.section2 },
      ] as unknown as ArticleType["articles"][number]["content"],
    })),
  }));
}

const source = articlesData as unknown as ArticleType[];
const authorOrder = source.map((a) => a.slug);
const articleOrder = source.flatMap((a) => a.articles.map((x) => x.slug));

const rank = (list: string[], slug: string) => {
  const i = list.indexOf(slug);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
};

function fallbackImage(
  url: string | null | undefined,
  local: string | undefined,
  what: string
) {
  if (url) return url;
  console.warn(`[sanity] no image for ${what}, using the bundled copy`);
  return local ?? "";
}

const authorAvatarBySlug = new Map(source.map((a) => [a.slug, a.avatar]));
const articleImgBySlug = new Map(
  source.flatMap((a) => a.articles.map((x) => [x.slug, x.img] as const))
);
const articleMainImgBySlug = new Map(
  source.flatMap((a) =>
    a.articles.map((x) => [x.slug, x.content?.[0]?.img ?? x.img] as const)
  )
);

function sortToMatchSource(authors: ArticleType[]): ArticleType[] {
  return [...authors]
    .sort((a, b) => rank(authorOrder, a.slug) - rank(authorOrder, b.slug))
    .map((a, i) => ({
      ...a,
      id: i + 1,
      articles: [...a.articles].sort(
        (x, y) => rank(articleOrder, x.slug) - rank(articleOrder, y.slug)
      ),
    }));
}

export async function getArticles(): Promise<ArticleType[]> {
  const data = await sanityFetch<SanityAuthor[]>(QUERY);

  if (data && data.length > 0) {
    return sortToMatchSource(adapt(data));
  }

  return articlesData as unknown as ArticleType[];
}
