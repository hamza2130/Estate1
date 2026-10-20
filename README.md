# Autostack AI: Real Estate Demo

A fully working real estate website with a public site, a listings API backed by PostgreSQL, and a password-protected admin panel. Built as a client demo under the placeholder brand **Autostack AI** (modelled on a Pakistani property agency: DHA, Bahria Town and Islamabad listings, PKR pricing in Lac/Crore, Marla/Kanal areas).

**Stack:** Next.js 15 (App Router, server actions) · React 19 · PostgreSQL (`pg`) · plain CSS. No other runtime dependencies.

## What's included

**Public website**
- Home: hero, buy/rent search, services, featured listings, the "Easy Option" concierge pitch, popular locations, 3-step legal verification, latest rentals, testimonials, FAQ, call-to-action
- `/properties`: search and filters (purpose, type, city, society, price range, bedrooms, keyword, sort) with pagination
- `/properties/[slug]`: photo gallery, price, facts, description, features, optional YouTube tour, enquiry form, call and WhatsApp buttons, similar properties
- `/services`, `/easy-option`, `/about` (CEO message, team, testimonials), `/contact` (form + map)
- Floating WhatsApp button, mobile menu, responsive layout

**Admin panel** (`/admin`)
- Login with signed, HTTP-only session cookie (passwords hashed with scrypt)
- Dashboard with listing and enquiry stats
- Properties: create, edit, delete, photo upload (stored in Postgres), choose cover photo, remove photos, mark featured, set status (available / sold / rented / draft)
- Enquiries from every site form: filter, change status, WhatsApp the lead, delete
- Site content: company name, tagline, phone, WhatsApp, email, address, hero text, about text, CEO, stats, social links
- FAQs, testimonials and team members: add, edit, delete
- Change admin password

**REST API**
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/properties` | public | List/search. Query: `purpose, type, city, society, minPrice, maxPrice, beds, q, featured, sort, page, limit` |
| POST | `/api/properties` | admin | Create (JSON or multipart with `images` files; JSON may include `image_urls`) |
| GET | `/api/properties/:id` | public | One property with images |
| PUT/PATCH | `/api/properties/:id` | admin | Update (partial updates allowed; `remove_image_ids`, `image_urls`) |
| DELETE | `/api/properties/:id` | admin | Delete |
| POST | `/api/inquiries` | public | Submit an enquiry |
| GET | `/api/inquiries` | admin | List enquiries |
| GET | `/api/images/:id` | public | Serve an uploaded photo |

Admin API calls use the same session cookie as the admin panel.

## Run it locally

Requirements: Node.js 20+ and PostgreSQL 14+ (or Docker).

```bash
npm install
cp .env.example .env            # edit DATABASE_URL / admin credentials if needed
docker compose up -d            # optional: starts Postgres on localhost:5432
npm run db:setup                # creates tables, admin user and demo content
npm run dev                     # http://localhost:3000
```

Admin: http://localhost:3000/admin with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env` (defaults `admin@autostack.ai` / `admin123`).

`npm run db:reset` wipes the database and reloads the demo content (handy before a client demo).

For production: `npm run build && npm start`.

## Deploy (Vercel + Neon, both free tiers)

1. Create a Postgres database on [Neon](https://neon.tech) and copy its connection string.
2. Run `DATABASE_URL="<neon url>" npm run db:setup` once from your machine.
3. Import this repo in Vercel and set `DATABASE_URL`, `SESSION_SECRET` (long random string) as environment variables.
4. Deploy. Uploaded photos are stored in the database, so no extra file storage is needed.

## Notes

- Demo photos in `public/demo` are generated illustrations (`node scripts/generate-demo-images.mjs`). Upload real photos from the admin panel to replace them.
- All names, phone numbers and addresses are placeholders. Change them from **Admin → Site Content**.
