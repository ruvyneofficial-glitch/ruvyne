"use client";

import dynamic from "next/dynamic";
import config from "@/sanity.config";
import StudioLoading from "@/components/StudioLoading";

const Studio = dynamic(() => import("sanity").then((mod) => mod.Studio), {
  ssr: false,
  loading: () => <StudioLoading />,
});

export default function StudioClient() {
  return (
    <div style={{ height: "100dvh", minHeight: "100vh" }}>
      <Studio config={config} />
    </div>
  );
}
