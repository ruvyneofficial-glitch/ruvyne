"use client";

import { usePathname } from "next/navigation";
import Container from "@/components/ui/container";

export default function SiteChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname?.startsWith("/studio")) {
    return <>{children}</>;
  }

  return (
    <Container>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-background focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      {header}
      <div id="content">{children}</div>
      {footer}
    </Container>
  );
}
