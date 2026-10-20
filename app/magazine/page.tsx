import Image from "next/image";
import Articles from "@/components/Articles/Articles";
import Loading from "@/components/Articles/loading";
import PageTitle from "@/components/PageTitle";
import { Suspense } from "react";
import { pageTitle } from "@/lib/site";
import { ARTICLE_SORTS, type ArticleSort } from "@/app/functions/getArticleCards";
import { findCategory, getCategories } from "@/app/functions/getCategories";
import { getSiteSettings } from "@/app/functions/getSiteSettings";

type MagazinePageProps = {
  searchParams: { category?: string; page?: string; sort?: string };
};

export async function generateMetadata({ searchParams }: MagazinePageProps) {
  const category = searchParams.category
    ? findCategory(await getCategories(), searchParams.category)
    : undefined;

  return {
    title: pageTitle(category?.title ?? "Articles"),
    description:
      category?.intro ||
      "Beauty, fashion and home decor stories from our team of writers and editors",
  };
}

export default async function MagazinePage({ searchParams }: MagazinePageProps) {
  const [settings, categories] = await Promise.all([getSiteSettings(), getCategories()]);
  // Older links name the category ("Home Decor"); newer ones use its web address.
  const selected = searchParams.category
    ? findCategory(categories, searchParams.category)
    : undefined;
  const category = selected?.slug ?? searchParams.category ?? "All";
  const parsed = Number(searchParams.page);
  const page = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
  const sort: ArticleSort =
    searchParams.sort && Object.hasOwn(ARTICLE_SORTS, searchParams.sort)
      ? (searchParams.sort as ArticleSort)
      : "newest";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[95rem] flex-col px-4 md:px-8">
      <PageTitle intro={selected?.intro || settings.words.magazineIntro}>
        {selected?.title ?? "Magazine"}
      </PageTitle>
      {selected?.cover && (
        <Image
          src={selected.cover}
          alt={selected.coverAlt}
          width={1520}
          height={570}
          sizes="(max-width: 1520px) 100vw, 1520px"
          priority
          style={{ objectPosition: selected.coverFocus }}
          className="mb-10 aspect-[8/3] w-full object-cover md:mb-14"
        />
      )}
      <Suspense key={`${category}-${page}-${sort}`} fallback={<Loading />}>
        <Articles
          category={category}
          categories={categories}
          page={page}
          sort={sort}
          emptyText={settings.words.noStoriesInCategory}
        />
      </Suspense>
    </main>
  );
}
