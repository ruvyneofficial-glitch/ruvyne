import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostNavigation from "@/components/PostNavigation";
import SocialSharing from "@/components/SocialSharing";
import Subheading from "@/components/Subheading";
import { pageTitle } from "@/lib/site";
import {
  getArticleBySlug,
  getArticleSlugs,
} from "@/app/functions/getArticleBySlug";
import { getArticleCards } from "@/app/functions/getArticleCards";

const SHARE_LINKS = [
  {
    href: "#",
    ariaLabel: "Visit our Instagram page",
    src: "/icons/ri_instagram-line.svg",
    alt: "Instagram logo",
  },
  {
    href: "#",
    ariaLabel: "Visit our Twitter page",
    src: "/icons/ri_twitter-fill.svg",
    alt: "Twitter logo",
  },
  {
    href: "#",
    ariaLabel: "Visit our YouTube page",
    src: "/icons/ri_youtube-fill.svg",
    alt: "YouTube logo",
  },
];

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

  return {
    title: pageTitle(article.title),
    description: article.description,
  };
}

export default async function ArticleDetails({
  params,
}: {
  params: { title: string };
}) {
  const [article, related] = await Promise.all([
    getArticleBySlug(params.title),
    getArticleCards({ limit: 4 }),
  ]);

  if (!article) notFound();

  const latestArticles = related.items
    .filter((x) => x.slug !== article.slug)
    .slice(0, 3);

  return (
    <main className="max-w-[95rem] w-full mx-auto px-4 md:pt-8 sm:pt-4 xs:pt-2 lg:pb-4 md:pb-4 sm:pb-2 xs:pb-2">
      <PostNavigation href="/magazine">Magazine</PostNavigation>
      <article className="grid md:grid-cols-2 gap-6 md:gap-6 pb-6 md:pb-24">
        <h1 className="text-subtitle">{article.title}</h1>
        <p>{article.description}</p>
      </article>
      <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-0 mb-8">
        <div className="flex flex-col sm:flex-row md:items-center gap-2 sm:gap-6">
          <span className="flex flex-wrap">
            <p className="font-semibold pr-2">Text</p>
            <p>{article.author.name}</p>
          </span>
          <span className="flex flex-wrap">
            <p className="font-semibold pr-2">Date</p>
            <time dateTime={article.date}>{article.date}</time>
          </span>
          <span className="flex flex-wrap">
            <p className="font-semibold pr-2">Read</p>
            <p>{article.read}</p>
          </span>
        </div>
        <span className="px-3 py-2 border border-black rounded-full w-fit">
          <p className="uppercase">{article.label}</p>
        </span>
      </div>

      <div>
        <Image
          src={article.mainImg}
          alt={article.imgAlt}
          width={1520}
          height={1013}
          sizes="(max-width: 1520px) 100vw, 1520px"
          className="w-full h-auto"
          priority
        />
      </div>

      <article className="flex flex-col md:flex-row gap-6 md:gap-16 max-w-[62.5rem] w-full mx-auto mt-6 md:mt-24">
        <div className="flex flex-col w-fit">
          <div className="flex gap-4 items-center">
            <Image
              className="w-[5rem] h-[5rem] object-cover"
              src={article.author.avatar}
              alt={article.author.imgAlt}
              width={80}
              height={80}
              sizes="80px"
            />
            <p className="text-[2rem] font-semibold">
              <Link href={`/authors/${article.author.slug}`}>
                {article.author.name}
              </Link>
            </p>
          </div>

          <div className="flex flex-col gap-4 pt-8">
            <div className="flex flex-wrap justify-between">
              <p className="font-semibold">Date</p>
              <time dateTime={article.date}>{article.date}</time>
            </div>
            <div className="flex flex-wrap justify-between">
              <p className="font-semibold">Read</p>
              <p>{article.read}</p>
            </div>
            <div className="flex flex-wrap justify-between">
              <p className="flex font-semibold">Share</p>
              <SocialSharing links={SHARE_LINKS} />
            </div>
          </div>
        </div>
        <div className="lg:w-3/4">
          <p className="text-xl font-medium">{article.summary}</p>
          <p className="my-6 whitespace-pre-line">{article.section1}</p>
          <div className="border-t-2 border-b-2 border-black my-6 py-12">
            <p className="text-blog-quote mb-6">
              &ldquo;{article.quote[0]}&rdquo;
            </p>
            <p>{article.quote[1]}</p>
          </div>
          <p className="text-xl font-medium mb-6">{article.summary2}</p>
          <p className="whitespace-pre-line">{article.section2}</p>
        </div>
      </article>

      <div>
        <Subheading
          className="text-subheading"
          url="/magazine"
          linkText="See all"
        >
          Latest Posts
        </Subheading>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-black border-collapse mb-12 md:mb-48">
          {latestArticles.map((latestArticle) => (
            <article className="border border-black p-8" key={latestArticle.slug}>
              <div className="flex items-center justify-between">
                <time dateTime={latestArticle.date}>{latestArticle.date}</time>
                <span className="px-3 py-2 border border-black rounded-full">
                  <p className="uppercase">{latestArticle.label}</p>
                </span>
              </div>
              <Link href={`/magazine/${latestArticle.slug}`}>
                <Image
                  className="w-full my-8"
                  src={latestArticle.img}
                  alt={latestArticle.imgAlt}
                  width={600}
                  height={600}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </Link>
              <h2 className="heading3-title mb-3">
                <Link href={`/magazine/${latestArticle.slug}`}>
                  {latestArticle.title}
                </Link>
              </h2>
              <p className="mt-3 mb-12">{latestArticle.description}</p>
              <div className="flex flex-wrap gap-4">
                <span className="flex">
                  <p className="font-semibold pr-2">Text</p>
                  <p>{latestArticle.author}</p>
                </span>
                <span className="flex">
                  <p className="font-semibold pr-2">Duration</p>
                  <p>{latestArticle.read}</p>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
