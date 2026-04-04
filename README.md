# Glow With Lucy

Luxury candle website and custom staff dashboard for Glow With Lucy.

## App

- Frontend app: `frontend`
- Storefront routes:
  - `/`
  - `/shop`
  - `/cart`
  - `/checkout`
- Staff routes:
  - `/staff/login`
  - `/staff`

## Local Development

- App directory: `frontend`
- Start locally: `cd frontend && npm install && npm start`
- Production build: `cd frontend && npm install && npm run build`

## Cloudflare Data Layer

This project now includes:

- Cloudflare Pages Functions under `frontend/functions`
- D1 schema file at `frontend/schema.sql`
- Staff session auth using secure cookies
- Product management
- Discount code management
- Order management

### Required Cloudflare setup

1. Create a D1 database
2. Apply the schema from `frontend/schema.sql`
3. Bind that database to the Pages project as `DB`
4. Add staff secrets:
   - `STAFF_EMAIL`
   - `STAFF_PASSWORD`
5. Add email and payment secrets:
   - `STRIPE_SECRET_KEY`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `ORDER_NOTIFICATION_EMAIL` (optional, defaults to `lucyd789@sky.com`)

### Example D1 commands

```bash
cd /Users/david/Desktop/GlowWithLucy/frontend
npx wrangler d1 create glow-with-lucy
npx wrangler d1 execute glow-with-lucy --file=schema.sql
```

## Cloudflare Pages

- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Build output directory: `build`
- D1 binding: `DB`
- Staff secrets:
  - `STAFF_EMAIL`
  - `STAFF_PASSWORD`
- Payment and email secrets:
  - `STRIPE_SECRET_KEY`
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
  - `ORDER_NOTIFICATION_EMAIL`

## Notes

- Orders currently enter the system as `pending` payment and `new` status.
- Paid orders can send admin and customer emails through Resend when configured.
- Lucy can update products, manage discount codes, and change order statuses from the staff dashboard.
- If you want online card payments next, the safest follow-up is integrating Stripe Checkout while keeping the custom admin and order logic in this repo.
