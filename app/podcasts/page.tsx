import { notFound } from "next/navigation";

// Podcasts are switched off: this route returns 404. To bring it back, delete
// this stub and uncomment the original page below.
// Rendered per request: a 404 raised at build time is served with status 200.
export const dynamic = "force-dynamic";

export default function PodcastsPage() {
  notFound();
}

// import PageTitle from "@/components/PageTitle";
// import Loading from "@/components/PodcastsList/loading";
// import PodcastsList from "@/components/PodcastsList/PodcastsList";
// import { Suspense } from "react";
// import { pageTitle } from "@/lib/site";
//
// export const metadata = {
//   title: pageTitle("Podcasts"),
//   description: "The latest podcasts list",
// };
//
// export default function PodcastsPage() {
//   return (
//     <main className="mx-auto flex min-h-screen w-full max-w-[95rem] flex-col px-4 md:px-8">
//       <PageTitle intro="Conversations on beauty, fashion and the rooms we live in.">
//         Podcast
//       </PageTitle>
//       <Suspense fallback={<Loading />}>
//         <PodcastsList />
//       </Suspense>
//     </main>
//   );
// }
