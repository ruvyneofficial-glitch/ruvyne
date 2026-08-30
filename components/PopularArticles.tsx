import Link from "next/link";
import { getPopularArticles } from "@/app/functions/getArticleCards";

export default async function PopularArticles() {
  const popularArticles = await getPopularArticles(5);

  if (popularArticles.length === 0) return null;

  return (
    <article>
      <h2 className="uppercase font-semibold mt-16 mb-8">Most Popular</h2>
      {popularArticles.map((article, index) => (
        <article key={article.slug}>
          <div className="grid grid-cols-[0fr_1fr] gap-8">
            <p className="text-2xl font-semibold">
              {String(index + 1).padStart(2, "0")}
            </p>
            <article className="flex flex-col gap-4">
              <h3 className="text-2xl font-semibold">
                <Link href={`/magazine/${article.slug}`}>{article.title}</Link>
              </h3>
              <span className="flex gap-2">
                <p className="font-semibold">Text</p>
                <p>{article.author}</p>
              </span>
            </article>
          </div>
          {index < popularArticles.length - 1 && (
            <div role="separator" className="border border-black my-6" />
          )}
        </article>
      ))}
    </article>
  );
}
