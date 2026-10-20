import articlesData from "@/json/articles.json";
import { sanityFetch } from "@/lib/sanity.client";
import { formatDate, toIsoDate } from "@/lib/dates";
import { imageFocus, imageUrl, type SanityImage } from "@/lib/image";
import { legacyToBlocks, type LegacyArticle, type RichTextBlock } from "@/lib/legacyBody";
import { toSeo, type RawSeo, type Seo } from "@/lib/seo";
import { slugify } from "@/lib/site";
import type { ArticleType } from "./getArticles";

export type ArticleDetail = {
  title: string;
  slug: string;
  label: string;
  categorySlug: string;
  description: string;
  date: string;
  isoDate: string;
  read: string;
  imgAlt: string;
  mainImg: string;
  body: RichTextBlock[];
  seo: Seo;
  author: {
    name: string;
    slug: string;
    avatar: string;
    avatarFocus?: string;
    imgAlt: string;
  };
};

type Raw = LegacyArticle & {
  title: string;
  slug: string;
  label: string;
  categorySlug?: string | null;
  description: string;
  date: string;
  read: string;
  imgAlt: string;
  mainImg: SanityImage;
  body?: RichTextBlock[] | null;
  seo?: RawSeo;
  author?: { name: string; slug: string; avatar: SanityImage; imgAlt: string } | null;
};

// The five legacy fields are read too, for articles the rich-text migration
// has not converted yet.
const QUERY = /* groq */ `
*[_type == "article" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  "label": coalesce(category->title, label),
  "categorySlug": category->slug.current,
  description,
  date,
  read,
  imgAlt,
  mainImg,
  body,
  summary,
  section1,
  quoteText,
  quoteAttribution,
  summary2,
  section2,
  seo,
  "author": author->{
    name,
    "slug": slug.current,
    avatar,
    imgAlt
  }
}`;

const source = articlesData as unknown as ArticleType[];

function fromLocal(slug: string): ArticleDetail | null {
  for (const a of source) {
    const x = a.articles.find((art) => art.slug === slug);
    if (!x) continue;
    const [c0, c1, c2, c3, c4] = x.content;
    const mainImg = c0?.img ?? x.img;
    return {
      title: x.title,
      slug: x.slug,
      label: x.label,
      categorySlug: slugify(x.label),
      description: x.description,
      date: formatDate(x.date),
      isoDate: toIsoDate(x.date),
      read: x.read,
      imgAlt: x.imgAlt,
      mainImg,
      body: legacyToBlocks({
        summary: c0?.summary,
        section1: c1?.section1,
        quoteText: c2?.quote?.[0],
        quoteAttribution: c2?.quote?.[1],
        summary2: c3?.summary2,
        section2: c4?.section2,
      }),
      seo: toSeo(null, { title: x.title, description: x.description, image: mainImg }),
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

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const data = await sanityFetch<Raw | null>(QUERY, { slug });
  const local = fromLocal(slug);

  if (!data) return local;

  const mainImg = imageUrl(data.mainImg) || local?.mainImg || "";

  return {
    title: data.title,
    slug: data.slug,
    label: data.label ?? "",
    categorySlug: data.categorySlug || slugify(data.label ?? ""),
    description: data.description,
    date: formatDate(data.date),
    isoDate: toIsoDate(data.date),
    read: data.read,
    imgAlt: data.imgAlt,
    mainImg,
    body: data.body?.length ? data.body : legacyToBlocks(data),
    seo: toSeo(data.seo, { title: data.title, description: data.description, image: mainImg }),
    author: {
      name: data.author?.name ?? "",
      slug: data.author?.slug ?? "",
      avatar: imageUrl(data.author?.avatar, 400) || local?.author.avatar || "",
      avatarFocus: imageFocus(data.author?.avatar),
      imgAlt: data.author?.imgAlt ?? "",
    },
  };
}

// The sitemap leaves out stories marked "Hide from Google"; static
// generation still builds them.
export async function getArticleSlugs(onlyIndexable = false): Promise<string[]> {
  const filter = onlyIndexable ? ` && seo.noindex != true` : "";
  const data = await sanityFetch<string[]>(
    /* groq */ `*[_type == "article"${filter}].slug.current`
  );
  if (data?.length) return data;
  return source.flatMap((a) => a.articles.map((x) => x.slug));
}
