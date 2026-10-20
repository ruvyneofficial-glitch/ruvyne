import { notFound } from "next/navigation";

// Podcasts are switched off: this route returns 404. To bring it back, delete
// this stub and uncomment the original page below.
export default function PodcastDetails() {
  notFound();
}

// import { notFound } from "next/navigation";
// import { PodcastType, getPodcasts } from "@/app/functions/getPodcasts";
// import LatestPodcasts from "@/components/LatestPodcasts/LatestPodcasts";
// import PostNavigation from "@/components/PostNavigation";
// import SectionTitle from "@/components/SectionTitle";
// import SocialSharing from "@/components/SocialSharing";
// import Cover from "@/components/Cover";
// import { pageTitle } from "@/lib/site";
//
// export async function generateMetadata({
//   params,
// }: {
//   params: { title: string };
// }) {
//   const podcast: PodcastType[] = await getPodcasts();
//
//   const podcastData = podcast.find(
//     (podcast: PodcastType) => podcast.slug === params.title
//   );
//
//   if (!podcastData) return { title: pageTitle("Episode not found") };
//
//   return {
//     title: pageTitle(podcastData.title),
//   };
// }
//
// export default async function PodcastDetails({
//   params,
// }: {
//   params: { title: string };
// }) {
//   const podcast: PodcastType[] = await getPodcasts();
//
//   const podcastData = podcast.find(
//     (podcast: PodcastType) => podcast.slug === params.title
//   );
//
//   // Outside the try: notFound() works by throwing.
//   if (!podcastData) notFound();
//
//   try {
//     return (
//       <main className="mx-auto w-full max-w-[95rem] px-4 pb-12 md:px-8">
//         <PostNavigation href="/podcasts">Podcast</PostNavigation>
//         <article className="mx-auto flex w-full max-w-[75rem] flex-col gap-12 lg:flex-row lg:gap-24">
//           <article className="flex flex-col lg:w-1/4">
//             <Cover
//               className="w-full aspect-square"
//               src={podcastData.img}
//               photoAlt={podcastData.imgAlt}
//               kicker="Podcast"
//               cornerLabel={`EP ${podcastData.episode.slice(7).trim()}`}
//               tint={podcastData.tint}
//               sizes="(max-width: 1024px) 100vw, 25vw"
//             />
//             <div className="mt-8 flex items-center justify-between border-b border-border pb-8">
//               <p className="kicker">Listen on</p>
//               <SocialSharing
//                 links={[
//                   {
//                     href: "#",
//                     ariaLabel: "Visit our Spotify page",
//                     src: "/icons/ri_spotify-fill.svg",
//                     alt: "Instagram logo",
//                   },
//                   {
//                     href: "#",
//                     ariaLabel: "Visit our Apple page",
//                     src: "/icons/ri_apple-fill.svg",
//                     alt: "Twitter logo",
//                   },
//                   {
//                     href: "#",
//                     ariaLabel: "Visit our Soundcloud page",
//                     src: "/icons/ri_soundcloud-line.svg",
//                     alt: "YouTube logo",
//                   },
//                 ]}
//               />
//             </div>
//             <div className="flex flex-col gap-4 pt-8">
//               <div className="flex flex-wrap justify-between">
//                 <p className="kicker">Date</p>
//                 <time dateTime={podcastData.isoDate || undefined}>{podcastData.date}</time>
//               </div>
//               <div className="flex flex-wrap justify-between">
//                 <p className="kicker">Duration</p>
//                 <p>{podcastData.duration}</p>
//               </div>
//               <div className="flex flex-wrap justify-between">
//                 <p className="kicker">Share</p>
//                 <SocialSharing
//                   links={[
//                     {
//                       href: "#",
//                       ariaLabel: "Visit our Instagram page",
//                       src: "/icons/ri_instagram-line.svg",
//                       alt: "Instagram logo",
//                     },
//                     {
//                       href: "#",
//                       ariaLabel: "Visit our Twitter page",
//                       src: "/icons/ri_twitter-fill.svg",
//                       alt: "Twitter logo",
//                     },
//                     {
//                       href: "#",
//                       ariaLabel: "Visit our YouTube page",
//                       src: "/icons/ri_youtube-fill.svg",
//                       alt: "YouTube logo",
//                     },
//                   ]}
//                 />
//               </div>
//             </div>
//           </article>
//
//           <article className="flex flex-col flex-1 w-full">
//             <p className="kicker text-accent">{podcastData.episode}</p>
//             <h1 className="podcast-title mt-3">{podcastData.title}</h1>
//             {podcastData.content.map((podcastItem, index) => (
//               <div key={index}>
//                 <p className="text-blog-summary pb-10 pt-8">
//                   {podcastItem.summary}
//                 </p>
//                 <p className="whitespace-pre-line leading-relaxed">{podcastItem.section1}</p>
//                 <figure className="my-10 border-y border-foreground py-10">
//                   <blockquote className="text-blog-quote">
//                     &ldquo;{podcastItem.quote[0]}&rdquo;
//                   </blockquote>
//                   <figcaption className="kicker mt-6 text-muted-foreground">
//                     {podcastItem.quote[1]}
//                   </figcaption>
//                 </figure>
//                 <p className="whitespace-pre-line leading-relaxed">{podcastItem.section2}</p>
//               </div>
//             ))}
//           </article>
//         </article>
//         <section aria-labelledby="latest-episodes" className="pb-12">
//           <SectionTitle id="latest-episodes" href="/podcasts" linkText="All episodes">
//             Latest episodes
//           </SectionTitle>
//           <LatestPodcasts />
//         </section>
//       </main>
//     );
//   } catch (error) {
//     console.error("Error in PodcastDetails component:", error);
//     return <div>Error loading podcast details</div>;
//   }
// }
