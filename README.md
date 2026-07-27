# Pages Bulker — Gutters

Bulk landing-page generator for **Dream Team Roofing & Gutters**. Cloned from the roofing-focused `pages-bulker` project, swapped to MySQL, re-themed, and re-copied for gutter services.

## Stack

- Next.js 14 (App Router, server actions)
- Drizzle ORM on **MySQL** (`mysql2` driver)
- bcryptjs + signed JWT cookie for admin auth
- Tailwind CSS
- `xlsx` for bulk import/export

## First-time setup

1. **Install dependencies**
   ```
   npm install
   ```

2. **Create the MySQL database in Hostinger**
   - Hostinger panel → Databases → Management → create DB + user
   - Note the host, port (3306), database name, username, password

3. **Fill `.env`** (copy from `.env.example` if needed)
   ```
   DATABASE_URL=mysql://<user>:<password>@<host>:3306/<dbname>
   SESSION_SECRET=<32+ char random string>
   SITE_URL=https://dreamteamguttersfl.com
   SITE_NAME=Dream Team Roofing & Gutters
   ```
   A pre-generated `SESSION_SECRET` is already written to `.env`. Replace it for production if you want.

4. **Generate migrations and push schema**
   ```
   npm run db:generate
   npm run db:push
   ```
   If `db:push` complains about the connection, double-check `DATABASE_URL` and that Hostinger allows the connection (internal from your Hostinger Node app, or via Remote MySQL whitelist).

5. **Run locally**
   ```
   npm run dev
   ```
   Open http://localhost:3000.

## Admin

- Login: `/admin/login`
- The password is **not stored in this repo** — only its bcrypt hash, in
  `admin-secret.json`, which is gitignored. Never commit the plaintext.
- To set or change the password:
  ```
  npx tsx scripts/hash-password.ts "your-new-password"
  ```
  Paste the resulting hash into `admin-secret.json` under `passwordHash`.

## Deploying to Hostinger

- Use Hostinger's **Deployments** panel (Node app).
- Set the same env vars in the Hostinger "Environment variables" panel.
- The DB connection should use the Hostinger-internal MySQL host so you don't need to open Remote MySQL.

## Where things live

| File | Purpose |
|---|---|
| `app/page.tsx` | Public home page (uses `LocationTemplate` with `isHome`) |
| `app/[slug]/page.tsx` | Per-location landing page at the site root, with JSON-LD + SEO metadata |
| `app/locations/page.tsx` | Full directory of every published location |
| `app/not-found.tsx` | Branded 404 — what every mistyped URL renders |
| `components/ServiceAreas.tsx` | Home: links to every location. Inner pages: links to `/locations` |
| `app/admin/*` | Admin CRUD, bulk upload, login/logout |
| `db/schema.ts` | MySQL schema (`locations` table) |
| `lib/theme.ts` | Deterministic per-slug accent theme |
| `lib/variants.ts` | Deterministic per-slug layout/copy variants |
| `lib/copyPools.ts` | Hero H1 / sub / final CTA copy pools |
| `lib/reviewPool.ts` | Testimonial pool (⚠ currently invented — see below) |
| `lib/seo.ts` | Title/description fallbacks |
| `components/LocationTemplate.tsx` | The entire landing page composition |
| `components/sections/*` | Hero / Services / About / Process / Why / QuoteForm |
| `public/assets/placeholder.svg` | Branded placeholder used everywhere until real photos are dropped in |

## URL structure

Location pages are served from the **site root**: a location slugged `boca-raton`
lives at `https://<domain>/boca-raton`, not under a `/locations/` prefix.

Because slugs share the root namespace with real routes, these names are
**reserved** and cannot be used as a slug (see `RESERVED_SLUGS` in `lib/slug.ts`):

```
admin  locations  api  assets  _next  favicon.ico  robots.txt  sitemap.xml
```

Attempting to use one is rejected: the admin form shows an error, and bulk upload
records the row under "Skipped" with the reason. A slug left blank is derived from
the name and auto-suffixed (`admin` → `admin-2`) until it's free.

To add another reserved route later (say `/blog`), create the route **and** add
its name to `RESERVED_SLUGS` in the same change — otherwise an existing location
with that slug silently becomes unreachable.

## TODO before launch

These items are *intentionally generic or fabricated* in the current code and need to be confirmed against the real business before going live:

- [ ] **Real testimonials** in `lib/reviewPool.ts` — currently invented for layout. Replace with verified Google/Facebook reviews.
- [ ] **Warranty terms** in FAQ (`components/LocationTemplate.tsx`) — currently says "workmanship warranty on every installation" without a year count. Add the real number.
- [ ] **License number** — `CCC1334317` is carried over from the roofing site as a placeholder default. Confirm or replace in `LocationTemplate.tsx`, `app/page.tsx`, and the `app/api/upload/template/route.ts` sample row.
- [ ] **Financing partners** — copy says "$0 down, no credit check, 0% interest." Verify these terms match the actual financing offered.
- [ ] **Years in business / family-owned claims** — neutral in current copy. Add specifics if desired.
- [ ] **Real domain** — `SITE_URL` placeholder is `https://dreamteamguttersfl.com`. Register and update in `.env`.
- [ ] **Real images** — every image currently points to `/assets/placeholder.svg`. Drop real photos into `public/assets/` and update the paths in:
  - `components/LocationTemplate.tsx` (`DEFAULT_HERO`, `FINANCING_IMG`)
  - `components/ServiceAreas.tsx` (`SERVICE_AREA_IMG`)
  - `components/sections/About.tsx` (`ABOUT_IMG`)
  - `components/sections/Services.tsx` (per-service `img` paths)
- [ ] **Material partner names** — current footer/section lists generic gutter brands (Spectra, Berger, Englert, LeafFilter, Amerimax). Confirm or replace.

## Differences from the roofing project

- Drizzle dialect swapped from Postgres to MySQL
- Color tokens: navy shifted from `#0d2c4b` → `#102a43`; "gold" accent token now holds copper `#b87333` (token name kept to avoid refactor)
- All section copy rewritten for gutter context
- Service pool changed from 2 roofing items to 7 gutter items
- Sample seed data removed
- Hero/financing/service-area/per-service images replaced with one shared placeholder SVG
