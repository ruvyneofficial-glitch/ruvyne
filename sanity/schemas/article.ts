const article = {
  name: "article",
  title: "Article",
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
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "label",
      title: "Category",
      type: "string",
      description:
        "Drives the category filter on /magazine. The filter is built from the distinct values in use, so a typo creates a new category.",
      options: {
        list: [
          { title: "Beauty", value: "Beauty" },
          { title: "Fashion", value: "Fashion" },
          { title: "Home Decor", value: "Home Decor" },
        ],
        layout: "radio",
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "description",
      title: "Standfirst",
      type: "text",
      rows: 3,
      description: "Shown on listing cards and at the top of the article.",
    },
    {
      name: "date",
      title: "Date",
      type: "string",
      description:
        'Human readable, e.g. "12 August 2026". Parsed with new Date() for sorting, so keep this format.',
    },
    { name: "read", title: "Read time", type: "string" },
    {
      name: "popular",
      title: "Popular",
      type: "boolean",
      description: "Include in the Most Popular sidebar list.",
      initialValue: false,
    },
    {
      name: "popularity",
      title: "Popularity rank",
      type: "number",
      description: "Sort order within Most Popular. Lower shows first.",
      initialValue: 0,
    },
    {
      name: "img",
      title: "Preview image",
      type: "image",
      description:
        "Shown on the magazine grid and the homepage list. Upload a square or landscape image.",
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "imgAlt",
      title: "Image alt text",
      type: "string",
      description:
        "Describe the image for people using a screen reader. Used for both images below.",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "mainImg",
      title: "Article header image",
      type: "image",
      description:
        "The wide image at the top of the article page. Can be the same as the preview.",
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "summary",
      title: "Opening summary",
      type: "text",
      rows: 4,
    },
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
      name: "summary2",
      title: "Bridging summary",
      type: "text",
      rows: 3,
    },
    {
      name: "section2",
      title: "Section 2",
      type: "text",
      rows: 12,
      description: "Separate paragraphs with a blank line.",
    },
  ],
  preview: {
    select: { title: "title", subtitle: "label", author: "author.name" },
    prepare({ title, subtitle, author }: any) {
      return { title, subtitle: [subtitle, author].filter(Boolean).join(" / ") };
    },
  },
};

export default article;
