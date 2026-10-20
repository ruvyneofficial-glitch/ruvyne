import { sanityFetch } from "@/lib/sanity.client";
import { imageFocus, imageUrl, type SanityImage } from "@/lib/image";
import { readableOn, resolveTheme, isHex, type ThemeColors } from "@/lib/theme";
import { DEFAULT_WORDS, type Words } from "@/lib/words";
import { categoryHref, siteConfig, sitePages, validSocial, type SocialLink } from "@/lib/site";
import { getAllArticleCards } from "./getArticleCards";
import { getCategories } from "./getCategories";

export type { SocialLink };
export type NavLink = { label: string; href: string; children?: NavLink[] };
export type Logo = { url: string; width: number; height: number };
export type Announcement = { text: string; url: string | null; background?: string; color?: string };

export type SiteSettings = {
  tagline: string;
  description: string;
  logo: Logo;
  footerLogo: Logo;
  favicon: string | null;
  shareImage: string | null;
  theme: ThemeColors;
  // null means no menu was built in the Studio: getMenu() derives one.
  menu: NavLink[] | null;
  footerLinks: NavLink[];
  social: SocialLink[];
  words: Words;
  // null when switched off or outside its start and end times.
  announcement: Announcement | null;
  featuredArticle: string | null;
  popularArticles: string[];
  showNewsTicker: boolean;
  latestHeading: string;
  latestCount: number;
  showCategorySections: boolean;
  // Empty means every category ticked "Show on the homepage".
  homepageCategories: { slug: string; count: number }[];
  // Podcasts are switched off.
  // showPodcasts: boolean;
  // podcastsHeading: string;
  showAuthors: boolean;
  authorsHeading: string;
  team: string[];
  newsletterHeading: string;
  newsletterText: string;
  copyright: string;
  printIssue: string;
  printCover: string;
  printCoverFocus?: string;
  printCoverAlt: string;
  printOrderUrl: string | null;
};

type RawLink = {
  label?: string;
  linkType?: string;
  page?: string;
  categorySlug?: string;
  url?: string;
  ref?: { _type: string; slug?: string } | null;
  children?: RawLink[] | null;
};

// The Studio stores "hide" switches, so an untouched switch means "shown".
type Raw = Partial<
  Omit<
    SiteSettings,
    | "logo"
    | "footerLogo"
    | "theme"
    | "menu"
    | "footerLinks"
    | "social"
    | "words"
    | "announcement"
    | "homepageCategories"
    | "showNewsTicker"
    | "showCategorySections"
    // | "showPodcasts"
    | "showAuthors"
    | "printCover"
  >
> & {
  hideNewsTicker?: boolean;
  hideCategorySections?: boolean;
  // hidePodcasts?: boolean;
  hideAuthors?: boolean;
  logo?: Partial<Logo> | null;
  footerLogo?: Partial<Logo> | null;
  themePreset?: string;
  colors?: Record<string, unknown> | null;
  menu?: RawLink[] | null;
  footerLinks?: RawLink[] | null;
  social?: Array<{ platform?: string; url?: string }> | null;
  words?: Partial<Record<keyof Words, string | null>> | null;
  announcement?: {
    enabled?: boolean;
    text?: string;
    url?: string;
    background?: string;
    color?: string;
    startsAt?: string;
    endsAt?: string;
  } | null;
  homepageCategories?: Array<{ slug?: string | null; count?: number | null }> | null;
  printCover?: SanityImage;
};

const LINK = /* groq */ `label, linkType, page, "categorySlug": category->slug.current, url, "ref": reference->{_type, "slug": slug.current}`;
const LOGO = /* groq */ `{url, "width": metadata.dimensions.width, "height": metadata.dimensions.height}`;

