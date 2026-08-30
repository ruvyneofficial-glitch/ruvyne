import Link from "next/link";
import { getPodcasts } from "@/app/functions/getPodcasts";
import Cover from "@/components/Cover";

export default async function LatestPodcasts() {
  const data = await getPodcasts();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3  xl:grid-cols-3 max-w-[95rem] w-full mx-auto border border-black border-collapse">
      {data
        .map((podcast) => (
          <article className="border border-black p-4 md:p-12" key={podcast.id}>
            <Link href={`/podcasts/${podcast.slug}`}>
              <Cover
                className="w-full aspect-square hover:scale-105 transition"
                src={podcast.img}
                photoAlt={podcast.imgAlt}
                kicker="Podcast"
                cornerLabel={`EP ${podcast.episode.slice(7).trim()}`}
                tint={podcast.tint}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </Link>
            <h2 className="heading3-title mt-8 mb-12">
              <Link href={`/podcasts/${podcast.slug}`}>{podcast.title}</Link>
            </h2>
            <div className="flex flex-wrap gap-4">
              <span className="flex">
                <p className="font-semibold pr-2">Date</p>
                <time dateTime={podcast.date}>{podcast.date}</time>
              </span>
              <span className="flex">
                <p className="font-semibold pr-2">Duration</p>
                <p>{podcast.duration}</p>
              </span>
            </div>
          </article>
        ))
        .slice(0, 3)}
    </div>
  );
}
