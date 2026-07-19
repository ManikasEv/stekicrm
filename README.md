# STEKI Backoffice

Internal React/Vite application with two modules:

- Create a PDF location request for placing the STEKI food truck on a new site.
- Edit and publish the separate QR menu shown at `https://steki.ch/scanmenu`.

Protected with **Clerk** (email + password login only — no public signup).

## Development

```bash
npm install
cp .env.example .env   # set VITE_CLERK_PUBLISHABLE_KEY
npm run dev
npm run lint
npm run build
```

## Clerk setup (required once)

1. Clerk Dashboard → **User & authentication** → enable **Email** + **Password**, disable Google/social.
2. **Configure → Restrictions** → Sign-up mode: **Restricted** (no public signup).
3. **Users** → create your staff accounts manually (email + password).
4. **Configure → Domains / Allowed origins**: add `http://localhost:5173` and `https://stekicrm.netlify.app`.
5. Netlify (CRM site) env: `VITE_CLERK_PUBLISHABLE_KEY=pk_test_…` then redeploy.

`CLERK_SECRET_KEY` is not needed in this frontend app.

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
