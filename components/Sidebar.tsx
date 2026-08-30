import NewsletterSignUp from "./NewsletterSignUp";
import PopularArticles from "./PopularArticles";
import Cover from "./Cover";
import { Button } from "./ui/button";

export default function Sidebar() {
  return (
    <aside>
      <h3 className="uppercase font-semibold mb-2">Print edition</h3>
      <p className="text-5xl font-semibold">03/2026</p>
      <Cover
        className="w-[20rem] aspect-[3/4] mt-8 mb-4"
        src="/images/homepage/magazine-cover.jpg"
        photoAlt="A black and white portrait photograph used as the cover of the current print edition"
        kicker="Magazine"
        cornerLabel="03/2026"
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
