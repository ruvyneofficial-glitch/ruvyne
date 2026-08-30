<div align="center">

<h1>Ruvyne</h1>

<p>Beauty, Fashion &amp; Home</p>

</div>

Ruvyne is an editorial magazine site for beauty, fashion and home decor: articles, author profiles and podcast episodes. It is built on the Next.js App Router with React Server Components, TypeScript, Tailwind CSS and shadcn/ui, with end to end tests in Playwright.

## Getting started

```bash
npm install
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
json/         Article, author, podcast and news content
lib/          Site config, Zod schemas and shared utilities
public/       Images and self-hosted fonts
```

## Features

- App Router pages as React Server Components, with React Suspense and per route `loading.tsx` skeletons
- Article, author and podcast pages rendered from local JSON content
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

## Branding

All brand identity lives in one file, `lib/site.ts`. It exports the site name, tagline, production URL and default description. Every page title, the header and footer wordmarks, the composed covers, `robots.ts` and the sitemap read from it. Renaming the publication is a one file change.

The wordmark is set as live text in the site typeface rather than as an outlined SVG, so it always tracks `siteConfig`, and it stays selectable and translatable. `components/Wordmark.tsx` renders the name and `components/LogoMark.tsx` draws the mark alone.

Podcast and print covers are composed at runtime by `components/Cover.tsx` from an unbranded photograph, a duotone wash and a DOM text overlay, rather than shipping the name flattened into a JPEG.