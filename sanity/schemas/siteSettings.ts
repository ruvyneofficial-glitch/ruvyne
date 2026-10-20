import { ColorInput } from "../components/ColorInput";
import { THEME_PRESETS, contrast, isHex, resolveTheme, type ThemeKey } from "../../lib/theme";
import { sitePages } from "../../lib/site";
import { WORDS } from "../../lib/words";

const linkFields = [
  {
    name: "label",
    title: "Text shown",
    type: "string",
    validation: (Rule: any) => Rule.required(),
  },
  {
    name: "linkType",
    title: "Links to",
    type: "string",
    initialValue: "category",
    options: {
      list: [
        { title: "A category", value: "category" },
        { title: "A section of the site", value: "page" },
        { title: "An article, author or page", value: "content" },
        { title: "Another website", value: "url" },
      ],
      layout: "radio",
    },
    validation: (Rule: any) => Rule.required(),
  },
  {
    name: "category",
    title: "Category",
    type: "reference",
    to: [{ type: "category" }],
    hidden: ({ parent }: any) => parent?.linkType !== "category",
    validation: (Rule: any) =>
      Rule.custom((value: unknown, { parent }: any) =>
        parent?.linkType === "category" && !value ? "Pick a category" : true
      ),
  },
  {
    name: "page",
    title: "Section",
    type: "string",
    options: { list: sitePages.map(({ title, value }) => ({ title, value })) },
    hidden: ({ parent }: any) => parent?.linkType !== "page",
    validation: (Rule: any) =>
      Rule.custom((value: unknown, { parent }: any) =>
        parent?.linkType === "page" && !value ? "Pick a section" : true
      ),
  },
  {
    name: "reference",
    title: "Article, author or page",
    type: "reference",
    to: [{ type: "article" }, { type: "author" }, { type: "page" } /*, { type: "podcast" } */],
    hidden: ({ parent }: any) => parent?.linkType !== "content",
    validation: (Rule: any) =>
      Rule.custom((value: unknown, { parent }: any) =>
        parent?.linkType === "content" && !value ? "Pick what this links to" : true
      ),
  },
  {
    name: "url",
    title: "Web address",
    type: "url",
    description: "The full address, starting with https://",
    hidden: ({ parent }: any) => parent?.linkType !== "url",
    validation: (Rule: any) =>
      Rule.custom((value: unknown, { parent }: any) =>
        parent?.linkType === "url" && !value ? "Paste a web address" : true
      ),
  },
];

const linkPreview = {
  select: {
    title: "label",
    linkType: "linkType",
    category: "category.title",
    page: "page",
    refTitle: "reference.title",
    refName: "reference.name",
    url: "url",
  },
  prepare({ title, linkType, category, page, refTitle, refName, url }: any) {
    const target: Record<string, string | undefined> = {
      category: category && `Category: ${category}`,
      page: sitePages.find((p) => p.value === page)?.title,
      content: refTitle || refName,
      url,
    };
    return { title, subtitle: target[linkType] ?? "Not linked yet" };
  },
};

const link = (name: string, title: string, extraFields: any[] = []) => ({
  type: "object",
  name,
  title,
  fields: [...linkFields, ...extraFields],
  preview: linkPreview,
});

const COLORS: Array<[ThemeKey, string, string]> = [
  ["background", "Page background", "Behind everything except the footer."],
  ["text", "Main text", "Headlines and body text."],
  ["mutedText", "Secondary text", "Dates, captions and story descriptions."],
  ["brand", "Buttons", "Buttons, the news ticker and the current page number. Button text turns light or dark automatically."],
  ["accent", "Accent", "Category labels and the colour links turn on hover."],
  ["surface", "Panels and boxes", "The menu panel, the newsletter box and the featured story card."],
  ["border", "Lines", "Thin divider lines between stories."],
  ["footer", "Footer background", ""],
  ["footerText", "Footer text", ""],
];

// Warn (never block) when a text colour would be hard to read.
const readableAgainst: Partial<Record<ThemeKey, ThemeKey>> = {
  text: "background",
  mutedText: "background",
  accent: "background",
  footerText: "footer",
};

function colorValidation(key: ThemeKey) {
  return (Rule: any) => [
    Rule.regex(/^#[0-9a-fA-F]{6}$/).error(
      "Use a 6 character colour code like #57553f, or use the colour picker"
    ),
    Rule.custom((value: unknown, { document }: any) => {
      const against = readableAgainst[key];
      if (!against || !isHex(value)) return true;
      const theme = resolveTheme(document?.themePreset, document?.colors ?? {});
      return contrast(value, theme[against]) >= 4.5
        ? true
        : "This may be hard to read against its background. Try a darker or lighter shade.";
    }).warning(),
  ];
}

