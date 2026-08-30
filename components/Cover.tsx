import Image from "next/image";
import { siteConfig } from "@/lib/site";

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
};

export default function Cover({
  src,
  photoAlt,
  kicker,
  cornerLabel,
  tint,
  sizes = "(max-width: 768px) 100vw, 33vw",
  className = "w-full aspect-square",
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
        className="absolute inset-0 flex flex-col justify-between p-[8cqw] text-white"
      >
        <div>
          <p className="font-semibold uppercase text-[13cqw] leading-[0.9] tracking-[0.01em]">
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
