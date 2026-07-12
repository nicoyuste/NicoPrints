# Capia 3D

Source code for [www.capia3d.com](https://www.capia3d.com), a Spanish-language storefront for 3D-printed products and custom design and printing work.

The site includes product collections, configurable product variants, a browser-persisted cart, and checkout through PayPal or email. It is a static application with no backend or database.

## Technology

- React 19 and Vite 7
- React Router
- Tailwind CSS
- Radix UI and shadcn-style components
- Framer Motion and Lucide icons
- GitHub Pages

The application uses JavaScript and JSX rather than TypeScript.

## Local development

Use Node.js 20, matching the version used by the deployment workflow.

```sh
npm ci
npm run dev
```

Vite prints the local development URL when the server starts.

## Available commands

```sh
npm run dev      # Start the Vite development server
npm run lint     # Run ESLint
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build locally
```

Before submitting a change, run:

```sh
npm run lint
npm run build
```

There is currently no automated test suite.

## Application structure

- `src/Shop3D.jsx` contains the site shell, routes, navigation, cart, and checkout flows.
- `src/data/products.js` is the canonical product catalog.
- `src/collections/` contains the bespoke collection pages.
- `src/components/` contains product views and shared UI components.
- `src/styles/tokens.css` defines the Capia 3D visual-design tokens.
- `public/products/` contains storefront product media.
- `public/` also contains standalone legal, materials, and custom-order pages.
- `public/oldborderscup/` is an independent static microsite.

The main storefront routes are:

- `/`
- `/taller`
- `/magic`
- `/:collectionId/:productSlug`
- `/gracias`
- `/cancelado`

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which installs dependencies, builds the application, and deploys `dist/` to GitHub Pages.

The custom domain is configured through `public/CNAME`. SPA deep links are supported by the redirect handshake between `public/404.html` and `index.html`; keep both files aligned when changing routing.

## Project guidance

Detailed architecture, catalog conventions, checkout constraints, analytics behavior, and instructions for coding agents are documented in [AGENTS.md](./AGENTS.md).
