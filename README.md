# Capia 3D

Source code for [www.capia3d.com](https://www.capia3d.com), a bilingual portfolio and marketing website for personalized 3D-printed objects.

The site presents Capia 3D's work, explains the custom design process, and directs visitors to Wallapop or WhatsApp. It does not process sales, payments, inventory, or customer accounts.

## Technology

- React 19 and Vite 7
- React Router
- Framer Motion and Lucide icons
- GitHub Pages

## Local development

Use Node.js 20, matching the deployment workflow.

```sh
npm ci
npm run dev
```

## Commands

```sh
npm run dev
npm run lint
npm run build
npm run preview
```

## Content model

- Spanish is served at `/`; English is served at `/en`.
- `src/content.js` contains localized site copy, external destinations, and portfolio-product stories.
- Spanish product pages use `/productos/:slug`.
- English product pages use `/en/products/:slug`.
- A product page explains the object, its uses, examples already created, personalization, and related work. It is not a purchasable SKU.
- `public/data/instagram.json` is the safe, public cache consumed by the Instagram section. Until automatic synchronization is configured, the site uses curated portfolio images as a fallback.

## Deployment

Pushes to `main` run `.github/workflows/deploy.yml` and publish `dist/` to GitHub Pages. The custom domain is configured through `public/CNAME`. SPA deep links rely on the redirect handshake between `public/404.html` and `index.html`.

See [AGENTS.md](./AGENTS.md) for detailed project conventions.
