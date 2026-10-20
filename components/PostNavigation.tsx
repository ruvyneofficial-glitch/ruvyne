import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type PostNavigationProps = {
  children: React.ReactNode;
  href: string;
};

export default function PostNavigation({ children, href }: PostNavigationProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-6 md:pb-12 md:pt-10">
      <Link
        className="kicker inline-flex items-center gap-2 transition-colors hover:text-accent"
        href={href}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Go back
      </Link>
      <p className="kicker text-muted-foreground">{children}</p>
    </div>
  );
}
