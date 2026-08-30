/**
 * Single source of truth for brand identity.
 * Change these values to rebrand the site; nothing else hardcodes the name.
 */
export const siteConfig = {
  name: "Ruvyne",
  tagline: "Beauty, Fashion & Home",
  // TODO: replace with the production domain before launch.
  url: "https://ruvyne.com",
  description:
    "Beauty, fashion and home decor stories, interviews and podcasts for considered living",
} as const;

/** Builds a page title of the form "Something | Ruvyne". */
export function pageTitle(segment?: string) {
  return segment ? `${segment} | ${siteConfig.name}` : siteConfig.name;
}
