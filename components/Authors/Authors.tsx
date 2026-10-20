import Image from "next/image";
import Link from "next/link";
import { getAuthorCards, orderByTeam } from "@/app/functions/getAuthors";

export default async function Authors({ team }: { team: string[] }) {
  const authors = orderByTeam(await getAuthorCards(), team, true);

  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
      {authors.map((author) => (
        <li key={author.slug}>
          <Link href={`/authors/${author.slug}`} className="group block text-center">
            <Image
              className="mx-auto aspect-square w-full max-w-[10rem] rounded-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              src={author.avatar}
              alt={author.imgAlt}
              width={160}
              height={160}
              sizes="160px"
              style={{ objectPosition: author.avatarFocus }}
            />
            <p className="mt-4 font-display text-2xl leading-tight underline-offset-4 group-hover:underline">
              {author.name}
            </p>
            <p className="kicker mt-2 text-muted-foreground">{author.job}</p>
            <p className="mt-1 text-sm text-muted-foreground">{author.city}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
