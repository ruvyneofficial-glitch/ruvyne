import Image from "next/image";
import { siteConfig } from "@/lib/site";
import { contrast, isHex } from "@/lib/theme";

export type CoverTint = {
  shadow: string;
  highlight: string;
};

type CoverProps = {
  src: string;
  photoAlt: string;
  kicker: string;
  cornerLabel: string;
  tint: CoverTint;
  sizes?: string;
  className?: string;
  // The editor's focal point, as CSS object-position.
  focus?: string;
};

// Screen blend of two colours, as the browser composites the duotone layers.
function screen(a: string, b: string) {
  const ch = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  return `#${[0, 1, 2]
    .map((i) => Math.round(255 - ((255 - ch(a, i)) * (255 - ch(b, i))) / 255))
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}

// Every pixel of the duotone lands between the highlight colour (black in the
// photo) and highlight screened over shadow (white in the photo), so the text
// colour has to read against both. White stays where it can.
function coverInk({ shadow, highlight }: CoverTint) {
  if (!isHex(shadow) || !isHex(highlight)) return "#ffffff";
  const lightest = screen(shadow, highlight);
  const reads = (ink: string) =>
    Math.min(contrast(ink, highlight), contrast(ink, lightest)) >= 4.5;
  return ["#ffffff", shadow, "#111111"].find(reads) ?? "#111111";
}

export default function Cover({
  src,
  photoAlt,
  kicker,
  cornerLabel,
  tint,
  sizes = "(max-width: 768px) 100vw, 33vw",
  className = "w-full aspect-square",
  focus,
}: CoverProps) {
  return (
    <div
      className={`relative overflow-hidden [container-type:inline-size] ${className}`}
    >
      <Image
        src={src}
        alt={photoAlt}
        fill
        sizes={sizes}
        style={{ objectPosition: focus }}
        className="object-cover grayscale contrast-125"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundColor: tint.shadow, mixBlendMode: "multiply" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundColor: tint.highlight, mixBlendMode: "screen" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 flex flex-col justify-between p-[8cqw]"
        style={{ color: coverInk(tint) }}
      >
        <div>
          <p className="font-display font-medium uppercase text-[13cqw] leading-[0.9] tracking-[0.06em]">
            {siteConfig.name}
          </p>
          <p className="font-semibold uppercase text-[6.5cqw] leading-none tracking-[0.02em] mt-[2cqw]">
            {kicker}
          </p>
        </div>
        <div className="flex items-end justify-between">
          <p className="font-semibold uppercase text-[6cqw] leading-none">
            {cornerLabel}
          </p>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="w-[13cqw] h-[13cqw]"
          >
            <path d="M7.5 7.5 L16.5 16.5" />
            <path d="M16.5 9.5 L16.5 16.5 L9.5 16.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
