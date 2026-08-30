import Image from "next/image";
import Link from "next/link";
import { getAuthorCards } from "@/app/functions/getAuthors";

export default async function Authors() {
  const authors = await getAuthorCards();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 mb-48 max-w-[95rem] w-full mx-auto border border-black border-collapse">
      {authors.map((author) => (
        <article
          className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 md:gap-12 p-4 md:p-8 border border-black"
          key={author.slug}
        >
          <Link href={`/authors/${author.slug}`}>
            <Image
              className="w-[9.375rem] h-[9.375rem] object-cover rounded-full hover:scale-105 transition"
              src={author.avatar}
              alt={author.imgAlt}
              width={150}
              height={150}
              sizes="150px"
            />
          </Link>
          <article>
            <p className="heading3-title mb-4">
              <Link href={`/authors/${author.slug}`}>{author.name}</Link>
            </p>
            <div className="flex gap-8">
              <span className="flex">
                <p className="font-semibold pr-2">Job</p>
                <p className="">{author.job}</p>
              </span>
              <span className="flex">
                <p className="font-semibold pr-2">City</p>
                <p className="">{author.city}</p>
              </span>
            </div>
          </article>
        </article>
      ))}
    </div>
  );
}
