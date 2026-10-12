export const siteConfig = {
  name: "Ruvyne",
  tagline: "Beauty, Fashion & Home",
  url: "https://ruvyne.com",
  description:
    "Beauty, fashion and home decor stories, interviews and podcasts for considered living",
} as const;

export function pageTitle(segment?: string) {
  return segment ? `${segment} | ${siteConfig.name}` : siteConfig.name;
}
