import Image from "next/image";
import Link from "next/link";
import Sidebar from "../Sidebar";
import ArticleCard from "../ArticleCard";
import SectionTitle from "../SectionTitle";
import { getAllArticleCards } from "@/app/functions/getArticleCards";
import { getCategories, type Category } from "@/app/functions/getCategories";
import type { SiteSettings } from "@/app/functions/getSiteSettings";
import { categoryHref } from "@/lib/site";

// The editor's own list of sections (Site settings > Homepage) wins; without
// one, every category ticked "Show on the homepage" gets five stories.
function homepageSections(categories: Category[], settings: SiteSettings) {
  if (!settings.homepageCategories.length) {
    return categories.filter((c) => c.showOnHomepage).map((category) => ({ category, count: 5 }));
  }
  return settings.homepageCategories.flatMap(({ slug, count }) => {
    const category = categories.find((c) => c.slug === slug);
    return category ? [{ category, count }] : [];
  });
}

export default async function LatestArticles({ settings }: { settings: SiteSettings }) {
  const [all, categories] = await Promise.all([getAllArticleCards(), getCategories()]);
  if (all.length === 0) return null;

  // The editor can pin a story to the top in Site settings; otherwise the newest leads.
  const featured = all.find((a) => a.slug === settings.featuredArticle) ?? all[0];
  const latest = all.filter((a) => a !== featured).slice(0, settings.latestCount);
  const shown = new Set([featured, ...latest]);

  return (
    <>
      <section aria-labelledby="featured-title" className="-mx-4 mt-4 md:mx-0 md:mt-8">
        <Link href={`/magazine/${featured.slug}`} tabIndex={-1} aria-hidden="true" className="block">
          <Image
            className="aspect-[4/5] w-full object-cover sm:aspect-[16/9] lg:aspect-[21/9]"
            src={featured.img}
            alt={featured.imgAlt}
            width={1520}
            height={652}
            sizes="(max-width: 1520px) 100vw, 1520px"
            style={{ objectPosition: featured.imgFocus }}
            priority
          />
        </Link>
        <div className="relative mx-4 -mt-20 bg-muted p-6 sm:mx-8 sm:-mt-28 sm:p-10 lg:mx-16 lg:max-w-4xl">
          <p className="kicker">
            <Link href={categoryHref(featured.categorySlug)} className="text-accent underline-offset-4 hover:underline">
              {featured.label}
            </Link>
          </p>
          <h2 id="featured-title" className="text-subtitle mt-3">
            <Link href={`/magazine/${featured.slug}`} className="decoration-1 underline-offset-8 hover:underline">
              {featured.title}
            </Link>
          </h2>
          {featured.description && (
            <p className="mt-4 text-lg text-muted-foreground">{featured.description}</p>
          )}
          <p className="kicker mt-5">
            By {featured.author}
            <span className="text-muted-foreground">
              {" "}
              &middot; <time dateTime={featured.isoDate || undefined}>{featured.date}</time>
              {featured.read && <> &middot; {featured.read}</>}
            </span>
          </p>
        </div>
      </section>

      <section aria-labelledby="latest-title">
        <SectionTitle id="latest-title" centered>
          {settings.latestHeading}
        </SectionTitle>
        <div className="flex flex-col gap-14 lg:flex-row xl:gap-20">
          <ul className="flex-1 divide-y divide-border">
            {latest.map((article) => (
              <li key={article.slug} className="py-8 first:pt-0">
                <ArticleCard article={article} variant="row" />
              </li>
            ))}
          </ul>
          <div className="shrink-0 lg:w-[20rem]">
            <Sidebar />
          </div>
        </div>
      </section>

      {settings.showCategorySections &&
        homepageSections(categories, settings).map(({ category, count }) => {
          const inCategory = all.filter((a) => a.categorySlug === category.slug);
          const unseen = inCategory.filter((a) => !shown.has(a));
          const [lead, ...rest] = (unseen.length ? unseen : inCategory).slice(0, count);
          if (!lead) return null;
          const id = `category-${category.slug}`;

          return (
            <section key={category.slug} aria-labelledby={id}>
              <SectionTitle
                id={id}
                href={categoryHref(category.slug)}
                linkText={`${settings.words.seeAll} ${category.title}`}
              >
                {category.title}
              </SectionTitle>
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
                <ArticleCard article={lead} variant="feature" sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="flex flex-col gap-8">
                  {rest.map((article) => (
                    <ArticleCard key={article.slug} article={article} variant="row" showDescription={false} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
    </>
  );
}
