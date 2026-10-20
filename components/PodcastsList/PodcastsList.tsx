import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPodcasts } from "@/app/functions/getPodcasts";
import Cover from "@/components/Cover";

export default async function PodcastsList() {
  const data = await getPodcasts();

  return (
    <ul className="mx-auto w-full divide-y divide-border pb-12 md:pb-24">
      {data.map((podcast) => (
        <li
          key={podcast.id}
          className="grid grid-cols-1 gap-5 py-8 first:pt-0 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-12"
        >
          <Cover
            className="h-40 w-40 md:h-48 md:w-48"
            src={podcast.img}
            photoAlt={podcast.imgAlt}
            kicker="Podcast"
            cornerLabel={`EP ${podcast.episode.slice(7).trim()}`}
            tint={podcast.tint}
            sizes="192px"
          />
          <div>
            <p className="kicker text-accent">{podcast.episode}</p>
            <h2 className="mt-2 font-display text-3xl leading-tight md:text-4xl">
              <Link href={`/podcasts/${podcast.slug}`} className="underline-offset-4 hover:underline">
                {podcast.title}
              </Link>
            </h2>
            <p className="kicker mt-3 text-muted-foreground">
              <time dateTime={podcast.isoDate || undefined}>{podcast.date}</time> &middot; {podcast.duration}
            </p>
          </div>
          <Link
            className="kicker inline-flex items-center gap-2 transition-colors hover:text-accent"
            href={`/podcasts/${podcast.slug}`}
            aria-label={`Listen to ${podcast.title}`}
          >
            Listen
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
