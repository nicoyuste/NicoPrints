# AGENTS.md

## Project overview

Capia 3D is a Spanish-language storefront for 3D-printed products and custom 3D design/printing work. The owner designs and prints the products. Preserve the small-business tone: direct, practical, and written in Spanish for customers.

The production site is `https://www.capia3d.com`. It is deployed to GitHub Pages from `main` by `.github/workflows/deploy.yml`.

## Technology

- React 19 and Vite 7, using JavaScript and JSX rather than TypeScript.
- React Router with browser/path routing.
- Tailwind CSS 3 and CSS custom properties.
- shadcn-style components in `src/components/ui/`, backed by Radix UI.
- Framer Motion for cart animations and Lucide for icons.
- No backend, application database, or server-side checkout.
- Product and checkout state lives in the browser; the cart is persisted in `localStorage` under `cart3d`.

Use the `@/` alias for files under `src/`.

## Commands

Use the repository's npm lockfile and Node 20, which is also the version used by GitHub Actions.

```sh
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

Before finishing a code or catalog change, run at least `npm run lint` and `npm run build`. If dependencies are missing, run `npm ci` first. Do not claim that checks passed when they could not be run.

There is no automated test suite. For routing, checkout, responsive layout, or product-configuration changes, also perform focused browser verification when a browser is available.

## Repository map

- `src/main.jsx`: React entry point and `BrowserRouter` setup.
- `src/App.jsx`: application root wrapper.
- `src/Shop3D.jsx`: site shell, home page, routes, navigation, cart, and checkout flows.
- `src/data/products.js`: canonical product catalog and `productBySlug` lookup.
- `src/collections/Magic.jsx`: bespoke Magic collection page and its subsections.
- `src/collections/Taller.jsx`: bespoke workshop/organization collection page.
- `src/components/ProductCard.jsx`: catalog card and starting-price display.
- `src/components/ProductDetail.jsx`: product gallery, variants, pricing, and add-to-cart behavior.
- `src/colors.js`: selectable print colors grouped by material.
- `src/config.js`: contact, PayPal, shipping, and WhatsApp settings.
- `src/styles/tokens.css`: Capia design tokens.
- `src/components/ui/`: shared UI primitives; keep their APIs compatible with current callers.
- `public/`: copied verbatim to the built site; includes product media and standalone HTML pages.
- `public/oldborderscup/`: independent static microsite. It is not part of the React UI.
- `prompts/`: historical/ad-hoc prompts, not authoritative project documentation.

## Routing and GitHub Pages

The application uses `BrowserRouter` with `basename={import.meta.env.BASE_URL}`. It does not use hash routing.

Current React routes are:

- `/` — home.
- `/taller` — workshop and organization collection.
- `/magic` — Magic: The Gathering collection.
- `/:collectionId/:productSlug` — product detail.
- `/gracias` and `/cancelado` — PayPal return states rendered over the home page.
- Any other React route — in-app not-found page.

Product links must include both the product's `collectionId` and `slug`. `ProductDetail` verifies that the product belongs to the collection in the URL.

GitHub Pages cannot directly serve arbitrary SPA paths. `public/404.html` redirects deep links to `/?redirect=<original-path>`, and the inline script in `index.html` restores that path with `history.replaceState`. Preserve both sides of this mechanism when changing routing.

Standalone pages such as `/encargos.html` bypass React and are served directly from `public/`.

The Vite development server has a special rewrite for `/oldborderscup` to `/oldborderscup/index.html`. Preserve this if changing `vite.config.js`.

## Product catalog

`src/data/products.js` is the single source of truth for storefront products. Collection pages filter this array; do not duplicate product arrays inside collection components.

Every product must have:

- `slug`: globally unique, lowercase, URL-safe identifier.
- `collectionId`: an existing collection route such as `taller` or `magic`.
- `name`, `currency`, `description`, `category`, and `material`.
- `images`: an array of objects with at least `src`.
- Either a numeric `price` or a valid trait-based price configuration.

Common optional fields are:

- `collectionSection`: grouping within a bespoke collection page. Magic currently uses `deck-box-bisagra`, `deck-box-imanes`, and `separadores`.
- `longDescription`: trusted HTML rendered with `dangerouslySetInnerHTML`; never insert untrusted/user-provided HTML. Internal `encargos.html` links are normalized by `ProductDetail`.
- `otherImages`: customer-personalization gallery, using the same `{ src }` shape.
- `crossReferences`: array of other product slugs. Add reciprocal references when the relationship should work in both directions.
- `allowColorSelection: false`: disables the normal color selector.
- `parts`: independently configurable product pieces.
- `traits`: options that select a variant and/or modify price.

Use `import.meta.env.BASE_URL` for assets referenced from React:

```js
{ src: `${import.meta.env.BASE_URL}products/example/example_1.png` }
```

Store storefront product media under `public/products/`. Keep filenames and paths case-correct because GitHub Pages runs on a case-sensitive filesystem.

### Parts and colors

A configurable part has this shape:

```js
{ id: 'lid', label: 'Tapa', materials: ['PLA', 'PLA Mate'] }
```

Part IDs must be stable because they are included in cart line keys. Available colors come from `src/colors.js` and are matched by exact material name. A product with parts requires a color selection for every part before it can be added to the cart.

### Traits and pricing

Traits use stable `id` and option `value` strings. Each trait should have one sensible default option; without an explicit default, the first option is selected.

- A `mode: 'base'` trait replaces the product's base price with the selected option's numeric `price`.
- A `mode: 'addon'` trait adds to the base price.
- An add-on price can be a number or an object keyed by the selected base trait value, for example `price: { '60': 0.5, '100': 1.0 }`.
- Images may declare `traits: ['value', ...]`; the gallery shows images matching every selected trait value and falls back to all images if none match.

When changing this schema, update both `ProductCard` starting-price calculation and `ProductDetail` selected-price calculation. Keep cart serialization in `Shop3D.jsx` compatible with existing local-storage entries where practical.

### Adding a product

1. Add optimized media under `public/products/`, preferably in a directory named after the slug.
2. Add the product to `src/data/products.js` with a unique slug and valid collection.
3. Add `collectionSection` if the collection page groups products by section.
4. Add reciprocal `crossReferences` where appropriate.
5. Verify the collection card, detail URL, gallery, variant selection, computed price, and cart line.

## Collections

Collection pages are intentionally bespoke rather than generated from a universal template. Each lives under `src/collections/`, receives `onAdd`, filters the centralized catalog, and renders `ProductCard`.

When adding a collection:

1. Create `src/collections/<Name>.jsx` with `export default function Name({ onAdd })`.
2. Choose a lowercase URL-safe `collectionId` and use it on every product.
3. Add the route, navigation links, and home collection card in `src/Shop3D.jsx`.
4. Add relevant public assets and sitemap entries.
5. Verify direct navigation and GitHub Pages deep-link restoration.

## Cart and checkout invariants

- The fixed shipping fee comes from `SHIPPING_FEE_EUR`; it is charged once when the cart is non-empty.
- The UI currently states that shipping is limited to mainland Spain. Keep customer-facing shipping language aligned with checkout behavior and metadata.
- Cart lines are distinguished by product plus selected materials, colors, parts, and traits. Do not merge differently configured products.
- PayPal checkout uses the legacy hosted `_xclick` URL and `PAYPAL_BUSINESS_EMAIL`; there is no server-side order validation.
- Email checkout opens a prefilled `mailto:` to `CONTACT_EMAIL`.
- PayPal return and cancellation URLs must continue to match `/gracias` and `/cancelado`.
- Never commit real customer information, order contents, API secrets, or private payment credentials.

## Analytics

GA4 is loaded in `index.html` with automatic page views disabled. `src/lib/usePageView.js` sends manual page views on React Router pathname/search changes through helpers in `src/lib/utils.js`.

Existing commerce/contact events include:

- `add_to_cart`
- `pay_with_paypal`
- `buy_with_email`
- `contact_whatsapp_click`

Preserve event names and useful parameters unless deliberately changing the analytics contract. Do not reintroduce hash-based tracking. Campaign URLs may use `utm_source`, `utm_medium`, `utm_campaign`, and optionally `utm_content` or `utm_term`.

## Visual design and content

Use semantic Tailwind token classes such as `bg-background`, `text-muted-foreground`, `border-border`, and `bg-primary`. Avoid hardcoded colors unless a design genuinely needs a standalone branded treatment.

Core brand colors in `src/styles/tokens.css` are:

- Primary blue: `#1F6AE1`.
- Graphite: `#1E1E1E`.
- Warm white: `#F6F6F4`.
- Technical gray: `#8A8F98`.
- Soft blue: `#A9C4F8`.
- Orange accent: `#FF9F43`.

