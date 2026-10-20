import { reservedSlugs } from "../../lib/site";

// A free-form page such as About, Contact or Privacy, shown at /<web address>.
const page = {
  name: "page",
  title: "Page",
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
      title: "Web address",
      type: "slug",
      description:
        "The page appears at ruvyne.com/<this>, e.g. about. Click Generate after typing the title.",
      options: { source: "title", maxLength: 64 },
      validation: (Rule: any) =>
        Rule.required().custom((slug?: { current?: string }) => {
          const value = slug?.current ?? "";
          if (!value) return true;
          if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
            return "Use lowercase letters, numbers and dashes only, e.g. about-us";
          }
          return reservedSlugs.includes(value)
            ? "This address is already used by another part of the site. Pick another."
            : true;
        }),
    },
    {
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      description: "Optional. Shown under the title.",
    },
    {
      name: "cover",
      title: "Cover image",
      type: "image",
      description: "Optional. A wide photograph shown under the title.",
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
    { name: "body", title: "Body", type: "richText" },
    { name: "seo", title: "Search & sharing", type: "seo" },
  ],
  orderings: [
    { title: "Title, A to Z", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
    { title: "Title, Z to A", name: "titleDesc", by: [{ field: "title", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", slug: "slug.current", media: "cover" },
    prepare: ({ title, slug, media }: any) => ({
      title,
      subtitle: slug ? `/${slug}` : "No web address yet",
      media,
    }),
  },
};

export default page;
