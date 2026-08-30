const author = {
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Must match the name lowercased with spaces as hyphens, e.g. Camille Osei -> camille-osei. The author URL is derived from the name at render time, so a mismatch produces a dead link.",
      options: { source: "name", maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    { name: "job", title: "Job title", type: "string" },
    { name: "city", title: "City", type: "string" },
    {
      name: "avatar",
      title: "Portrait",
      type: "image",
      description: "Upload a portrait. Square crops best.",
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "imgAlt",
      title: "Portrait alt text",
      type: "string",
      description:
        "Describe the photograph for people using a screen reader, e.g. 'A black and white portrait photograph of Camille Osei'.",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "bioSummary",
      title: "Biography summary",
      type: "text",
      rows: 4,
    },
    {
      name: "bioBody",
      title: "Biography body",
      type: "text",
      rows: 12,
      description: "Separate paragraphs with a blank line.",
    },
  ],
  preview: {
    select: { title: "name", subtitle: "job" },
  },
};

export default author;
