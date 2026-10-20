import Link from "next/link";
import NewsletterSignUp from "./NewsletterSignUp";
import SocialLinks from "./SocialLinks";
import { siteConfig } from "@/lib/site";
import { logoSrc } from "@/lib/utils";
import type { SiteSettings } from "@/app/functions/getSiteSettings";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const { footerLogo, tagline, social, footerLinks } = settings;

  return (
    <footer className="mt-16 bg-footer text-footer-foreground md:mt-24">
      <div className="mx-auto grid max-w-[95rem] gap-12 px-6 py-14 md:px-8 lg:grid-cols-2 lg:py-20">
        <div className="flex flex-col items-start gap-6">
          <Link href="/" className="block">
            <img
              src={logoSrc(footerLogo, 320)}
              alt={`${siteConfig.name}, home`}
              width={footerLogo.width}
              height={footerLogo.height}
              loading="lazy"
              className="h-32 w-auto md:h-40"
            />
          </Link>
          <p className="font-display text-xl italic">{tagline}</p>
          <SocialLinks links={social} />
        </div>
        <div className="lg:pt-4">
          <h2 className="font-display text-[2.25rem] leading-tight md:text-[2.75rem]">
            {settings.newsletterHeading}
          </h2>
          <p className="mb-6 mt-3 opacity-85">{settings.newsletterText}</p>
          <NewsletterSignUp
            formFieldsClassName="flex flex-wrap gap-3"
            inputClassName="max-w-[22rem] flex-1 border-footer-foreground/60 bg-transparent text-footer-foreground placeholder:text-footer-foreground/75 focus-visible:ring-footer-foreground focus-visible:ring-offset-footer"
            buttonClassName="bg-footer-foreground text-footer hover:bg-footer-foreground/90"
          />
        </div>
      </div>
      <div className="mx-auto max-w-[95rem] px-6 md:px-8">
        <nav aria-label="Footer" className="border-t border-footer-foreground/25 py-10">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
            {footerLinks.map((link) => (
              <li key={`${link.label}-${link.href}`}>
                <Link href={link.href} className="kicker underline-offset-4 hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="border-t border-footer-foreground/25 py-6 text-sm opacity-85">
          &copy; {new Date().getFullYear()} {settings.copyright}
        </p>
      </div>
    </footer>
  );
}
