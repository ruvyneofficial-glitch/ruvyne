import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostNavigation from "@/components/PostNavigation";
import SocialSharing from "@/components/SocialSharing";
import { pageTitle } from "@/lib/site";
import { getAuthorBySlug, getAuthorSlugs } from "@/app/functions/getAuthors";
import {
  getArticlesByAuthor,
  type ArticleCard,
} from "@/app/functions/getArticleCards";

const FOLLOW_LINKS = [
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

  return { title: pageTitle(author.name), description: author.bioSummary };
}

export default async function AuthorDetails({
  params,
}: {
  params: { author: string };
}) {
  const slug = decodeURIComponent(params.author);
  const [author, articles] = await Promise.all([
    getAuthorBySlug(slug),
    getArticlesByAuthor(slug),
  ]);

  if (!author) notFound();

  return (
    <main className="max-w-[95rem] w-full mx-auto px-4 sm:pt-4 xs:pt-2 lg:pb-4 md:pb-4 sm:pb-2 xs:pb-2">
      <PostNavigation href="/authors">Author</PostNavigation>
      <article className="max-w-[75rem] w-full mx-auto grid lg:grid-cols-[300px_680px] gap-8 md:gap-6 justify-around">
        <div className="w-fit">
          <Image
            src={author.avatar}
            alt={author.imgAlt}
            width={300}
            height={300}
            sizes="300px"
            className="w-full h-auto object-cover"
          />
          <div className="flex justify-between border-top border-t border-black mt-12 pt-6">
            <p className="uppercase font-semibold text-lg">Follow</p>
            <SocialSharing links={FOLLOW_LINKS} />
          </div>
        </div>
        <article>
          <h1 className="text-subheading pb-8">{author.name}</h1>
          <p className="text-blog-summary pb-12">{author.bioSummary}</p>
          <p className="whitespace-pre-line">{author.bioBody}</p>
        </article>
      </article>
      <div className="pb-12 md:pb-48">
        <h2 className="text-blog-subheading mt-[9.5rem] pt-12 pb-12 md:pb-24">
          Articles by {author.name}
        </h2>
        <AuthorArticles articles={articles} />
      </div>
    </main>
  );
}

function AuthorArticles({ articles }: { articles: ArticleCard[] }) {
  if (articles.length === 0) {
    return <p>No articles published yet.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 border border-black border-collapse">
      {articles.map((article) => (
        <article
          className="flex items-center gap-2 md:gap-12 p-8 border border-black"
          key={article.slug}
        >
          <Link href={`/magazine/${article.slug}`} className="shrink-0">
            <Image
              className="h-[9.375rem] w-[9.375rem] object-cover hover:scale-105 transition"
              src={article.img}
              alt={article.imgAlt}
              width={150}
              height={150}
              sizes="150px"
            />
          </Link>
          <div>
            <p className="heading3-title pb-4">
              <Link href={`/magazine/${article.slug}`}>{article.title}</Link>
            </p>
            <div className="flex gap-8">
              <span className="flex">
                <p className="font-semibold pr-2">Date</p>
                <time dateTime={article.date}>{article.date}</time>
              </span>
              <span className="flex">
                <p className="font-semibold pr-2">Category</p>
                <p className="">{article.label}</p>
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
