import { toEmbed } from "../../lib/embed";

// The rich text editor used for article and page bodies.
const richText = {
  name: "richText",
  title: "Rich text",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Large intro", value: "lead" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullets", value: "bullet" },
        { title: "Numbers", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Underline", value: "underline" },
        ],
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              {
                name: "href",
                title: "Web address",
                type: "url",
                description: "A full address (https://…), or a page on this site such as /about.",
                validation: (Rule: any) =>
                  Rule.required().uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto", "tel"],
                  }),
              },
              { name: "blank", title: "Open in a new tab", type: "boolean" },
            ],
          },
        ],
      },
    },
    {
      type: "image",
      title: "Image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the image for people using a screen reader.",
          validation: (Rule: any) => Rule.required(),
        },
        { name: "caption", title: "Caption", type: "string" },
      ],
    },
    {
      type: "object",
      name: "pullQuote",
      title: "Pull quote",
      fields: [
        {
          name: "text",
          title: "Quote",
          type: "text",
          rows: 3,
          validation: (Rule: any) => Rule.required(),
        },
        { name: "attribution", title: "Who said it", type: "string" },
      ],
      preview: {
        select: { title: "text", subtitle: "attribution" },
      },
    },
    {
      type: "object",
      name: "embed",
      title: "Video or post",
      fields: [
        {
          name: "url",
          title: "Link",
          type: "url",
          description: "Paste a YouTube, Vimeo, Spotify, Instagram or TikTok link.",
          validation: (Rule: any) =>
            Rule.required().custom((url?: string) =>
              !url || toEmbed(url)
                ? true
                : "This link can't be shown here. Use a YouTube, Vimeo, Spotify, Instagram or TikTok link."
            ),
        },
        { name: "caption", title: "Caption", type: "string" },
      ],
      preview: {
        select: { title: "url", subtitle: "caption" },
      },
    },
  ],
};

export default richText;
