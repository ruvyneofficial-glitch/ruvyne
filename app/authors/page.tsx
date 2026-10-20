import AuthorsList from "@/components/AuthorList";
import PageTitle from "@/components/PageTitle";
import { Suspense } from "react";
import Loading from "./loading";
import { pageTitle } from "@/lib/site";
import { getSiteSettings } from "@/app/functions/getSiteSettings";

export const metadata = {
  title: pageTitle("Authors"),
  description: "Our authors",
};

export default async function AuthorsPage() {
  const settings = await getSiteSettings();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[95rem] flex-col px-4 md:px-8">
      <PageTitle intro={settings.words.authorsIntro}>Authors</PageTitle>
      <Suspense fallback={<Loading />}>
        <AuthorsList team={settings.team} />
      </Suspense>
    </main>
  );
}