const siteSettings = {
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "brand", title: "Logo & brand", default: true },
    { name: "colours", title: "Colours" },
    { name: "navigation", title: "Menu & social" },
    { name: "homepage", title: "Homepage" },
    { name: "words", title: "Words on the site" },
    { name: "announcement", title: "Announcement bar" },
    { name: "footer", title: "Footer" },
    { name: "print", title: "Print edition" },
  ],
  fields: [
    {
      name: "logo",
      title: "Header logo",
      type: "image",
      group: "brand",
      description:
        "Shown at the top of every page and in the menu. Use a wide version on a transparent background (PNG or SVG). Leave empty for the built-in Ruvyne logo.",
    },
    {
      name: "footerLogo",
      title: "Footer logo",
      type: "image",
      group: "brand",
      description:
        "Shown on the footer background, so upload a light version that stands out on it. Leave empty for the built-in logo.",
    },
    {
      name: "favicon",
      title: "Browser tab icon (favicon)",
      type: "image",
      group: "brand",
      description:
        "The small icon in browser tabs and phone home screens. Upload a square image at least 512 × 512 pixels. Leave empty for the built-in icon.",
      options: { hotspot: true },
    },
    {
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "brand",
      description: "Shown under the logo and in the footer, e.g. \"Beauty, Fashion & Home\".",
    },
    {
      name: "description",
      title: "Site description",
      type: "text",
      rows: 3,
      group: "brand",
      description: "One or two sentences shown by Google and when the site is shared.",
    },
    {
      name: "shareImage",
      title: "Sharing image",
      type: "image",
      group: "brand",
      description:
        "Appears when a link to the site is shared on social media or in messages. Landscape, about 1200 × 630 pixels.",
      options: { hotspot: true },
    },

    {
      name: "themePreset",
      title: "Colour preset",
      type: "string",
      group: "colours",
      description:
        "Start here: one click recolours the whole site. The Ruvyne preset is used until you pick one. Changes appear on the site within about a minute.",
      options: {
        list: Object.entries(THEME_PRESETS).map(([value, { title }]) => ({ title, value })),
        layout: "radio",
      },
    },
    {
      name: "colors",
      title: "Fine-tune colours",
      type: "object",
      group: "colours",
      description:
        "Optional. Each colour follows the preset above until you pick a new one. Clear a box to go back to the preset colour.",
      fields: COLORS.map(([key, title, description]) => ({
        name: key,
        title,
        description,
        type: "string",
        components: { input: ColorInput },
        options: { themeKey: key },
        validation: colorValidation(key),
      })),
    },

    {
      name: "menu",
      title: "Menu",
      type: "array",
      group: "navigation",
      description:
        "The links in the slide-out menu (the ☰ button). Drag to reorder. Leave empty to list every category with its newest stories automatically.",
      of: [
        link("menuItem", "Menu link", [
          {
            name: "children",
            title: "Sub-links",
            type: "array",
            description: "Optional. Shown when the reader opens the arrow next to this link.",
            of: [link("menuSubLink", "Sub-link")],
          },
        ]),
      ],
    },
    {
      name: "social",
      title: "Social media accounts",
      type: "array",
      group: "navigation",
      description: "Icons shown in the menu and the footer. Drag to reorder.",
      of: [{ type: "socialLink" }],
    },

    {
      name: "featuredArticle",
      title: "Featured story",
      type: "reference",
      to: [{ type: "article" }],
      group: "homepage",
      description: "The big story at the top of the homepage. Leave empty to always show the newest story.",
    },
    {
      name: "hideNewsTicker",
      title: "Hide the news ticker",
      type: "boolean",
      group: "homepage",
      description: "The scrolling band of headlines under the header. Its lines are edited under News ticker.",
    },
    {
      name: "latestHeading",
      title: "Latest stories heading",
      type: "string",
      group: "homepage",
      description: "Default: The Latest",
    },
    {
      name: "latestCount",
      title: "Number of latest stories",
      type: "number",
      group: "homepage",
      description: "Between 3 and 12. Default: 6",
      validation: (Rule: any) => Rule.min(3).max(12).integer(),
    },
    {
      name: "popularArticles",
      title: "Most popular",
      type: "array",
      group: "homepage",
      description:
        "The numbered list beside the latest stories. Pick up to 5 stories and drag them into order.",
      of: [{ type: "reference", to: [{ type: "article" }] }],
      validation: (Rule: any) => Rule.max(5).unique(),
    },
    {
      name: "hideCategorySections",
      title: "Hide the category sections",
      type: "boolean",
      group: "homepage",
      description: "One section per category below the latest stories.",
    },
    {
      name: "homepageCategories",
      title: "Category sections",
      type: "array",
      group: "homepage",
      description:
        "Which categories get a section, in this order, and how many stories each. Leave empty to show every category ticked \"Show on the homepage\", in category order.",
      of: [
        {
          type: "object",
          name: "homepageCategory",
          title: "Section",
          fields: [
            {
              name: "category",
              title: "Category",
              type: "reference",
              to: [{ type: "category" }],
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "count",
              title: "Number of stories",
              type: "number",
              description: "Between 2 and 9. Default: 5",
              validation: (Rule: any) => Rule.min(2).max(9).integer(),
            },
          ],
          preview: {
            select: { title: "category.title", count: "count" },
            prepare: ({ title, count }: any) => ({
              title: title ?? "Pick a category",
              subtitle: `${count ?? 5} stories`,
            }),
          },
        },
      ],
    },
    // Podcasts are switched off.
    // {
    //   name: "hidePodcasts",
    //   title: "Hide the podcast section",
    //   type: "boolean",
    //   group: "homepage",
    // },
    // {
    //   name: "podcastsHeading",
    //   title: "Podcast section heading",
    //   type: "string",
    //   group: "homepage",
    //   description: "Default: Podcast",
    // },
    {
      name: "hideAuthors",
      title: "Hide the team section",
      type: "boolean",
      group: "homepage",
    },
    {
      name: "authorsHeading",
      title: "Team section heading",
      type: "string",
      group: "homepage",
      description: "Default: Meet the Team",
    },
    {
      name: "team",
      title: "Team order",
      type: "array",
      group: "homepage",
      description:
        "Who appears in the team section, in this order (the Authors page follows it too). Remove someone to leave them out of the section; their own page stays. Leave empty to show everyone.",
      of: [{ type: "reference", to: [{ type: "author" }] }],
      validation: (Rule: any) => Rule.unique(),
    },
    {
      name: "newsletterHeading",
      title: "Newsletter heading",
      type: "string",
      group: "homepage",
      description: "Used on the homepage and in the footer. Default: Style news to your inbox",
    },
    {
      name: "newsletterText",
      title: "Newsletter text",
      type: "string",
      group: "homepage",
      description: "One line under the newsletter heading.",
    },

    {
      name: "words",
      title: "Words on the site",
      type: "object",
      group: "words",
      description: "Reword any of these. A box left empty keeps the wording shown in grey.",
      fields: Object.entries(WORDS).map(([name, { label, text }]) => ({
        name,
        title: label,
        type: "string",
        placeholder: text,
      })),
    },

    {
      name: "announcement",
      title: "Announcement bar",
      type: "object",
      group: "announcement",
      description: "A strip above the header for launches, a new issue or a sale.",
      fields: [
        { name: "enabled", title: "Show the announcement bar", type: "boolean" },
        {
          name: "text",
          title: "Message",
          type: "string",
          description: 'Keep it short, e.g. "The winter issue is out now".',
          validation: (Rule: any) =>
            Rule.max(110).warning("Long messages get cut off on phones."),
        },
        {
          name: "url",
          title: "Link",
          type: "url",
          description:
            "Optional. Where the bar goes when clicked: a full address (https://…) or a page on this site such as /magazine.",
          validation: (Rule: any) => Rule.uri({ allowRelative: true, scheme: ["http", "https"] }),
        },
        {
          name: "background",
          title: "Background colour",
          type: "string",
          description: "Optional. Leave empty to use the Buttons colour.",
          components: { input: ColorInput },
          options: { themeKey: "brand" },
          validation: (Rule: any) =>
            Rule.regex(/^#[0-9a-fA-F]{6}$/).error(
              "Use a 6 character colour code like #57553f, or use the colour picker"
            ),
        },
        {
          name: "color",
          title: "Text colour",
          type: "string",
          description: "Optional. Leave empty to pick light or dark text automatically.",
          components: { input: ColorInput },
          options: { themeKey: "background" },
          validation: (Rule: any) => [
            Rule.regex(/^#[0-9a-fA-F]{6}$/).error(
              "Use a 6 character colour code like #57553f, or use the colour picker"
            ),
            Rule.custom((value: unknown, { parent, document }: any) => {
              if (!isHex(value)) return true;
              const background = isHex(parent?.background)
                ? parent.background
                : resolveTheme(document?.themePreset, document?.colors ?? {}).brand;
              return contrast(value, background) >= 4.5
                ? true
                : "This may be hard to read on the bar's background. Try a darker or lighter shade.";
            }).warning(),
          ],
        },
        {
          name: "startsAt",
          title: "Start showing",
          type: "datetime",
          description: "Optional. Leave empty to show it straight away.",
        },
        {
          name: "endsAt",
          title: "Stop showing",
          type: "datetime",
          description: "Optional. Leave empty to keep it up until you switch it off.",
        },
      ],
    },

    {
      name: "footerLinks",
      title: "Footer links",
      type: "array",
      group: "footer",
      description: "Drag to reorder. Leave empty for the categories plus Magazine and Authors.",
      of: [link("footerLink", "Footer link")],
    },
    {
      name: "copyright",
      title: "Copyright line",
      type: "string",
      group: "footer",
      description: "The © symbol and the current year are added in front automatically. Default: Ruvyne. All rights reserved.",
    },

    {
      name: "printIssue",
      title: "Print issue number",
      type: "string",
      group: "print",
      description: 'Shown above and on the print cover, e.g. "03/2026".',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "printCover",
      title: "Print edition cover photograph",
      type: "image",
      group: "print",
      description:
        "An unbranded photograph. The Ruvyne wordmark and issue number are drawn over it automatically, so do not upload an image that already has text on it.",
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "printCoverAlt",
      title: "Cover alt text",
      type: "string",
      group: "print",
      description: "Describe the photograph for people using a screen reader.",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "printOrderUrl",
      title: "Order link",
      type: "url",
      group: "print",
      description: "Where the Order a copy button goes. The button is hidden while this is empty.",
    },
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
};

export default siteSettings;
