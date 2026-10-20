import Link from "next/link";
import { getPodcasts } from "@/app/functions/getPodcasts";
import Cover from "@/components/Cover";

export default async function LatestPodcasts() {
  const data = await getPodcasts();

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
      {data.slice(0, 3).map((podcast) => (
        <article className="group" key={podcast.id}>
          <Link href={`/podcasts/${podcast.slug}`} tabIndex={-1} aria-hidden="true" className="block overflow-hidden">
            <Cover
              className="aspect-square w-full transition-transform duration-500 group-hover:scale-[1.03]"
              src={podcast.img}
              photoAlt={podcast.imgAlt}
              kicker="Podcast"
              cornerLabel={`EP ${podcast.episode.slice(7).trim()}`}
              tint={podcast.tint}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </Link>
          <p className="kicker mt-4 text-accent">{podcast.episode}</p>
          <h3 className="heading3-title mt-2">
            <Link href={`/podcasts/${podcast.slug}`} className="underline-offset-4 hover:underline">
              {podcast.title}
            </Link>
          </h3>
          <p className="kicker mt-3 text-muted-foreground">
            <time dateTime={podcast.isoDate || undefined}>{podcast.date}</time> &middot; {podcast.duration}
          </p>
        </article>
      ))}
    </div>
  );
}
