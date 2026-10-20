import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pageTitle } from "@/lib/site";
import { searchArticles } from "@/app/functions/getArticleCards";
import { getSiteSettings } from "@/app/functions/getSiteSettings";

export const metadata = {
  title: pageTitle("Search"),
  robots: { index: false },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim().slice(0, 100);
  const [results, settings] = await Promise.all([
    q ? searchArticles(q) : [],
    getSiteSettings(),
  ]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[95rem] flex-col px-4 md:px-8">
      <PageTitle>Search</PageTitle>
      <form action="/search" role="search" className="mx-auto flex w-full max-w-2xl gap-3">
        <label htmlFor="search-page-input" className="sr-only">
          Search stories
        </label>
        <Input
          id="search-page-input"
          name="q"
          type="search"
          defaultValue={q}
          placeholder={settings.words.searchPlaceholder}
          className="h-12 text-base"
        />
        <Button type="submit" className="h-12">
          Search
        </Button>
      </form>

      {q && (
        <p className="mt-8 text-center text-muted-foreground" role="status">
          {results.length} {results.length === 1 ? "story" : "stories"} for &ldquo;{q}&rdquo;
        </p>
      )}

      {results.length > 0 && (
        <>
          <h2 className="sr-only">Results</h2>
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </>
      )}

      {q && results.length === 0 && (
        <p className="mt-4 text-center">
          {settings.words.noSearchResults}{" "}
          <Link href="/magazine" className="underline underline-offset-4">
            Browse the magazine
          </Link>
        </p>
      )}
    </main>
  );
}
