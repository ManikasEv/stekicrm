# STEKI Backoffice

Internal React/Vite application with two modules:

- Create a PDF location request for placing the STEKI food truck on a new site.
- Edit and publish the separate QR menu shown at `https://steki.ch/scanmenu`.

## Development

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Publishing the QR menu

Edit items in the CRM, then click **Änderungen speichern**. No token field —
the CRM uses a built-in key that must match the website Netlify env var:

```text
MENU_ADMIN_TOKEN=StekiMenuPublish2026!
```

Optional CRM overrides (`.env`):

```text
VITE_MENU_API_URL=https://steki.ch/api/menu
VITE_MENU_ADMIN_TOKEN=StekiMenuPublish2026!
```

The QR code points to `https://steki.ch/scanmenu` and can be downloaded as SVG.
