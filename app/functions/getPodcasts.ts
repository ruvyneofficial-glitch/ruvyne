import podcastsData from "@/json/podcasts.json";
import type { CoverTint } from "@/components/Cover";

export type PodcastType = {
  id: number;
  title: string;
  img: string;
  imgAlt: string;
  /** Duotone colours for the composed cover. */
  tint: CoverTint;
  date: string;
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

export async function getPodcasts(): Promise<PodcastType[]> {
  return podcastsData as PodcastType[];
}
