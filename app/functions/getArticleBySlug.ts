import articlesData from "@/json/articles.json";
import { sanityFetch } from "@/lib/sanity.client";
import type { ArticleType } from "./getArticles";

export type ArticleDetail = {
  title: string;
  slug: string;
  label: string;
  description: string;
  date: string;
  read: string;
  imgAlt: string;
  mainImg: string;
  summary: string;
  section1: string;
  quote: [string, string];
  summary2: string;
  section2: string;
  author: {
    name: string;
    slug: string;
    avatar: string;
    imgAlt: string;
  };
};

const QUERY = /* groq */ `
*[_type == "article" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  label,
  description,
  date,
  read,
  imgAlt,
  "mainImg": mainImg.asset->url,
  summary,
  section1,
  quoteText,
  quoteAttribution,
  summary2,
  section2,
  "author": author->{
    "name": name,
    "slug": slug.current,
    "avatar": avatar.asset->url,
    imgAlt
  }
}`;

const source = articlesData as unknown as ArticleType[];

function fromLocal(slug: string): ArticleDetail | null {
  for (const a of source) {
    const x = a.articles.find((art) => art.slug === slug);
    if (!x) continue;
    const [c0, c1, c2, c3, c4] = x.content;
    return {
      title: x.title,
      slug: x.slug,
      label: x.label,
      description: x.description,
      date: x.date,
      read: x.read,
      imgAlt: x.imgAlt,
      mainImg: c0?.img ?? x.img,
      summary: c0?.summary ?? "",
      section1: c1?.section1 ?? "",
      quote: [c2?.quote?.[0] ?? "", c2?.quote?.[1] ?? ""],
      summary2: c3?.summary2 ?? "",
      section2: c4?.section2 ?? "",
      author: {
        name: a.author,
        slug: a.slug,
        avatar: a.avatar,
        imgAlt: a.imgAlt,
      },
    };
  }
  return null;
}

export async function getArticleBySlug(
  slug: string
): Promise<ArticleDetail | null> {
  type Raw = Omit<ArticleDetail, "quote"> & {
    quoteText: string;
    quoteAttribution: string;
  };

  const data = await sanityFetch<Raw | null>(QUERY, { slug });
  const local = fromLocal(slug);

  if (!data) return local;

  return {
    ...data,
    mainImg: data.mainImg || local?.mainImg || "",
    quote: [data.quoteText, data.quoteAttribution],
    author: {
      ...data.author,
      avatar: data.author?.avatar || local?.author.avatar || "",
    },
  };
}

export async function getArticleSlugs(): Promise<string[]> {
  const data = await sanityFetch<string[]>(
    /* groq */ `*[_type == "article"].slug.current`
  );
  if (data?.length) return data;
  return source.flatMap((a) => a.articles.map((x) => x.slug));
}
