import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getAuthorCards, orderByTeam } from "@/app/functions/getAuthors";

export default async function AuthorsList({ team }: { team: string[] }) {
  const authors = orderByTeam(await getAuthorCards(), team, false);

  return (
    <ul className="w-full divide-y divide-border pb-12 md:pb-24">
      {authors.map((author) => (
        <li
          key={author.slug}
          className="grid grid-cols-1 gap-5 py-8 first:pt-0 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-12"
        >
          <Image
            className="h-32 w-32 rounded-full object-cover md:h-36 md:w-36"
            src={author.avatar}
            alt={author.imgAlt}
            width={144}
            height={144}
            sizes="144px"
            style={{ objectPosition: author.avatarFocus }}
          />
          <div>
            <h2 className="font-display text-3xl leading-tight md:text-4xl">
              <Link href={`/authors/${author.slug}`} className="underline-offset-4 hover:underline">
                {author.name}
              </Link>
            </h2>
            <p className="kicker mt-2 text-muted-foreground">
              {author.job} &middot; {author.city}
            </p>
          </div>
          <Link
            className="kicker inline-flex items-center gap-2 transition-colors hover:text-accent"
            href={`/authors/${author.slug}`}
            aria-label={`About ${author.name}`}
          >
            About
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
