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

The CRM sends menu changes to `https://steki.ch/api/menu`. Enter the same private
token that is configured as `MENU_ADMIN_TOKEN` in the main website's Netlify
environment variables.

For a different API URL, create a local `.env` file:

```text
VITE_MENU_API_URL=https://steki.ch/api/menu
```

The QR code always points to `https://steki.ch/scanmenu` and can be downloaded
as an SVG suitable for printing. The admin token is retained only for the
current browser tab (`sessionStorage`) and is never included in the QR code.
# stekicrm
