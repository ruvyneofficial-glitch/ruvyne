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
  preview: {
    select: { title: "text", subtitle: "order" },
  },
};

export default newsItem;
