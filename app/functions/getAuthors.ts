import articlesData from "@/json/articles.json";
import { sanityFetch } from "@/lib/sanity.client";
import type { ArticleType } from "./getArticles";

export type AuthorCard = {
  name: string;
  slug: string;
  job: string;
  city: string;
  avatar: string;
  imgAlt: string;
};

const CARD_FIELDS = /* groq */ `
  name,
  "slug": slug.current,
  job,
  city,
  "avatar": avatar.asset->url,
  imgAlt
`;

const source = articlesData as unknown as ArticleType[];

const fallbackAuthors: AuthorCard[] = source.map((a) => ({
  name: a.author,
  slug: a.slug,
  job: a.job,
  city: a.city,
  avatar: a.avatar,
  imgAlt: a.imgAlt,
}));

const localAvatarBySlug = new Map(fallbackAuthors.map((a) => [a.slug, a.avatar]));

function withAvatar(author: AuthorCard): AuthorCard {
  if (author.avatar) return author;
  console.warn(`[sanity] no portrait for ${author.slug}, using the bundled copy`);
  return { ...author, avatar: localAvatarBySlug.get(author.slug) ?? "" };
}

export async function getAuthorCards(): Promise<AuthorCard[]> {
  const data = await sanityFetch<AuthorCard[]>(
    /* groq */ `*[_type == "author"]{${CARD_FIELDS}}`
  );
  if (data?.length) return data.map(withAvatar);
  return fallbackAuthors;
}

export type AuthorProfile = AuthorCard & {
  bioSummary: string;
  bioBody: string;
};

export async function getAuthorBySlug(
  slug: string
): Promise<AuthorProfile | null> {
  const data = await sanityFetch<AuthorProfile | null>(
    /* groq */ `*[_type == "author" && slug.current == $slug][0]{${CARD_FIELDS}, bioSummary, bioBody}`,
    { slug }
  );

  const local = source.find((a) => a.slug === slug);
  const fallback: AuthorProfile | null = local
    ? {
        name: local.author,
        slug: local.slug,
        job: local.job,
        city: local.city,
        avatar: local.avatar,
        imgAlt: local.imgAlt,
        bioSummary: local.biography.summary,
        bioBody: local.biography.body,
      }
    : null;

  if (!data) return fallback;
  return { ...data, avatar: data.avatar || fallback?.avatar || "" };
}

export async function getAuthorSlugs(): Promise<string[]> {
  const data = await sanityFetch<string[]>(
    /* groq */ `*[_type == "author"].slug.current`
  );
  if (data?.length) return data;
  return fallbackAuthors.map((a) => a.slug);
}
