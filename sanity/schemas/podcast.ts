const podcast = {
  name: "podcast",
  title: "Podcast episode",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "episode",
      title: "Episode label",
      type: "string",
      description:
        'Format "Episode 05". The site slices this from character 7 to get the number for the cover, so keep the wording and the two digits.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Highest shows first. Use the episode number.",
    },
    {
      name: "date",
      title: "Date",
      type: "date",
      options: { dateFormat: "D MMMM YYYY" },
      initialValue: () => new Date().toISOString().slice(0, 10),
    },
    { name: "duration", title: "Duration", type: "string" },
    {
      name: "img",
      title: "Cover photograph",
      type: "image",
      description:
        "An unbranded photograph, square crops best. The Ruvyne wordmark and episode number are drawn over it automatically, so do not upload an image that already has text on it.",
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "imgAlt",
      title: "Photograph alt text",
      type: "string",
      description:
        "Describe the photograph only. The wordmark and episode number are hidden from assistive tech.",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "tintShadow",
      title: "Duotone shadow colour",
      type: "string",
      description: "Hex, multiplied into the shadows. e.g. #0d3b45",
    },
    {
      name: "tintHighlight",
      title: "Duotone highlight colour",
      type: "string",
      description: "Hex, screened into the highlights. e.g. #4fb3c9",
    },
    { name: "summary", title: "Summary", type: "text", rows: 4 },
    {
      name: "section1",
      title: "Section 1",
      type: "text",
      rows: 12,
      description: "Separate paragraphs with a blank line.",
    },
    { name: "quoteText", title: "Pull quote", type: "text", rows: 3 },
    { name: "quoteAttribution", title: "Quote attribution", type: "string" },
    {
      name: "section2",
      title: "Section 2",
      type: "text",
      rows: 12,
      description: "Separate paragraphs with a blank line.",
    },
  ],
  orderings: [
    { title: "Episode, newest first", name: "orderDesc", by: [{ field: "order", direction: "desc" }] },
    { title: "Episode, oldest first", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
    { title: "Date, newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
    { title: "Date, oldest first", name: "dateAsc", by: [{ field: "date", direction: "asc" }] },
    { title: "Title, A to Z", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
    { title: "Title, Z to A", name: "titleDesc", by: [{ field: "title", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", episode: "episode", date: "date", media: "img" },
    prepare({ title, episode, date, media }: any) {
      return { title, subtitle: [episode, date].filter(Boolean).join(" / "), media };
    },
  },
};

export default podcast;
