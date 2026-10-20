import podcastsData from "@/json/podcasts.json";
import { sanityFetch } from "@/lib/sanity.client";
import { formatDate, toIsoDate } from "@/lib/dates";
import type { CoverTint } from "@/components/Cover";

export type PodcastType = {
  id: number;
  title: string;
  img: string;
  imgAlt: string;
  tint: CoverTint;
  date: string;
  isoDate?: string;
  duration: string;
  episode: string;
  slug: string;
  content: {
    summary: string;
    section1: string;
    quote: string[];
    section2: string;
  }[];
};

type SanityPodcast = {
  title: string;
  slug: string;
  episode: string;
  order: number;
  date: string;
  duration: string;
  img: string;
  imgAlt: string;
  tintShadow: string;
  tintHighlight: string;
  summary: string;
  section1: string;
  quoteText: string;
  quoteAttribution: string;
  section2: string;
};

const QUERY = /* groq */ `
*[_type == "podcast"] | order(order desc){
  title,
  "slug": slug.current,
  episode,
  order,
  date,
  duration,
  "img": img.asset->url,
  imgAlt,
  tintShadow,
  tintHighlight,
  summary,
  section1,
  quoteText,
  quoteAttribution,
  section2
}`;

const coverBySlug = new Map(
  (podcastsData as PodcastType[]).map((p) => [p.slug, p.img])
);

function coverUrl(url: string | null | undefined, slug: string) {
  if (url) return url;
  console.warn(`[sanity] no cover for podcast ${slug}, using the bundled copy`);
  return coverBySlug.get(slug) ?? "";
}

function adapt(podcasts: SanityPodcast[]): PodcastType[] {
  return podcasts.map((p) => ({
    id: p.order,
    title: p.title,
    img: coverUrl(p.img, p.slug),
    imgAlt: p.imgAlt,
    tint: { shadow: p.tintShadow, highlight: p.tintHighlight },
    date: formatDate(p.date),
    isoDate: toIsoDate(p.date),
    duration: p.duration,
    episode: p.episode,
    slug: p.slug,
    content: [
      {
        summary: p.summary,
        section1: p.section1,
        quote: [p.quoteText, p.quoteAttribution],
        section2: p.section2,
      },
    ],
  }));
}

export async function getPodcasts(): Promise<PodcastType[]> {
  const data = await sanityFetch<SanityPodcast[]>(QUERY);

  if (data && data.length > 0) return adapt(data);

  return (podcastsData as PodcastType[]).map((p) => ({
    ...p,
    isoDate: toIsoDate(p.date),
  }));
}

export async function getPodcastSlugs(): Promise<string[]> {
  const data = await sanityFetch<string[]>(
    /* groq */ `*[_type == "podcast"].slug.current`
  );
  if (data?.length) return data;
  return (podcastsData as PodcastType[]).map((p) => p.slug);
}
