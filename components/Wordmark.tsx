import { siteConfig } from "@/lib/site";

type WordmarkProps = {
  /** Tailwind colour class for the mark, e.g. "text-black" or "text-white". */
  className?: string;
};

/**
 * The Ruvyne wordmark, set as live text rather than as an outlined-path SVG, so
 * the brand name exists in exactly one place.
 *
 * The face is the wordmark serif loaded in app/layout.tsx, letterspaced to match
 * the logo artwork in public/logo.svg. It pairs with components/LogoMark.tsx,
 * which draws the mark and carries no text.
 */
export default function Wordmark({ className = "text-black" }: WordmarkProps) {
  return (
    <span
      className={`font-wordmark font-medium uppercase leading-none tracking-[0.18em] text-[1.5rem] md:text-[1.875rem] ${className}`}
    >
      {siteConfig.name}
    </span>
  );
}
