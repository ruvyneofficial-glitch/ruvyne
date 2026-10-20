import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { toEmbed } from "@/lib/embed";
import { imageSize, imageUrl, type SanityImage } from "@/lib/image";
import type { RichTextBlock } from "@/lib/legacyBody";

const EMBED_FRAME = {
  video: "aspect-video w-full",
  audio: "h-[352px] w-full",
  post: "mx-auto h-[740px] w-full max-w-[540px]",
};

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="my-5">{children}</p>,
    lead: ({ children }) => <p className="text-blog-summary my-6">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mb-4 mt-12 font-display text-[2rem] leading-tight">{children}</h2>
    ),
    h3: ({ children }) => <h3 className="heading3-title mb-3 mt-10">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-accent pl-6 font-display text-2xl italic leading-snug">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="my-5 list-disc space-y-2 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="my-5 list-decimal space-y-2 pl-6">{children}</ol>,
  },
  marks: {
    underline: ({ children }) => <span className="underline underline-offset-4">{children}</span>,
    link: ({ value, children }) => {
      const blank = Boolean(value?.blank);
      return (
        <a
          href={value?.href}
          target={blank ? "_blank" : undefined}
          rel={blank ? "noreferrer noopener" : undefined}
          className="underline decoration-accent underline-offset-4 transition-colors hover:text-accent"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value: SanityImage & { caption?: string } }) => {
      const src = imageUrl(value, 1800);
      if (!src) return null;
      const { width, height } = imageSize(value);
      return (
        <figure className="my-10">
          <Image
            src={src}
            alt={value?.alt ?? ""}
            width={width}
            height={height}
            sizes="(max-width: 1000px) 100vw, 1000px"
            className="h-auto w-full"
          />
          {value?.caption && (
            <figcaption className="kicker mt-3 text-muted-foreground">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
    pullQuote: ({ value }: { value: { text?: string; attribution?: string } }) => (
      <figure className="my-10 border-y border-foreground py-10">
        <blockquote className="text-blog-quote">&ldquo;{value.text}&rdquo;</blockquote>
        {value.attribution && (
          <figcaption className="kicker mt-6 text-muted-foreground">{value.attribution}</figcaption>
        )}
      </figure>
    ),
    embed: ({ value }: { value: { url?: string; caption?: string } }) => {
      const embed = toEmbed(value.url ?? "");
      if (!embed) return null;
      return (
        <figure className="my-10">
          <iframe
            src={embed.src}
            title={value.caption || "Embedded media"}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            className={`${EMBED_FRAME[embed.kind]} border-0`}
          />
          {value.caption && (
            <figcaption className="kicker mt-3 text-muted-foreground">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
  },
};

export default function RichText({ value }: { value: RichTextBlock[] }) {
  return <PortableText value={value as never} components={components} />;
}
