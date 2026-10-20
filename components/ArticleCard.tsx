import Image from "next/image";
import Link from "next/link";
import type { ArticleCard as Card } from "@/app/functions/getArticleCards";
import { categoryHref } from "@/lib/site";
import { cn } from "@/lib/utils";

type ArticleCardProps = {
  article: Card;
  // stack: image above text. row: small image beside text. feature: stack with a display headline.
  variant?: "stack" | "row" | "feature";
  showDescription?: boolean;
  sizes?: string;
  priority?: boolean;
};

export default function ArticleCard({
  article,
  variant = "stack",
  showDescription = true,
  sizes,
  priority,
}: ArticleCardProps) {
  const href = `/magazine/${article.slug}`;
  const row = variant === "row";

  return (
    <article
      className={cn(
        "group",
        row ? "grid grid-cols-[7rem_1fr] gap-4 sm:grid-cols-[12rem_1fr] sm:gap-6" : "flex flex-col"
      )}
    >
      {/* The headline link below carries the name, so this one is skipped by keyboard and screen readers. */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block overflow-hidden bg-muted">
        <Image
          src={article.img}
          alt={article.imgAlt}
          width={800}
          height={row ? 800 : 600}
          sizes={sizes ?? (row ? "(max-width: 640px) 112px, 192px" : "(max-width: 768px) 100vw, 33vw")}
          priority={priority}
          style={{ objectPosition: article.imgFocus }}
          className={cn(
            "w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]",
            row ? "aspect-square" : "aspect-[4/3]"
          )}
        />
      </Link>
      <div className={cn(!row && "mt-4")}>
        <p className="kicker flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
          <Link href={categoryHref(article.categorySlug)} className="text-accent underline-offset-4 hover:underline">
            {article.label}
          </Link>
          <span aria-hidden="true" className="h-1 w-1 bg-current opacity-50" />
          <time dateTime={article.isoDate || undefined}>{article.date}</time>
        </p>
        <h3
          className={cn(
            "mt-2",
            variant === "feature"
              ? "font-display text-[2rem] leading-[1.1] md:text-[2.5rem]"
              : "heading3-title"
          )}
        >
          <Link href={href} className="decoration-1 underline-offset-4 hover:underline">
            {article.title}
          </Link>
        </h3>
        {showDescription && article.description && (
          <p className="mt-2 line-clamp-3 text-muted-foreground">{article.description}</p>
        )}
        <p className="kicker mt-3">By {article.author}</p>
      </div>
    </article>
  );
}
