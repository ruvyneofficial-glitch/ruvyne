import NewsletterSignUp from "./NewsletterSignUp";
import PopularArticles from "./PopularArticles";
import Cover from "./Cover";
import { Button } from "./ui/button";
import { getSiteSettings } from "@/app/functions/getSiteSettings";

export default async function Sidebar() {
  const settings = await getSiteSettings();

  return (
    <aside>
      <h3 className="uppercase font-semibold mb-2">Print edition</h3>
      <p className="text-5xl font-semibold">{settings.printIssue}</p>
      <Cover
        className="w-[20rem] aspect-[3/4] mt-8 mb-4"
        src={settings.printCover}
        photoAlt={settings.printCoverAlt}
        kicker="Magazine"
        cornerLabel={settings.printIssue}
        tint={{ shadow: "#6b4a3f", highlight: "#d8b7a4" }}
        sizes="320px"
      />
      <Button>Order</Button>
      <PopularArticles />
      <div className="bg-[#f8f8f8] p-[1.88rem] mt-16">
        <h3 className="uppercase font-semibold mb-2">Newsletter</h3>
        <p className="heading3-title mb-4">Style News to your Inbox</p>
        <NewsletterSignUp />
      </div>
    </aside>
  );
}
