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
| `/` | Home: cover, news ticker, latest articles, latest podcasts, newsletter signup |
| `/magazine` | Article index with category filtering |
| `/magazine/[title]` | Article detail, with social sharing and previous or next navigation |
| `/podcasts` | Podcast episode list |
| `/podcasts/[title]` | Episode detail |
| `/authors` | Author index |
| `/authors/[author]` | Author profile and their articles |
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
- Category filtering on the magazine index
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

Content lives in Sanity. The schemas are in `sanity/schemas`: `author`, `article`, `podcast`, `newsItem` and `siteSettings`.

The seed set is 6 authors, 30 articles balanced across Beauty, Fashion and Home Decor, 5 podcast episodes and 3 ticker lines.

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

The getters resolve each reference to a URL with `img.asset->url`, so components still receive a plain `src` string and did not change.

Every image field is marked required in the schema. If one is somehow empty, the getter falls back per image to the bundled copy under `public/`, because `next/image` throws on an empty `src` and would take out the whole page rather than one picture. That is also why `public/images` is still in the repo.

`siteSettings` is a single document holding the print edition issue number and cover, which were previously hardcoded in the sidebar.

## Branding

All brand identity lives in one file, `lib/site.ts`. It exports the site name, tagline, production URL and default description. Every page title, the header and footer wordmarks, the composed covers, `robots.ts` and the sitemap read from it. Renaming the publication is a one file change.

The wordmark is set as live text in the site typeface rather than as an outlined SVG, so it always tracks `siteConfig`, and it stays selectable and translatable. `components/Wordmark.tsx` renders the name and `components/LogoMark.tsx` draws the mark alone.

Podcast and print covers are composed at runtime by `components/Cover.tsx` from an unbranded photograph, a duotone wash and a DOM text overlay, rather than shipping the name flattened into a JPEG.