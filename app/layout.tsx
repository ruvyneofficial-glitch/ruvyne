import SiteChrome from "@/components/SiteChrome";
import "./globals.css";
import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site";
import { themeVars } from "@/lib/theme";
import { getMenu, getSiteSettings } from "@/app/functions/getSiteSettings";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

// Square crop through the Sanity image CDN, so any upload works as an icon.
const icon = (url: string, size: number) =>
  `${url}?w=${size}&h=${size}&fit=crop&fm=png`;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL(siteConfig.url),
    title: siteConfig.name,
    description: settings.description,
    icons: settings.favicon
      ? { icon: icon(settings.favicon, 96), apple: icon(settings.favicon, 180) }
      : { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
    openGraph: settings.shareImage
      ? { images: [`${settings.shareImage}?w=1200&h=630&fit=crop`] }
      : undefined,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const menu = await getMenu(settings);

  return (
    <html
      lang="en"
      className={`scroll-smooth ${displayFont.variable}`}
      style={themeVars(settings.theme) as React.CSSProperties}
    >
      <body>
        <SiteChrome
          header={
            <Header
              logo={settings.logo}
              tagline={settings.tagline}
              menu={menu}
              social={settings.social}
              announcement={settings.announcement}
              searchPlaceholder={settings.words.searchPlaceholder}
              followUs={settings.words.followUs}
            />
          }
          footer={<Footer settings={settings} />}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
