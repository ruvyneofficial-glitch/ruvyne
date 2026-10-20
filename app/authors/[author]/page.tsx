import Image from "next/image";
import { notFound } from "next/navigation";
import PostNavigation from "@/components/PostNavigation";
import SocialLinks from "@/components/SocialLinks";
import { pageTitle } from "@/lib/site";
import { seoMetadata } from "@/lib/seo";
import { getAuthorBySlug, getAuthorSlugs } from "@/app/functions/getAuthors";
import {
  getArticlesByAuthor,
  type ArticleCard as ArticleCardData,
} from "@/app/functions/getArticleCards";
import { getSiteSettings } from "@/app/functions/getSiteSettings";
import ArticleCard from "@/components/ArticleCard";
import SectionTitle from "@/components/SectionTitle";

export async function generateStaticParams() {
  const slugs = await getAuthorSlugs();
  return slugs.map((author) => ({ author }));
}

export async function generateMetadata({
  params,
}: {
  params: { author: string };
}) {
  const author = await getAuthorBySlug(decodeURIComponent(params.author));

  if (!author) return { title: pageTitle("Author not found") };

  return seoMetadata(author.seo);
}

export default async function AuthorDetails({
  params,
}: {
  params: { author: string };
}) {
  const slug = decodeURIComponent(params.author);
  const [author, articles, settings] = await Promise.all([
    getAuthorBySlug(slug),
    getArticlesByAuthor(slug),
    getSiteSettings(),
  ]);

  if (!author) notFound();

  return (
    <main className="mx-auto w-full max-w-[95rem] px-4 md:px-8">
      <PostNavigation href="/authors">Author</PostNavigation>
      <article className="mx-auto grid w-full max-w-[75rem] gap-10 md:grid-cols-[18rem_1fr] md:gap-16">
        <div>
          <Image
            src={author.avatar}
            alt={author.imgAlt}
            width={288}
            height={288}
            sizes="288px"
            style={{ objectPosition: author.avatarFocus }}
            className="aspect-square w-full max-w-[18rem] rounded-full object-cover"
          />
          {author.social.length > 0 && (
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6">
              <p className="kicker">Follow</p>
              <SocialLinks links={author.social} />
            </div>
          )}
        </div>
        <div>
          <p className="kicker text-accent">
            {author.job} &middot; {author.city}
          </p>
          <h1 className="text-subheading mt-3 pb-8">{author.name}</h1>
          <p className="text-blog-summary pb-8">{author.bioSummary}</p>
          <p className="whitespace-pre-line leading-relaxed">{author.bioBody}</p>
        </div>
      </article>
      <section aria-labelledby="author-articles" className="pb-12">
        <SectionTitle id="author-articles">
          {settings.words.articlesBy} {author.name}
        </SectionTitle>
        <AuthorArticles articles={articles} emptyText={settings.words.noStoriesByAuthor} />
      </section>
    </main>
  );
}

function AuthorArticles({
  articles,
  emptyText,
}: {
  articles: ArticleCardData[];
  emptyText: string;
}) {
  if (articles.length === 0) {
    return <p>{emptyText}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} variant="row" showDescription={false} />
      ))}
    </div>
  );
}
