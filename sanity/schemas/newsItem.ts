const newsItem = {
  name: "newsItem",
  title: "News ticker item",
  type: "document",
  fields: [
    {
      name: "text",
      title: "Text",
      type: "string",
      description:
        "One short headline. The ticker appends +++ automatically, so do not add it.",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Lowest shows first.",
      initialValue: 0,
    },
  ],
  orderings: [
    { title: "Sort order, lowest first", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
    { title: "Sort order, highest first", name: "orderDesc", by: [{ field: "order", direction: "desc" }] },
    { title: "Text, A to Z", name: "textAsc", by: [{ field: "text", direction: "asc" }] },
    { title: "Text, Z to A", name: "textDesc", by: [{ field: "text", direction: "desc" }] },
  ],
  preview: {
    select: { title: "text", subtitle: "order" },
  },
};

export default newsItem;
