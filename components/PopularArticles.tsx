import Link from "next/link";
import { getPopularArticles } from "@/app/functions/getArticleCards";

export default async function PopularArticles({
  picked,
  heading,
}: {
  picked: string[];
  heading: string;
}) {
  const popularArticles = await getPopularArticles(picked);

  if (popularArticles.length === 0) return null;

  return (
    <section aria-labelledby="popular-title">
      <h2 id="popular-title" className="kicker border-b border-foreground pb-3">
        {heading}
      </h2>
      <ol className="divide-y divide-border">
        {popularArticles.map((article, index) => (
          <li key={article.slug} className="grid grid-cols-[2.5rem_1fr] gap-3 py-5">
            <span aria-hidden="true" className="font-display text-4xl leading-none text-accent">
              {index + 1}
            </span>
            <div>
              <h3 className="font-medium leading-snug">
                <Link href={`/magazine/${article.slug}`} className="underline-offset-4 hover:underline">
                  {article.title}
                </Link>
              </h3>
              <p className="kicker mt-2 text-muted-foreground">By {article.author}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
