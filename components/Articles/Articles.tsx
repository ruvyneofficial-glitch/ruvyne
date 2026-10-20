import Link from "next/link";
import ArticleCard from "../ArticleCard";
import {
  ARTICLE_SORTS,
  getArticleCards,
  type ArticleSort,
} from "@/app/functions/getArticleCards";
import type { Category } from "@/app/functions/getCategories";
import { cn } from "@/lib/utils";

export const PAGE_SIZE = 12;

type ArticlesProps = {
  // A category's web address, or "All".
  category: string;
  categories: Category[];
  page: number;
  sort: ArticleSort;
  emptyText: string;
};

function pageHref(category: string, page: number, sort: ArticleSort) {
  const params = new URLSearchParams();
  if (category && category !== "All") params.set("category", category);
  if (sort !== "newest") params.set("sort", sort);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/magazine?${qs}` : "/magazine";
}

const tab = (active: boolean) =>
  cn(
    "kicker border-b-2 py-2 transition-colors",
    active
      ? "border-foreground text-foreground"
      : "border-transparent text-muted-foreground hover:text-foreground"
  );

export default async function Articles({ category, categories, page, sort, emptyText }: ArticlesProps) {
  const { items, total } = await getArticleCards({
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    category,
    sort,
  });
  const tabs = [{ slug: "All", title: "All" }, ...categories];

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 border-b border-border pb-2 md:flex-row md:items-end md:justify-between">
        <nav aria-label="Categories" className="flex flex-wrap gap-x-6 gap-y-1">
          {tabs.map(({ slug, title }) => {
            const active = slug === category;
            return (
              <Link
                key={slug}
                href={pageHref(slug, 1, sort)}
                aria-current={active ? "page" : undefined}
                className={tab(active)}
              >
                {title}
              </Link>
            );
          })}
        </nav>
        <nav aria-label="Sort stories" className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="kicker text-muted-foreground">Sort</span>
          {(Object.keys(ARTICLE_SORTS) as ArticleSort[]).map((key) => (
            <Link
              key={key}
              href={pageHref(category, 1, key)}
              aria-current={key === sort ? "true" : undefined}
              className={tab(key === sort)}
            >
              {ARTICLE_SORTS[key]}
            </Link>
          ))}
        </nav>
      </div>

      <h2 className="sr-only">Stories</h2>
      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      {items.length === 0 && (
        <p className="py-12">{emptyText}</p>
      )}

      <nav
        className="mb-12 mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8"
        aria-label="Pagination"
      >
        <p className="text-muted-foreground">
          Showing {items.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
          {(page - 1) * PAGE_SIZE + items.length} of {total}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {page > 1 && (
            <Link href={pageHref(category, page - 1, sort)} className="kicker px-3 py-2 hover:text-accent" rel="prev">
              Previous
            </Link>
          )}
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={pageHref(category, n, sort)}
              aria-current={n === page ? "page" : undefined}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border transition-colors",
                n === page
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-foreground"
              )}
            >
              {n}
            </Link>
          ))}
          {page < pageCount && (
            <Link href={pageHref(category, page + 1, sort)} className="kicker px-3 py-2 hover:text-accent" rel="next">
              Next
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
