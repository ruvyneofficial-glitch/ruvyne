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
      {header}
      {children}
      {footer}
    </Container>
  );
}
