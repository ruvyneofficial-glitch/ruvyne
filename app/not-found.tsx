import PageTitle from "@/components/PageTitle";
import Link from "next/link";
import { pageTitle } from "@/lib/site";
import { getSiteSettings } from "@/app/functions/getSiteSettings";

export const metadata = {
  title: pageTitle("Page not found"),
  description: "Page does not exist",
};

export default async function NotFound() {
  const { words } = await getSiteSettings();

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-[95rem] flex-col items-center px-4 text-center md:px-8">
      <PageTitle>{words.notFoundTitle}</PageTitle>
      <p className="text-lg">
        {words.notFoundText}{" "}
        <Link className="underline underline-offset-4" href="/">
          Return home
        </Link>{" "}
        or{" "}
        <Link className="underline underline-offset-4" href="/search">
          search the magazine
        </Link>
        .
      </p>
    </main>
  );
}
