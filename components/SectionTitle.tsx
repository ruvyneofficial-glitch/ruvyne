import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionTitleProps = {
  children: React.ReactNode;
  href?: string;
  linkText?: string;
  centered?: boolean;
  id?: string;
  className?: string;
};

// Byrdie-style section heading: centred for the lead section, otherwise
// ruled underneath with a "See all" link on the right.
export default function SectionTitle({
  children,
  href,
  linkText,
  centered,
  id,
  className,
}: SectionTitleProps) {
  const link = href && linkText && (
    <Link
      href={href}
      className="kicker inline-flex shrink-0 items-center gap-2 transition-colors hover:text-accent"
    >
      {linkText}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );

  if (centered) {
    return (
      <div className={cn("py-10 text-center md:py-14", className)}>
        <h2 id={id} className="text-subheading">
          {children}
        </h2>
        {link && <div className="mt-4">{link}</div>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mb-8 mt-16 flex flex-wrap items-end justify-between gap-4 border-b border-foreground pb-4 md:mt-24",
        className
      )}
    >
      <h2 id={id} className="text-subheading">
        {children}
      </h2>
      {link}
    </div>
  );
}
