// Shared "Search & sharing" box for stories, authors and pages. Every field
// is optional and falls back to the document's own title, summary and image.
const seo = {
  name: "seo",
  title: "Search & sharing",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    {
      name: "title",
      title: "Google title",
      type: "string",
      description: "The headline Google shows. Leave empty to use the normal title.",
      validation: (Rule: any) =>
        Rule.max(70).warning("Google shortens titles longer than about 60 characters."),
    },
    {
      name: "description",
      title: "Google description",
      type: "text",
      rows: 3,
      description:
        "One or two sentences shown under the headline in Google and when the link is shared. Leave empty to use the summary.",
      validation: (Rule: any) =>
        Rule.max(170).warning("Google shortens descriptions longer than about 160 characters."),
    },
    {
      name: "image",
      title: "Sharing image",
      type: "image",
      options: { hotspot: true },
      description:
        "Shown when the link is shared on social media or in messages. Leave empty to use the main image.",
    },
    {
      name: "noindex",
      title: "Hide from Google",
      type: "boolean",
      description:
        "Keeps this out of search results and the sitemap. It still works for anyone with the link.",
    },
  ],
};

export default seo;
