<div align="center">

<img src="public/logo.svg" alt="" width="200" height="200" />

<h1>Ruvyne</h1>

<p>Beauty, Fashion &amp; Home</p>

</div>

Ruvyne is an editorial magazine site for beauty, fashion and home decor: articles, author profiles and podcast episodes. It is built on the Next.js App Router with React Server Components, TypeScript, Tailwind CSS and shadcn/ui, with end to end tests in Playwright.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in the Sanity values
npm run dev
```

The dev server runs at http://localhost:3000.

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint via `next lint` |
| `npm run test:e2e` | Run the Playwright end to end suite |

`npm install` also runs `husky install`, which wires the pre commit hook in `.husky/pre-commit`.

Before deploying, set the production domain in `lib/site.ts`. The current value is a placeholder and feeds both `app/robots.ts` and the generated sitemap.

## Routes

| Route | Page |
| --- | --- |
| `/` | Home: featured story, news ticker, latest stories with sidebar, one section per category, newsletter, team |
| `/magazine` | Article index with category tabs and Newest, Oldest, A to Z and Z to A sorting |
| `/magazine/[title]` | Article detail, with social sharing and previous or next navigation |
| `/podcasts` | Switched off, returns 404 (see below) |
| `/podcasts/[title]` | Switched off, returns 404 (see below) |
| `/authors` | Author index |
| `/authors/[author]` | Author profile and their articles |
| `/search` | Story search, opened from the magnifier in the header |
| `/[slug]` | Free-form pages made in the Studio (About, Contact, Privacy…) |
| `/api/subscribe` | POST route that validates newsletter signups server side |
| `*` | Custom 404 page |

`app/robots.ts` and `app/sitemap.ts` emit `robots.txt` and the sitemap as route handlers. The sitemap is generated from the content data, so article, author and episode slugs cannot drift out of sync with the pages.

## Project layout

```
app/          App Router pages, route handlers, robots and sitemap
app/functions Data access and formatting helpers
components/   UI components, including components/ui (shadcn/ui primitives)
context/      Article and podcast context providers
hooks/        Custom hooks that read the context stores
json/         Seed content, and the fallback used if Sanity is unreachable
lib/          Site config, Sanity client, Zod schemas and shared utilities
sanity/       Content schemas (author, article, podcast, newsItem, siteSettings)
public/       Images and self-hosted fonts
```

## Features

- App Router pages as React Server Components, with React Suspense and per route `loading.tsx` skeletons
- Article, author and podcast content managed in Sanity, with the bundled JSON as an offline fallback
- Byrdie style chrome: a sticky header (menu, centred logo and tagline, search, and on desktop a row of the menu's links) that slims down on scroll, and a slide-out menu panel with expandable categories, social links and newsletter signup
- Category filtering and sorting on the magazine index, and a search page
- React Context providers for article and podcast data, read through custom hooks
- Newsletter signup using React Hook Form with a Zod schema, validated again server side in `app/api/subscribe`
- shadcn/ui components on Radix primitives for accessible dialogs, sheets and inputs
- Tailwind CSS, mobile first
- GSAP for the horizontal sliding ticker text
- TypeScript throughout
- Playwright end to end tests across multiple browsers, with accessibility assertions via `@axe-core/playwright`
- Husky pre commit hook running lint and tests
- Custom designed 404 page

## Content

Content lives in Sanity. The schemas are in `sanity/schemas`: `article`, `category`, `author`, `page`, `podcast` (switched off), `newsItem` and `siteSettings`, plus the shared `richText`, `seo` and `socialLink` types.

The seed set is 6 authors, 30 articles balanced across Beauty, Fashion and Home Decor, 5 podcast episodes and 3 ticker lines.

Podcasts are switched off. Every place that used them is commented out and marked `Podcasts are switched off`: the homepage section, the two `app/podcasts` routes (now stubs that return 404), the sitemap, the menu and footer defaults, the Site settings fields and the Studio list. The components, `getPodcasts` and the `podcast` schema are untouched and the episodes are still in Sanity, so search for that marker and uncomment to bring them back.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Project id. Public identifier, safe in the bundle |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset name, normally `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | API version date |

Every variable is public by design. The site never writes to Sanity, so no write token is needed or stored anywhere. Content is edited in the Studio at `/studio`, which authenticates each editor through their own Sanity login.

