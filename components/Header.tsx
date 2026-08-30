import Link from "next/link";
import menuLinks from "@/data/menu";
import SocialSharing from "./SocialSharing";
import LogoMark from "./LogoMark";
import Wordmark from "./Wordmark";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export default function Header() {
  return (
    <header className="flex flex-col justify-between max-w-[95rem] w-full mx-auto px-4 md:pt-8 pt-4 lg:pb-4 md:pb-4 sm:pb-2 xs:pb-2">
      <div className="flex">
        <div className="flex flex-1">
          <Link href="/" className="flex items-center gap-3">
            <LogoMark className="h-9 w-auto md:h-11 shrink-0" />
            <Wordmark />
            <span className="sr-only">, return to homepage</span>
          </Link>
        </div>
        <Sheet>
          <SheetTrigger aria-labelledby="button-label">
            <span id="button-label" hidden>
              Menu
            </span>
            <svg
              aria-hidden="true"
              className="md:hidden"
              width="25"
              height="16"
              viewBox="0 0 25 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="25" height="4" fill="black" />
              <rect y="6" width="25" height="4" fill="black" />
              <rect y="12" width="25" height="4" fill="black" />
            </svg>
          </SheetTrigger>
          <SheetContent
            side="top"
            className="w-full pt-14"
            aria-label="Menu Toggle"
          >
            <nav
              className="flex flex-col flex-1 justify-end gap-6"
              aria-labelledby="mobile-nav"
            >
              {menuLinks.map((menuItem, index) => (
                <Link key={index} href={menuItem.href}>
                  {menuItem.label}
                </Link>
              ))}
              <svg
                width="15"
                height="1"
                viewBox="0 0 15 1"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="15" height="1" fill="black" />
              </svg>
              <SocialSharing
                links={[
                  {
                    href: "#",
                    ariaLabel: "Visit our Instagram page",
                    src: "/icons/ri_instagram-line.svg",
                    alt: "Instagram logo",
                  },
                  {
                    href: "#",
                    ariaLabel: "Visit our Twitter page",
                    src: "/icons/ri_twitter-fill.svg",
                    alt: "Twitter logo",
                  },
                ]}
              />
            </nav>
          </SheetContent>
        </Sheet>
        <nav
          className="flex-1 items-center justify-end gap-6 hidden md:flex"
          aria-labelledby="desktop-nav"
        >
          {menuLinks.map((menuItem, index) => (
            <Link key={index} href={menuItem.href}>
              {menuItem.label}
            </Link>
          ))}
          <svg
            width="15"
            height="1"
            viewBox="0 0 15 1"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="15" height="1" fill="black" />
          </svg>
          <SocialSharing
            links={[
              {
                href: "#",
                ariaLabel: "Visit our Instagram page",
                src: "/icons/ri_instagram-line.svg",
                alt: "Instagram logo",
              },
              {
                href: "#",
                ariaLabel: "Visit our Twitter page",
                src: "/icons/ri_twitter-fill.svg",
                alt: "Twitter logo",
              },
              {
                href: "#",
                ariaLabel: "Visit our YouTube page",
                src: "/icons/ri_youtube-fill.svg",
                alt: "YouTube logo",
              },
              {
                href: "#",
                ariaLabel: "Visit our RSS feed",
                src: "/icons/ri_rss-fill.svg",
                alt: "RSS feed logo",
              },
            ]}
          />
        </nav>
      </div>
      <hr className="border-black border-t-0 border mt-4" />
    </header>
  );
}
