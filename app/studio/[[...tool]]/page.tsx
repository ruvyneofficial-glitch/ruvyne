import type { Metadata } from "next";

import StudioClient from "@/components/StudioClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Ruvyne Studio",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <StudioClient />;
}
