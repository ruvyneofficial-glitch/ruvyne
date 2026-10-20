// Short pieces of text around the site. Each can be reworded in Site settings
// > Words on the site; the Studio shows these defaults in grey and the site
// falls back to them.
export const WORDS = {
  magazineIntro: {
    label: "Magazine page intro",
    text: "Beauty, fashion and home decor stories from our writers and editors.",
  },
  authorsIntro: {
    label: "Authors page intro",
    text: "The writers and editors behind the stories.",
  },
  searchPlaceholder: { label: "Search box hint", text: "What are you looking for?" },
  mostPopular: { label: "Most popular heading", text: "Most popular" },
  printEdition: { label: "Print edition heading", text: "Print edition" },
  orderCopy: { label: "Order button", text: "Order a copy" },
  followUs: { label: "Follow us heading (in the menu)", text: "Follow us" },
  seeAll: { label: "See all link", text: "See all" },
  latestStories: { label: "Heading under each story", text: "Latest stories" },
  articlesBy: { label: "Heading on an author's page", text: "Articles by" },
  noStoriesInCategory: {
    label: "Message for a category with no stories",
    text: "No articles in this category yet.",
  },
  noStoriesByAuthor: {
    label: "Message for an author with no stories",
    text: "No articles published yet.",
  },
  noSearchResults: { label: "Message when a search finds nothing", text: "Try another word." },
  notFoundTitle: { label: "Page not found heading", text: "Not found" },
  notFoundText: {
    label: "Page not found message",
    text: "The page you're looking for does not exist.",
  },
} as const;

export type Words = Record<keyof typeof WORDS, string>;

export const DEFAULT_WORDS = Object.fromEntries(
  Object.entries(WORDS).map(([key, { text }]) => [key, text])
) as Words;
