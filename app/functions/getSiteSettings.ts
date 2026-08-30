import { sanityFetch } from "@/lib/sanity.client";

export type SiteSettings = {
  printIssue: string;
  printCover: string;
  printCoverAlt: string;
};

const QUERY = /* groq */ `
*[_type == "siteSettings"][0]{
  printIssue,
  "printCover": printCover.asset->url,
  printCoverAlt
}`;

export const SITE_SETTINGS_FALLBACK: SiteSettings = {
  printIssue: "03/2026",
  printCover: "/images/homepage/magazine-cover.jpg",
  printCoverAlt:
    "A black and white portrait photograph used as the cover of the current print edition",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await sanityFetch<Partial<SiteSettings> | null>(QUERY);

  if (!data) return SITE_SETTINGS_FALLBACK;

  return {
    printIssue: data.printIssue || SITE_SETTINGS_FALLBACK.printIssue,
    printCover: data.printCover || SITE_SETTINGS_FALLBACK.printCover,
    printCoverAlt:
      data.printCoverAlt || SITE_SETTINGS_FALLBACK.printCoverAlt,
  };
}
