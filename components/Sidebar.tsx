import PopularArticles from "./PopularArticles";
import Cover from "./Cover";
import { Button } from "./ui/button";
import { getSiteSettings } from "@/app/functions/getSiteSettings";

export default async function Sidebar() {
  const settings = await getSiteSettings();

  return (
    <aside className="space-y-14">
      <section aria-labelledby="print-title">
        <h2 id="print-title" className="kicker">
          {settings.words.printEdition}
        </h2>
        <p className="mt-1 font-display text-5xl">{settings.printIssue}</p>
        <Cover
          className="mb-5 mt-6 aspect-[3/4] w-full max-w-[20rem]"
          src={settings.printCover}
          photoAlt={settings.printCoverAlt}
          focus={settings.printCoverFocus}
          kicker="Magazine"
          cornerLabel={settings.printIssue}
          tint={{ shadow: "#5c3f35", highlight: "#d8b7a4" }}
          sizes="320px"
        />
        {settings.printOrderUrl && (
          <Button asChild>
            <a href={settings.printOrderUrl}>{settings.words.orderCopy}</a>
          </Button>
        )}
      </section>
      <PopularArticles picked={settings.popularArticles} heading={settings.words.mostPopular} />
    </aside>
  );
}
