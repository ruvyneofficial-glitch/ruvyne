const siteSettings = {
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    {
      name: "printIssue",
      title: "Print issue number",
      type: "string",
      description: 'Shown above and on the print cover, e.g. "03/2026".',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "printCover",
      title: "Print edition cover photograph",
      type: "image",
      description:
        "An unbranded photograph. The Ruvyne wordmark and issue number are drawn over it automatically, so do not upload an image that already has text on it.",
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "printCoverAlt",
      title: "Cover alt text",
      type: "string",
      description: "Describe the photograph for people using a screen reader.",
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
};

export default siteSettings;
