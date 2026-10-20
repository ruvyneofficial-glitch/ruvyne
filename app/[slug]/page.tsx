import Image from "next/image";
import { notFound } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import RichText from "@/components/RichText";
import { pageTitle } from "@/lib/site";
import { seoMetadata } from "@/lib/seo";
import { getPageBySlug, getPageSlugs } from "@/app/functions/getPages";

// Free-form pages made in the Studio (About, Contact, Privacy…).
export async function generateStaticParams() {
  const slugs = await getPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug);
  if (!page) return { title: pageTitle("Page not found") };
  return seoMetadata(page.seo);
}

export default async function FreeFormPage({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug);
  if (!page) notFound();

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-[95rem] flex-col px-4 md:px-8">
      <PageTitle intro={page.intro}>{page.title}</PageTitle>
      {page.cover && (
        <Image
          src={page.cover}
          alt={page.coverAlt}
          width={1520}
          height={640}
          sizes="(max-width: 1520px) 100vw, 1520px"
          priority
          style={{ objectPosition: page.coverFocus }}
          className="mb-10 aspect-[19/8] w-full object-cover md:mb-14"
        />
      )}
      <article className="mx-auto w-full max-w-[44rem] pb-12 text-[1.0625rem] leading-relaxed [&>*:first-child]:mt-0">
        <RichText value={page.body} />
      </article>
    </main>
  );
}
