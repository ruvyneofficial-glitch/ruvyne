import Link from "next/link";
import Image from "next/image";
import {
  getArticleCards,
  getArticleCategories,
} from "@/app/functions/getArticleCards";

export const PAGE_SIZE = 12;

type ArticlesProps = {
  category: string;
  page: number;
};

function pageHref(category: string, page: number) {
  const params = new URLSearchParams();
  if (category && category !== "All") params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/magazine?${qs}` : "/magazine";
}

export default async function Articles({ category, page }: ArticlesProps) {
  const [categories, { items, total }] = await Promise.all([
    getArticleCategories(),
    getArticleCards({
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      label: category,
    }),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-[95rem] w-full mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-2 md:gap-0 my-6">
        <p className="font-semibold uppercase">Categories</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((label) => {
            const active = label === category;
            return (
              <Link
                key={label}
                href={pageHref(label, 1)}
                aria-current={active ? "page" : undefined}
                className={`px-3 py-2 border border-black rounded-full transition ${
                  active
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-black border-collapse">
        {items.map((article) => (
          <article className="border border-black p-8" key={article.slug}>
            <div className="flex items-center justify-between">
              <time dateTime={article.date}>{article.date}</time>
              <span className="px-3 py-2 border border-black rounded-full">
                <p className="uppercase">{article.label}</p>
              </span>
            </div>
            <Link href={`/magazine/${article.slug}`}>
              <Image
                className="w-full my-8 hover:scale-105 transition"
                src={article.img}
                alt={article.imgAlt}
                width={600}
                height={600}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </Link>
            <h2 className="heading3-title mb-3">
              <Link href={`/magazine/${article.slug}`}>{article.title}</Link>
            </h2>
            <p className="mt-3 mb-12">{article.description}</p>
            <div className="flex flex-wrap gap-4">
              <span className="flex">
                <p className="font-semibold pr-2">Text</p>
                <p>{article.author}</p>
              </span>
              <span className="flex">
                <p className="font-semibold pr-2">Duration</p>
                <p>{article.read}</p>
              </span>
            </div>
          </article>
        ))}
      </div>

      {items.length === 0 && (
        <p className="py-12">No articles in this category yet.</p>
      )}

      <nav
        className="flex flex-wrap items-center justify-between gap-4 my-12 mb-48"
        aria-label="Pagination"
      >
        <p>
          Showing {items.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
          {(page - 1) * PAGE_SIZE + items.length} of {total}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {page > 1 && (
            <Link
              href={pageHref(category, page - 1)}
              className="px-4 py-2 border border-black rounded-full bg-white text-black hover:bg-black hover:text-white transition"
              rel="prev"
            >
              Previous
            </Link>
          )}
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={pageHref(category, n)}
              aria-current={n === page ? "page" : undefined}
              className={`px-4 py-2 border border-black rounded-full transition ${
                n === page
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-black hover:text-white"
              }`}
            >
              {n}
            </Link>
          ))}
          {page < pageCount && (
            <Link
              href={pageHref(category, page + 1)}
              className="px-4 py-2 border border-black rounded-full bg-white text-black hover:bg-black hover:text-white transition"
              rel="next"
            >
              Next
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
