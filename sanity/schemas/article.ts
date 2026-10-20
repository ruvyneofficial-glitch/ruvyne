// Older fields stay visible only while a document still holds a value from
// before the content upgrade (see the README), then disappear.
const legacy = {
  hidden: ({ value }: any) => value === undefined || value === null || value === "",
};

const article = {
  name: "article",
  title: "Article",
  type: "document",
  fieldsets: [
    {
      name: "legacy",
      title: "Old article layout",
      description:
        "This story's text is still in the old fixed layout. The content upgrade moves it into Body above, after which this box disappears.",
      options: { collapsible: true, collapsed: true },
    },
  ],
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
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      description: "Add or rename categories under Categories.",
      validation: (Rule: any) =>
        Rule.custom((value: unknown, { document }: any) =>
          value || document?.label ? true : "Pick a category"
        ),
    },
    {
      name: "label",
      title: "Old category",
      type: "string",
      readOnly: true,
      description: "From before categories could be edited. The content upgrade swaps it for the Category above.",
      ...legacy,
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
      type: "date",
      description: "Publication date. Stories are listed newest first by this date.",
      options: { dateFormat: "D MMMM YYYY" },
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (Rule: any) => Rule.required(),
    },
    { name: "read", title: "Read time", type: "string" },
    // Replaced by the drag-and-drop list in Site settings > Homepage; still
    // read until that list has stories in it.
    { name: "popular", title: "Popular", type: "boolean", hidden: true },
    { name: "popularity", title: "Popularity rank", type: "number", hidden: true },
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
      name: "body",
      title: "Body",
      type: "richText",
      description:
        "The story. Use the toolbar for headings, bold, links and lists, and the + button for images, pull quotes and videos.",
    },
    { name: "summary", title: "Opening summary", type: "text", rows: 4, fieldset: "legacy", ...legacy },
    { name: "section1", title: "Section 1", type: "text", rows: 12, fieldset: "legacy", ...legacy },
    { name: "quoteText", title: "Pull quote", type: "text", rows: 3, fieldset: "legacy", ...legacy },
    { name: "quoteAttribution", title: "Quote attribution", type: "string", fieldset: "legacy", ...legacy },
    { name: "summary2", title: "Bridging summary", type: "text", rows: 3, fieldset: "legacy", ...legacy },
    { name: "section2", title: "Section 2", type: "text", rows: 12, fieldset: "legacy", ...legacy },
    { name: "seo", title: "Search & sharing", type: "seo" },
  ],
  orderings: [
    { title: "Date, newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
    { title: "Date, oldest first", name: "dateAsc", by: [{ field: "date", direction: "asc" }] },
    { title: "Title, A to Z", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
    { title: "Title, Z to A", name: "titleDesc", by: [{ field: "title", direction: "desc" }] },
    {
      title: "Category",
      name: "categoryAsc",
      by: [
        { field: "category.title", direction: "asc" },
        { field: "date", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      category: "category.title",
      label: "label",
      author: "author.name",
      date: "date",
      media: "img",
    },
    prepare({ title, category, label, author, date, media }: any) {
      return {
        title,
        subtitle: [category ?? label, author, date].filter(Boolean).join(" / "),
        media,
      };
    },
  },
};

export default article;
