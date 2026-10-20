export const siteConfig = {
  name: "Ruvyne",
  tagline: "Beauty, Fashion & Home",
  url: "https://ruvyne.com",
  // description:
  //   "Beauty, fashion and home decor stories, interviews and podcasts for considered living",
  description: "Beauty, fashion and home decor stories and interviews for considered living",
} as const;

export function pageTitle(segment?: string) {
  return segment ? `${segment} | ${siteConfig.name}` : siteConfig.name;
}

// "Home Decor" -> "home-decor"
export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Categories are documents in the Studio; links use their web address (slug).
export function categoryHref(slug: string) {
  return `/magazine?category=${encodeURIComponent(slug)}`;
}

// Free-form pages live at /<slug>, so they cannot take these.
export const reservedSlugs = ["magazine", "authors", "search", "studio", "podcasts", "api"];

export const sitePages = [
  { value: "home", title: "Home page", path: "/" },
  { value: "magazine", title: "Magazine (all stories)", path: "/magazine" },
  // Podcasts are switched off.
  // { value: "podcasts", title: "Podcasts", path: "/podcasts" },
  { value: "authors", title: "Authors", path: "/authors" },
  { value: "search", title: "Search", path: "/search" },
];

export const socialPlatforms = [
  { value: "instagram", title: "Instagram" },
  { value: "pinterest", title: "Pinterest" },
  { value: "tiktok", title: "TikTok" },
  { value: "youtube", title: "YouTube" },
  { value: "facebook", title: "Facebook" },
  { value: "x", title: "X (Twitter)" },
  { value: "threads", title: "Threads" },
  { value: "linkedin", title: "LinkedIn" },
] as const;

export type SocialPlatform = (typeof socialPlatforms)[number]["value"];

export type SocialLink = { platform: SocialPlatform; url: string };

// Drops half-filled accounts and platforms the site has no icon for.
export function validSocial(
  links: Array<{ platform?: string | null; url?: string | null }> | null | undefined
): SocialLink[] {
  const platforms: readonly string[] = socialPlatforms.map((p) => p.value);
  return (links ?? []).filter((link): link is SocialLink =>
    Boolean(link.url && link.platform && platforms.includes(link.platform))
  );
}
