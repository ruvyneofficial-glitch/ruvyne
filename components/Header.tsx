"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import type { Announcement, Logo, NavLink, SocialLink } from "@/app/functions/getSiteSettings";
import { siteConfig } from "@/lib/site";
import { cn, logoSrc } from "@/lib/utils";
import NewsletterSignUp from "./NewsletterSignUp";
import SocialLinks from "./SocialLinks";
import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

type HeaderProps = {
  logo: Logo;
  tagline: string;
  menu: NavLink[];
  social: SocialLink[];
  announcement: Announcement | null;
  searchPlaceholder: string;
  followUs: string;
};

export default function Header({
  logo,
  tagline,
  menu,
  social,
  announcement,
  searchPlaceholder,
  followUs,
}: HeaderProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchButton = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Like Byrdie: the tagline and the category row show at the top of the page,
  // and the bar slims down once the reader scrolls. The spacer keeps the height
  // constant so the page does not jump.
  useEffect(() => {
    const onScroll = () => setCollapsed(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function closeSearch() {
    setSearching(false);
    searchButton.current?.focus();
  }

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = String(new FormData(event.currentTarget).get("q") ?? "").trim();
    if (!q) return;
    setSearching(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  // The announcement bar (h-9) sits inside the header, so it adds to the
  // expanded height and goes away with the tagline on scroll.
  const expanded = announcement ? "h-[7rem] md:h-[11rem]" : "h-[4.75rem] md:h-[8.75rem]";

  return (
    <>
      <div aria-hidden="true" className={expanded} />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 flex flex-col overflow-hidden border-b border-foreground/70 bg-background transition-[height] duration-300",
          collapsed ? "h-14 md:h-16" : expanded
        )}
      >
        {announcement && !collapsed && <AnnouncementBar {...announcement} />}
        <div className="relative mx-auto grid w-full max-w-[95rem] flex-1 grid-cols-[1fr_auto_1fr] items-center px-4 md:px-8">
          <Sheet>
            <SheetTrigger
              className="-ml-2 justify-self-start p-2 transition-colors hover:text-accent"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[33rem] max-w-[90vw] flex-col gap-0 overflow-y-auto bg-muted p-0 sm:max-w-[33rem]"
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="px-8 pb-4 pt-6">
                <SheetClose asChild>
                  <Link href="/" className="inline-block">
                    <img
                      src={logoSrc(logo, 96)}
                      alt={`${siteConfig.name}, home`}
                      width={logo.width}
                      height={logo.height}
                      className="h-9 w-auto"
                    />
                  </Link>
                </SheetClose>
              </div>
              <nav aria-label="Menu" className="px-8">
                <ul>
                  {menu.map((item) => (
                    <MenuItem key={`${item.label}-${item.href}`} item={item} />
                  ))}
                </ul>
              </nav>
              <div className="mt-auto space-y-8 px-8 pb-10 pt-10">
                {social.length > 0 && (
                  <div>
                    <p className="kicker mb-4">{followUs}</p>
                    <SocialLinks links={social} iconClassName="h-6 w-6" />
                  </div>
                )}
                <div>
                  <p className="kicker mb-4">Newsletter</p>
                  <NewsletterSignUp
                    formFieldsClassName="flex flex-wrap gap-2"
                    inputClassName="flex-1 min-w-[12rem]"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex flex-col items-center justify-center">
            <Link href="/" className="block">
              <img
                src={logoSrc(logo, 128)}
                alt={`${siteConfig.name}, home`}
                width={logo.width}
                height={logo.height}
                className={cn(
                  "w-auto transition-[height] duration-300",
                  collapsed ? "h-8 md:h-10" : "h-10 md:h-14"
                )}
              />
            </Link>
            {!collapsed && (
              <p className="mt-1 hidden font-display text-[0.8125rem] uppercase italic tracking-[0.16em] text-muted-foreground sm:block">
                {tagline}
              </p>
            )}
          </div>

          <button
            ref={searchButton}
            type="button"
            onClick={() => setSearching(true)}
            className="-mr-2 justify-self-end p-2 transition-colors hover:text-accent"
            aria-label="Open search"
            aria-expanded={searching}
          >
            <Search className="h-6 w-6" aria-hidden="true" />
          </button>

          {searching && (
            <form
              role="search"
              onSubmit={submitSearch}
              onKeyDown={(e) => e.key === "Escape" && closeSearch()}
              className="absolute inset-0 z-10 flex items-center gap-3 bg-background px-4 md:px-8"
            >
              <Search className="h-5 w-5 shrink-0" aria-hidden="true" />
              <label htmlFor="header-search" className="sr-only">
                Search stories
              </label>
              <input
                id="header-search"
                name="q"
                type="search"
                autoFocus
                placeholder={searchPlaceholder}
                className="min-w-0 flex-1 border-b border-foreground bg-transparent py-2 font-display text-xl italic placeholder:text-muted-foreground focus-visible:outline-none"
              />
              <Button type="submit" size="sm">
                Search
              </Button>
              <button
                type="button"
                onClick={closeSearch}
                className="p-2"
                aria-label="Close search"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </form>
          )}
        </div>

        {!collapsed && (
          <nav aria-label="Main" className="hidden md:block">
            <ul className="mx-auto flex w-max max-w-full gap-x-9 overflow-x-auto px-8 pb-4 pt-1">
              {menu.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <Link
                    href={item.href}
                    className="kicker whitespace-nowrap text-[0.8125rem] underline-offset-[6px] transition-colors hover:text-accent hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}

function AnnouncementBar({ text, url, background, color }: Announcement) {
  const className = cn(
    "flex h-9 shrink-0 items-center justify-center gap-2 px-4 text-center text-[0.8125rem] font-medium tracking-wide",
    !background && "bg-primary",
    !color && "text-primary-foreground"
  );
  const style = { backgroundColor: background, color };
  const content = <span className="truncate">{text}</span>;

  return url ? (
    <Link href={url} className={cn(className, "underline-offset-4 hover:underline")} style={style}>
      {content}
      <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    </Link>
  ) : (
    <p className={className} style={style}>
      {content}
    </p>
  );
}

function MenuItem({ item }: { item: NavLink }) {
  const [open, setOpen] = useState(false);
  const listId = useId();

  return (
    <li className="border-b border-foreground/15">
      <div className="flex items-center justify-between gap-4">
        <SheetClose asChild>
          <Link
            href={item.href}
            className="block py-3 font-display text-[1.75rem] uppercase leading-tight tracking-[0.04em] transition-colors hover:text-accent"
          >
            {item.label}
          </Link>
        </SheetClose>
        {item.children && (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls={listId}
            aria-label={`${item.label} links`}
            className="-mr-2 p-2"
          >
            <ChevronDown
              className={cn("h-5 w-5 transition-transform", open && "rotate-180")}
              aria-hidden="true"
            />
          </button>
        )}
      </div>
      {item.children && (
        <ul id={listId} hidden={!open} className="space-y-3 pb-5 pl-4">
          {item.children.map((child) => (
            <li key={`${child.label}-${child.href}`}>
              <SheetClose asChild>
                <Link
                  href={child.href}
                  className="underline-offset-4 transition-colors hover:text-accent hover:underline"
                >
                  {child.label}
                </Link>
              </SheetClose>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
