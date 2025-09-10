# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Prompt para añadir un producto.
Necesito que me ayudes a añadir el siguiente producto al catalogo.

[Descripcion de producto]. Crea la descripcion para ello.

Precio es: 
Material es:

Image principal esta en: 
Imagen para color con referencia [RED] esta en:

## Google Analytics (GA4)

### Qué usamos
- GA4 con `gtag.js` cargado en `index.html`.
- Page views manuales para SPA con rutas por hash.

### Dónde está y cómo se configura
- `index.html`: incluye el script de GA4 con Measurement ID. Cambiar `G-86JXT84TKQ` si fuese necesario.
- `src/lib/utils.js`:
  - `initHashPageviewTracking()`: envía `page_view` en la carga inicial y en `hashchange`.
  - `trackPageViewGA4(path?)`: helper para enviar page_view.
  - `trackEventGA4(eventName, params)`: helper genérico para eventos.
- `src/main.jsx`: llama a `initHashPageviewTracking()` al iniciar la app.

### Qué se envía
- `page_view` con parámetros: `page_title`, `page_location`, `page_path` (incluye `/#taller`, `/#magic`, `/#p/<slug>`, etc.).
- Eventos personalizados:
  - `add_to_cart`: al añadir al carrito.
  - `pay_with_paypal`: al pulsar pagar con PayPal (antes del redirect).
  - `buy_with_email`: al pulsar reservar por email (antes de abrir mailto).
- Parámetros típicos de eventos: `currency`, `value`, `items[{ item_id, item_name, quantity }]`.

### Campañas (UTM)
- Usa parámetros UTM en los enlaces de campaña: `utm_source`, `utm_medium`, `utm_campaign` (opcional `utm_content`, `utm_term`).
- Ejemplo: `https://www.nicoprints.com/#magic?utm_source=instagram&utm_medium=social&utm_campaign=lanzamiento_magic`.

### Verificación
- GA4 → Realtime: ver `page_view` y eventos anteriores.
- Marca `pay_with_paypal` y/o `buy_with_email` como conversiones si procede.
