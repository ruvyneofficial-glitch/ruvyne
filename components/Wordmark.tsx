import { siteConfig } from "@/lib/site";

type WordmarkProps = {
  className?: string;
};

export default function Wordmark({ className = "text-black" }: WordmarkProps) {
  return (
    <span
      className={`font-wordmark font-medium uppercase leading-none tracking-[0.18em] text-[1.5rem] md:text-[1.875rem] ${className}`}
    >
      {siteConfig.name}
    </span>
  );
}