const QUERY = /* groq */ `
*[_type == "siteSettings"][0]{
  tagline,
  description,
  "logo": logo.asset->${LOGO},
  "footerLogo": footerLogo.asset->${LOGO},
  "favicon": favicon.asset->url,
  "shareImage": shareImage.asset->url,
  themePreset,
  colors,
  menu[]{${LINK}, children[]{${LINK}}},
  footerLinks[]{${LINK}},
  social[]{platform, url},
  words,
  announcement,
  "featuredArticle": featuredArticle->slug.current,
  "popularArticles": popularArticles[]->slug.current,
  hideNewsTicker,
  latestHeading,
  latestCount,
  hideCategorySections,
  "homepageCategories": homepageCategories[]{"slug": category->slug.current, count},
  // hidePodcasts,
  // podcastsHeading,
  hideAuthors,
  authorsHeading,
  "team": team[]->slug.current,
  newsletterHeading,
  newsletterText,
  copyright,
  printIssue,
  printCover,
  printCoverAlt,
  printOrderUrl
}`;

const pageLinks = (...pages: string[]): NavLink[] =>
  sitePages
    .filter((p) => pages.includes(p.value))
    .map((p) => ({ label: p.value === "magazine" ? "Magazine" : p.title, href: p.path }));

export const SITE_SETTINGS_FALLBACK: SiteSettings = {
  tagline: siteConfig.tagline,
  description: siteConfig.description,
  logo: { url: "/brand/logo-header.png", width: 540, height: 128 },
  footerLogo: { url: "/brand/logo-footer.png", width: 363, height: 360 },
  favicon: null,
  shareImage: null,
  theme: resolveTheme(),
  menu: null,
  // Filled with the categories plus Magazine and Authors by getSiteSettings().
  footerLinks: [],
  // No placeholder "#" profiles: icons appear once real URLs are added.
  social: [],
  words: DEFAULT_WORDS,
  announcement: null,
  featuredArticle: null,
  popularArticles: [],
  showNewsTicker: true,
  latestHeading: "The Latest",
  latestCount: 6,
  showCategorySections: true,
  homepageCategories: [],
  // showPodcasts: true,
  // podcastsHeading: "Podcast",
  showAuthors: true,
  authorsHeading: "Meet the Team",
  team: [],
  newsletterHeading: "Style news to your inbox",
  // newsletterText: "New stories, interviews and episodes, once a week.",
  newsletterText: "New stories and interviews, once a week.",
  copyright: `${siteConfig.name}. All rights reserved.`,
  printIssue: "03/2026",
  printCover: "/images/homepage/magazine-cover.jpg",
  printCoverAlt:
    "A black and white portrait photograph used as the cover of the current print edition",
  printOrderUrl: null,
};

function hrefFor(link: RawLink): string | null {
  switch (link.linkType) {
    case "page":
      return sitePages.find((p) => p.value === link.page)?.path ?? null;
    case "category":
      return link.categorySlug ? categoryHref(link.categorySlug) : null;
    case "content": {
      const slug = link.ref?.slug;
      if (!slug) return null;
      if (link.ref?._type === "author") return `/authors/${slug}`;
      if (link.ref?._type === "page") return `/${slug}`;
      // Podcasts are switched off, so links to episodes are skipped.
      if (link.ref?._type === "podcast") return null; // `/podcasts/${slug}`
      return `/magazine/${slug}`;
    }
    case "url":
      return link.url || null;
    default:
      return null;
  }
}

// Half-filled links in the Studio (no label, nothing picked) are skipped
// rather than rendered as dead links.
function toNavLinks(links: RawLink[] | null | undefined): NavLink[] {
  return (links ?? []).flatMap((link) => {
    const href = hrefFor(link);
    if (!link.label || !href) return [];
    const children = toNavLinks(link.children);
    return [children.length ? { label: link.label, href, children } : { label: link.label, href }];
  });
}

function logo(value: Partial<Logo> | null | undefined, fallback: Logo): Logo {
  return value?.url && value.width && value.height ? (value as Logo) : fallback;
}

