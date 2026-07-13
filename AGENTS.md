# AGENTS.md

## Purpose

Capia 3D is a bilingual, image-led portfolio and marketing site for personalized 3D-printed objects. It should feel like a small creative studio, not an online store.

The site exists to show finished work, explain the personal design process, build trust, and direct visitors to external purchase/contact channels. Do not add a cart, checkout, prices, stock, user accounts, payment processing, or a complex SKU catalog.

The production site is `https://www.capia3d.com` and deploys to GitHub Pages from `main`.

## Commands

Use Node 20 and the npm lockfile.

```sh
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

Run lint and build before finishing code changes. There is no automated test suite, so perform focused browser checks for layout, routing, language switching, and the Comprar sheet when possible.

## Architecture

- `src/App.jsx`: layout, bilingual routes, homepage, generic product-story page, Instagram gallery, and Comprar sheet.
- `src/content.js`: localized copy, external links, and portfolio-product data.
- `src/index.css`: complete visual system and responsive layout.
- `public/v2/`: real examples of completed work, grouped by product or homepage section.
- `public/data/instagram.json`: public Instagram feed cache consumed by the homepage.
- `public/404.html` and `index.html`: GitHub Pages SPA deep-link restoration.

## Languages and routes

Spanish is the default at `/`; English is at `/en`. Do not automatically redirect based on browser language. Keep the language selector visible and map equivalent pages directly.

Product routes are:

- Spanish: `/productos/:slug`
- English: `/en/products/:slug`

All visible copy, metadata, labels, and alt text must exist in both languages. Add copy to the `es` and `en` branches in `src/content.js`; do not scatter translated strings through components.

## Product-story model

A product represents a reusable kind of custom work, not an inventory item. Each product page must explain:

- What the object is.
- What it can be used for.
- Examples already created.
- How it can be personalized.
- Related products at the bottom.

Every entry in `products` must have a unique URL-safe `slug`, a cover, a gallery of real work, localized content, and `related` slugs. Keep related references reciprocal when appropriate. Do not invent product claims or use stock/generated imagery as evidence of completed customer work.

Use `import.meta.env.BASE_URL` when rendering public assets. Keep image paths and filename casing correct for GitHub Pages.

## Purchase flow

The only dominant commercial CTA is `Comprar` / `Buy`. It opens a shared bottom sheet with:

- Wallapop: available products.
- WhatsApp: custom requests using a localized prefilled message.

External destinations live in `siteLinks` in `src/content.js`. Keep the sheet keyboard accessible, closable with Escape, and clear that both options leave the site. Etsy may be added later as another destination; do not add it before a real URL is provided.

## Instagram

The homepage reads Instagram posts from `public/data/instagram.json` and falls back to curated local examples if the cache is empty or unavailable.

The Instagram account is `https://www.instagram.com/capia3d` and is a Business profile. Automatic synchronization must use Meta's professional API outside the browser. Never expose an Instagram access token in React, a public JSON file, logs, or Git history. The intended implementation is a scheduled GitHub Action that reads a repository secret and writes a sanitized public cache. Preserve the last successful cache when Meta is unavailable.

## Design direction

Use real product photography, large type, generous whitespace, warm neutral backgrounds, Capia blue for primary actions, and restrained motion. Animations must support the content and respect `prefers-reduced-motion`.

Customer-facing copy is warm, direct, and maker-led. Spanish and English should read naturally rather than as literal translations. The primary visual hierarchy is work → process → trust → external action.

## Deployment discipline

Pushing to `main` deploys the site. Do not push or deploy unless explicitly asked. Preserve `public/CNAME`, `robots.txt`, `sitemap.xml`, and the SPA 404 mechanism. Keep unrelated user changes intact and never commit secrets, private customer information, `node_modules`, or `dist`.
