import Authors from "@/components/Authors/Authors";
import LatestArticles from "@/components/LatestArticles/LatestArticles";
import LatestArticlesLoading from "@/components/LatestArticles/loading";
import NewsLoading from "@/components/NewsTicker/loading";
// Podcasts are switched off.
// import LatestPodcasts from "@/components/LatestPodcasts/LatestPodcasts";
// import LatestPodcastsLoading from "@/components/LatestPodcasts/loading";
import AuthorsLoading from "@/components/Authors/loading";
import NewsTickerSection from "@/components/NewsTicker/NewsTickerSection";
import NewsletterSignUp from "@/components/NewsletterSignUp";
import SectionTitle from "@/components/SectionTitle";
import { Suspense } from "react";
import { siteConfig } from "@/lib/site";
import { getSiteSettings } from "@/app/functions/getSiteSettings";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `${siteConfig.name} | ${settings.tagline}`,
    description: settings.description,
  };
}

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[95rem] flex-col px-4 md:px-8">
      <h1 className="sr-only">
        {siteConfig.name}: {settings.tagline}
      </h1>

      {settings.showNewsTicker && (
        <Suspense fallback={<NewsLoading />}>
          <NewsTickerSection />
        </Suspense>
      )}

      <Suspense fallback={<LatestArticlesLoading />}>
        <LatestArticles settings={settings} />
      </Suspense>

      {/* Podcasts are switched off.
      {settings.showPodcasts && (
        <section aria-labelledby="podcasts-title">
          <SectionTitle id="podcasts-title" href="/podcasts" linkText="All episodes">
            {settings.podcastsHeading}
          </SectionTitle>
          <Suspense fallback={<LatestPodcastsLoading />}>
            <LatestPodcasts />
          </Suspense>
        </section>
      )}
      */}

      <section
        aria-labelledby="newsletter-title"
        className="mt-20 bg-muted px-6 py-14 text-center md:mt-28 md:py-20"
      >
        <p aria-hidden="true" className="mb-4 text-accent">
          &mdash;&ensp;&#10022;&ensp;&mdash;
        </p>
        <h2 id="newsletter-title" className="font-display text-[2.25rem] leading-tight md:text-[3rem]">
          {settings.newsletterHeading}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{settings.newsletterText}</p>
        <NewsletterSignUp
          formClassName="mx-auto mt-8 max-w-lg"
          formFieldsClassName="flex flex-wrap justify-center gap-3"
          inputClassName="max-w-[20rem] flex-1 bg-background"
        />
      </section>

      {settings.showAuthors && (
        <section aria-labelledby="authors-title">
          <SectionTitle id="authors-title" href="/authors" linkText={settings.words.seeAll}>
            {settings.authorsHeading}
          </SectionTitle>
          <Suspense fallback={<AuthorsLoading />}>
            <Authors team={settings.team} />
          </Suspense>
        </section>
      )}
    </main>
  );
}