// Rendered pages are refreshed every minute, so the bar appears and goes away
// within about a minute of its start and end times.
function toAnnouncement(raw: Raw["announcement"], theme: ThemeColors): Announcement | null {
  if (!raw?.enabled || !raw.text?.trim()) return null;
  const now = Date.now();
  if (raw.startsAt && Date.parse(raw.startsAt) > now) return null;
  if (raw.endsAt && Date.parse(raw.endsAt) <= now) return null;

  const background = isHex(raw.background) ? raw.background : undefined;
  const color = isHex(raw.color)
    ? raw.color
    : background && readableOn(background, theme.background, theme.text);
  return { text: raw.text.trim(), url: raw.url || null, background, color };
}

async function defaultFooterLinks(): Promise<NavLink[]> {
  const categories = await getCategories();
  return [
    ...categories.map((c) => ({ label: c.title, href: categoryHref(c.slug) })),
    ...pageLinks("magazine", /* "podcasts", */ "authors"),
  ];
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await sanityFetch<Raw | null>(QUERY);
  const f = SITE_SETTINGS_FALLBACK;

  if (!data) return { ...f, footerLinks: await defaultFooterLinks() };

  const theme = resolveTheme(data.themePreset, data.colors ?? {});
  const menu = toNavLinks(data.menu);
  const footerLinks = toNavLinks(data.footerLinks);
  const words = { ...DEFAULT_WORDS };
  for (const [key, value] of Object.entries(data.words ?? {})) {
    if (key in words && typeof value === "string" && value.trim()) {
      words[key as keyof Words] = value.trim();
    }
  }

  return {
    tagline: data.tagline || f.tagline,
    description: data.description || f.description,
    logo: logo(data.logo, f.logo),
    footerLogo: logo(data.footerLogo, f.footerLogo),
    favicon: data.favicon || null,
    shareImage: data.shareImage || null,
    theme,
    menu: menu.length ? menu : null,
    footerLinks: footerLinks.length ? footerLinks : await defaultFooterLinks(),
    social: validSocial(data.social),
    words,
    announcement: toAnnouncement(data.announcement, theme),
    featuredArticle: data.featuredArticle || null,
    popularArticles: (data.popularArticles ?? []).filter(Boolean),
    showNewsTicker: !data.hideNewsTicker,
    latestHeading: data.latestHeading || f.latestHeading,
    latestCount: Math.min(12, Math.max(3, data.latestCount || f.latestCount)),
    showCategorySections: !data.hideCategorySections,
    homepageCategories: (data.homepageCategories ?? []).flatMap((s) =>
      s.slug ? [{ slug: s.slug, count: Math.min(9, Math.max(2, s.count || 5)) }] : []
    ),
    // showPodcasts: !data.hidePodcasts,
    // podcastsHeading: data.podcastsHeading || f.podcastsHeading,
    showAuthors: !data.hideAuthors,
    authorsHeading: data.authorsHeading || f.authorsHeading,
    team: (data.team ?? []).filter(Boolean),
    newsletterHeading: data.newsletterHeading || f.newsletterHeading,
    newsletterText: data.newsletterText || f.newsletterText,
    copyright: data.copyright || f.copyright,
    printIssue: data.printIssue || f.printIssue,
    printCover: imageUrl(data.printCover, 1000) || f.printCover,
    printCoverFocus: imageFocus(data.printCover),
    printCoverAlt: data.printCoverAlt || f.printCoverAlt,
    printOrderUrl: data.printOrderUrl || null,
  };
}

// The slide-out menu and the header's category row. Without a menu built in
// the Studio, every category is listed with its three newest stories.
export async function getMenu(settings: SiteSettings): Promise<NavLink[]> {
  if (settings.menu) return settings.menu;

  const [cards, categories] = await Promise.all([getAllArticleCards(), getCategories()]);

  return [
    ...pageLinks("magazine"),
    ...categories.map((category) => ({
      label: category.title,
      href: categoryHref(category.slug),
      children: [
        ...cards
          .filter((c) => c.categorySlug === category.slug)
          .slice(0, 3)
          .map((c) => ({ label: c.title, href: `/magazine/${c.slug}` })),
        { label: `All ${category.title} stories`, href: categoryHref(category.slug) },
      ],
    })),
    ...pageLinks(/* "podcasts", */ "authors"),
  ];
}
