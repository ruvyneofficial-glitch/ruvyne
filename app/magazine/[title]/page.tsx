import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import PostNavigation from "@/components/PostNavigation";
import RichText from "@/components/RichText";
import SectionTitle from "@/components/SectionTitle";
import ShareLinks from "@/components/ShareLinks";
import { categoryHref, pageTitle } from "@/lib/site";
import { seoMetadata } from "@/lib/seo";
import {
  getArticleBySlug,
  getArticleSlugs,
} from "@/app/functions/getArticleBySlug";
import { getArticleCards } from "@/app/functions/getArticleCards";
import { getSiteSettings } from "@/app/functions/getSiteSettings";

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((title) => ({ title }));
}

export async function generateMetadata({
  params,
}: {
  params: { title: string };
}) {
  const article = await getArticleBySlug(params.title);

  if (!article) return { title: pageTitle("Article not found") };

  return seoMetadata(article.seo);
}

export default async function ArticleDetails({
  params,
}: {
  params: { title: string };
}) {
  const [article, related, settings] = await Promise.all([
    getArticleBySlug(params.title),
    getArticleCards({ limit: 4 }),
    getSiteSettings(),
  ]);

  if (!article) notFound();

  const latestArticles = related.items
    .filter((x) => x.slug !== article.slug)
    .slice(0, 3);

  return (
    <main className="mx-auto w-full max-w-[95rem] px-4 md:px-8">
      <PostNavigation href="/magazine">Magazine</PostNavigation>
      <header className="mx-auto max-w-4xl text-center">
        <p className="kicker">
          <Link href={categoryHref(article.categorySlug)} className="text-accent underline-offset-4 hover:underline">
            {article.label}
          </Link>
        </p>
        <h1 className="text-subtitle mt-4">{article.title}</h1>
        {article.description && (
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{article.description}</p>
        )}
        <p className="kicker mt-6">
          By{" "}
          <Link href={`/authors/${article.author.slug}`} className="underline-offset-4 hover:underline">
            {article.author.name}
          </Link>
          <span className="text-muted-foreground">
            {" "}
            &middot; <time dateTime={article.isoDate || undefined}>{article.date}</time> &middot; {article.read}
          </span>
        </p>
      </header>

      <div className="mt-10 md:mt-14">
        <Image
          src={article.mainImg}
          alt={article.imgAlt}
          width={1520}
          height={1013}
          sizes="(max-width: 1520px) 100vw, 1520px"
          className="h-auto w-full"
          priority
        />
      </div>

      <article className="mx-auto mt-10 flex w-full max-w-[62.5rem] flex-col gap-10 md:mt-16 md:flex-row md:gap-16">
        <div className="flex w-full shrink-0 flex-col md:w-56">
          <div className="flex items-center gap-4">
            <Image
              className="h-16 w-16 rounded-full object-cover"
              src={article.author.avatar}
              alt={article.author.imgAlt}
              width={64}
              height={64}
              sizes="64px"
              style={{ objectPosition: article.author.avatarFocus }}
            />
            <p className="font-display text-2xl leading-tight">
              <Link href={`/authors/${article.author.slug}`} className="underline-offset-4 hover:underline">
                {article.author.name}
              </Link>
            </p>
          </div>

          <dl className="mt-6 space-y-3 border-t border-border pt-6">
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="kicker">Date</dt>
              <dd>
                <time dateTime={article.isoDate || undefined}>{article.date}</time>
              </dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="kicker">Read</dt>
              <dd>{article.read}</dd>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <dt className="kicker">Share</dt>
              <dd>
                <ShareLinks
                  path={`/magazine/${article.slug}`}
                  title={article.title}
                  image={article.mainImg}
                />
              </dd>
            </div>
          </dl>
        </div>
        <div className="min-w-0 flex-1 text-[1.0625rem] leading-relaxed [&>*:first-child]:mt-0">
          <RichText value={article.body} />
        </div>
      </article>

      {latestArticles.length > 0 && (
        <section aria-labelledby="latest-posts" className="mb-12">
          <SectionTitle id="latest-posts" href="/magazine" linkText={settings.words.seeAll}>
            {settings.words.latestStories}
          </SectionTitle>
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((latestArticle) => (
              <ArticleCard key={latestArticle.slug} article={latestArticle} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