Reads go through `lib/sanity.client.ts`, which queries the public API over plain `fetch` and sends no token at all. The dataset ACL is public, so reads are unauthenticated and served from the CDN. This avoids `@sanity/client` inside the app on purpose: the providers in `context/` are client components, and the SDK's Node build pulls in `undici`, whose private class fields cannot be parsed by the webpack client bundler.

The getters in `app/functions/` are an adapter. They query Sanity and rebuild the exact nested shape the pages already expect, including the fixed 5-slot positional `content` array. That is why moving to a CMS needed no component changes. Rendered output was diffed page by page before and after the switch, and the visible text was identical on every route.

If a query fails, each getter falls back to the JSON in `json/`. That matters because `app/sitemap.ts` and the three `generateMetadata` functions call the getters at build time, where an uncaught error would fail the entire build rather than one page. Verified by building against a deliberately invalid project id: the build still succeeds.

### Images

Images are Sanity assets. Editors upload them in the Studio and never touch the codebase or a file path. They are served from `cdn.sanity.io`, which is the single entry in `images.remotePatterns` in `next.config.js`; `next/image` rejects any host not listed there.

The getters fetch the image fields whole and build URLs with `@sanity/image-url` (`lib/image.ts`), so the crop an editor sets is baked into the URL and their focal point becomes the CSS `object-position` of cropped images.

Every image field is marked required in the schema. If one is somehow empty, the getter falls back per image to the bundled copy under `public/`, because `next/image` throws on an empty `src` and would take out the whole page rather than one picture. That is also why `public/images` is still in the repo.

`siteSettings` is a single document, Site settings in the Studio, split into tabs: logo, footer logo, favicon, tagline, description and sharing image; colours; the menu and social accounts; the homepage (featured story, Most popular list, category sections, team order); words on the site (`lib/words.ts` holds the defaults); the announcement bar; footer links; and the print edition. Every field is optional apart from the print edition, and anything left empty falls back to the defaults in `app/functions/getSiteSettings.ts`.

Categories are documents, so editors can add or rename one and the menu, footer, magazine tabs, homepage sections and Studio lists follow. Articles have a rich text Body (headings, links, lists, images, pull quotes and YouTube, Vimeo, Spotify, Instagram or TikTok embeds), rendered by `components/RichText.tsx`. Stories, authors and pages each have a Search & sharing box (Google title, description, sharing image, hide from Google), and authors have their own social accounts for the Follow icons.

Each list in the Studio can be sorted from its sort menu (newest or oldest, A to Z or Z to A, and so on, defined as `orderings` on each schema). Articles can also be browsed by category and by author (`sanity/structure.ts`).

Fetches revalidate every 60 seconds, so Studio edits reach the site within about a minute.

### One-time content upgrades

Documents written before these features hold their data in the old shape, and the site reads both shapes until they are converted:

- `iso-dates`: dates typed as text (`12 August 2026`) become `2026-08-12`, the format the Studio date picker saves, so the Studio sorts by date correctly (`lib/dates.ts` parses both).
- `categories`: the category text on each article becomes a link to a new Category document (Beauty, Fashion, Home Decor), so categories can be renamed or added.
- `rich-text`: the five fixed text fields of each article move into the rich text Body, in the order the article page showed them (`lib/legacyBody.ts`, shared with the site).

Each one is safe to run twice and skips documents that are already converted. Run each without `--no-dry-run` first to see what it would change:

```bash
npx sanity login
npx sanity migration run iso-dates --no-dry-run
npx sanity migration run categories --no-dry-run
npx sanity migration run rich-text --no-dry-run
```

## Branding

`lib/site.ts` holds the site name, default tagline, production URL and default description, plus the article categories, page list and social platforms that both the Studio and the site read.

The logo, footer logo, favicon, tagline and colours are edited in the Studio. The built-in defaults live in `public/brand/` (header lockup, light footer logo, mark), `public/favicon.png` and `public/apple-touch-icon.png`, all cut from `public/logo.svg` with a transparent background.

Colours come from `lib/theme.ts`: three presets (Ruvyne ivory, olive and bronze, which matches the logo; Classic black and white; Blush) that the editor can pick from and override colour by colour. `app/layout.tsx` turns the result into the CSS variables Tailwind reads, button text picks light or dark automatically, and the Studio warns when a chosen text colour is hard to read on its background.

Podcast and print covers are composed at runtime by `components/Cover.tsx` from an unbranded photograph, a duotone wash and a DOM text overlay, rather than shipping the name flattened into a JPEG.