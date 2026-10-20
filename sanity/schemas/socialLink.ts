import { socialPlatforms } from "../../lib/site";

// One social media account. Used for the site's own accounts (Site settings)
// and for each author's Follow links.
const socialLink = {
  name: "socialLink",
  title: "Account",
  type: "object",
  fields: [
    {
      name: "platform",
      title: "Platform",
      type: "string",
      options: { list: socialPlatforms.map(({ title, value }) => ({ title, value })) },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "url",
      title: "Profile address",
      type: "url",
      description: "e.g. https://www.instagram.com/ruvyne",
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: { platform: "platform", url: "url" },
    prepare: ({ platform, url }: any) => ({
      title: socialPlatforms.find((p) => p.value === platform)?.title ?? "Account",
      subtitle: url,
    }),
  },
};

export default socialLink;