The intended balance is mostly light backgrounds, graphite/gray for hierarchy, blue for primary actions, and orange only as a small accent. Maintain responsive behavior and keyboard-visible focus styles. Respect reduced-motion preferences.

Customer-facing copy should be Spanish. Preserve product facts and do not invent materials, compatibility, stock, shipping promises, prices, or performance claims.

## Standalone public pages

`public/encargos.html`, `materiales.html`, `privacidad.html`, and `aviso-legal.html` are standalone documents with inline styles/scripts. Changes to React components do not affect them. When shared contact details or branding change, search both `src/` and `public/` for duplicated values.

`public/oldborderscup/` is a self-contained event site with its own HTML, CSS, and images. Avoid applying storefront refactors to it unless the task explicitly includes that microsite.

Keep `public/CNAME`, `robots.txt`, `sitemap.xml`, `404.html`, and legal pages in the build output.

## Deployment and change discipline

Pushing to `main` triggers `npm ci`, `npm run build`, and GitHub Pages deployment. Do not push or deploy unless the user explicitly asks.

Keep changes focused. Do not edit generated dependencies or commit `node_modules`/`dist`. Preserve unrelated user changes in a dirty working tree. When behavior and documentation disagree, verify the implementation first, update the implementation only when requested, and keep this file synchronized with the resulting behavior.
