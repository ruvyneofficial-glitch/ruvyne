import Articles from "@/components/Articles/Articles";
import Loading from "@/components/Articles/loading";
import PageTitle from "@/components/PageTitle";
import { Suspense } from "react";
import { pageTitle } from "@/lib/site";

export const metadata = {
  title: pageTitle("Articles"),
  description:
    "Beauty, fashion and home decor stories from our team of writers and editors",
};

type MagazinePageProps = {
  searchParams: { category?: string; page?: string };
};

export default function MagazinePage({ searchParams }: MagazinePageProps) {
  const category = searchParams.category ?? "All";
  const parsed = Number(searchParams.page);
  const page = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;

  return (
    <main className="flex flex-col min-h-screen max-w-[95rem] w-full mx-auto px-4 lg:pt-0 sm:pt-4 xs:pt-2 lg:pb-4 md:pb-4 sm:pb-2 xs:pb-2">
      <PageTitle
        className="sr-only"
        imgSrc="/images/titles/Magazine.svg"
        imgAlt="The word 'Magazine' in bold, uppercase lettering"
      >
        Magazine
      </PageTitle>
      <Suspense key={`${category}-${page}`} fallback={<Loading />}>
        <Articles category={category} page={page} />
      </Suspense>
    </main>
  );
}
