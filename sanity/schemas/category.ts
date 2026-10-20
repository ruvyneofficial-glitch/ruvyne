const category = {
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Web address",
      type: "slug",
      description:
        "Used in links, e.g. beauty gives /magazine?category=beauty. Click Generate after typing the name.",
      options: { source: "title", maxLength: 64 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      description: "One or two sentences shown at the top of the category's page.",
    },
    {
      name: "cover",
      title: "Cover image",
      type: "image",
      description: "A wide photograph shown at the top of the category's page. Optional.",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the photograph for people using a screen reader.",
        },
      ],
    },
    {
      name: "order",
      title: "Order",
      type: "number",
      description:
        "Lower numbers come first in the menu, the footer and the magazine tabs. Categories with the same number go A to Z.",
      initialValue: 10,
    },
    {
      name: "showOnHomepage",
      title: "Show on the homepage",
      type: "boolean",
      description:
        "Gives the category its own section on the homepage, unless the sections are chosen in Site settings > Homepage.",
      initialValue: true,
    },
  ],
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [
        { field: "order", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
    { title: "Name, A to Z", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
    { title: "Name, Z to A", name: "titleDesc", by: [{ field: "title", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "intro", media: "cover" },
  },
};

export default category;
