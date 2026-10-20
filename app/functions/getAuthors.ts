import articlesData from "@/json/articles.json";
import { sanityFetch } from "@/lib/sanity.client";
import { imageFocus, imageUrl, type SanityImage } from "@/lib/image";
import { toSeo, type RawSeo, type Seo } from "@/lib/seo";
import { validSocial, type SocialLink } from "@/lib/site";
import type { ArticleType } from "./getArticles";

export type AuthorCard = {
  name: string;
  slug: string;
  job: string;
  city: string;
  avatar: string;
  avatarFocus?: string;
  imgAlt: string;
};

type RawAuthor = Omit<AuthorCard, "avatar" | "avatarFocus"> & { avatar: SanityImage };

const CARD_FIELDS = /* groq */ `
  name,
  "slug": slug.current,
  job,
  city,
  avatar,
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

function present(author: RawAuthor): AuthorCard {
  let avatar = imageUrl(author.avatar, 600);
  if (!avatar) {
    console.warn(`[sanity] no portrait for ${author.slug}, using the bundled copy`);
    avatar = localAvatarBySlug.get(author.slug) ?? "";
  }
  return { ...author, avatar, avatarFocus: imageFocus(author.avatar) };
}

export async function getAuthorCards(): Promise<AuthorCard[]> {
  const data = await sanityFetch<RawAuthor[]>(
    /* groq */ `*[_type == "author"] | order(name asc){${CARD_FIELDS}}`
  );
  if (data?.length) return data.map(present);
  return fallbackAuthors;
}

// The team order from Site settings > Homepage. `teamOnly` leaves out anyone
// not in it (the homepage section); otherwise they follow, A to Z.
export function orderByTeam(authors: AuthorCard[], team: string[], teamOnly: boolean) {
  if (!team.length) return authors;
  const picked = team
    .map((slug) => authors.find((a) => a.slug === slug))
    .filter((a): a is AuthorCard => Boolean(a));
  return teamOnly ? picked : [...picked, ...authors.filter((a) => !team.includes(a.slug))];
}

export type AuthorProfile = AuthorCard & {
  bioSummary: string;
  bioBody: string;
  social: SocialLink[];
  seo: Seo;
};

type RawProfile = RawAuthor & {
  bioSummary: string;
  bioBody: string;
  social?: Array<{ platform?: string; url?: string }> | null;
  seo?: RawSeo;
};

export async function getAuthorBySlug(slug: string): Promise<AuthorProfile | null> {
  const data = await sanityFetch<RawProfile | null>(
    /* groq */ `*[_type == "author" && slug.current == $slug][0]{${CARD_FIELDS}, bioSummary, bioBody, social[]{platform, url}, seo}`,
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
        social: [],
        seo: toSeo(null, {
          title: local.author,
          description: local.biography.summary,
          image: local.avatar,
        }),
      }
    : null;

  if (!data) return fallback;

  const card = present(data);
  return {
    ...card,
    bioSummary: data.bioSummary,
    bioBody: data.bioBody,
    social: validSocial(data.social),
    seo: toSeo(data.seo, { title: data.name, description: data.bioSummary, image: card.avatar }),
  };
}

// The sitemap leaves out authors marked "Hide from Google".
export async function getAuthorSlugs(onlyIndexable = false): Promise<string[]> {
  const filter = onlyIndexable ? ` && seo.noindex != true` : "";
  const data = await sanityFetch<string[]>(
    /* groq */ `*[_type == "author"${filter}].slug.current`
  );
  if (data?.length) return data;
  return fallbackAuthors.map((a) => a.slug);
}
