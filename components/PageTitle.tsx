import { cn } from "@/lib/utils";

type PageTitleProps = {
  children: React.ReactNode;
  intro?: React.ReactNode;
  className?: string;
};

export default function PageTitle({ children, intro, className }: PageTitleProps) {
  return (
    <div className={cn("py-10 text-center md:py-16", className)}>
      <h1 className="text-subheading">{children}</h1>
      {intro && <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{intro}</p>}
    </div>
  );
}
