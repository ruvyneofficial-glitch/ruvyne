import Container from "@/components/ui/container";
import "./globals.css";
import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PodcastContextProvider from "@/context/PodcastContext";
import ArticleContextProvider from "@/context/ArticleContext";
import { siteConfig } from "@/lib/site";

/**
 * The wordmark serif. Body copy stays General Sans; this face is used only by
 * components/Wordmark.tsx, so the live-text wordmark matches the logo artwork
 * in public/logo.svg.
 */
const wordmarkFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
  variable: "--font-wordmark",
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.tagline,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${wordmarkFont.variable}`}>
      <body>
        <ArticleContextProvider>
          <PodcastContextProvider>
            <Container>
              <Header />
              {children}
              <Footer />
            </Container>
          </PodcastContextProvider>
        </ArticleContextProvider>
      </body>
    </html>
  );
}
