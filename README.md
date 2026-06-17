# SwiftDrop 🛵

A polished, cross-platform **errand & delivery** app built with Expo / React Native, TypeScript and Supabase. Customers send parcels or have a rider buy what they need; riders accept jobs and deliver them — confirmed with a secure delivery code.

> Built as a portfolio / white-label product. Payments are intentionally left unintegrated so a buyer can plug in their own provider (mobile money, Stripe, etc.).

## Features

- **Two errand types** — “Send a package” and “Buy me something” (a rider buys and delivers it)
- **Accounts & cloud sync** — email/password auth; orders and profile sync across devices (Supabase)
- **Live order tracking** — map with pickup/drop-off pins and an animated rider marker
- **Rider mode** — see open jobs, accept, update status, and complete with the customer’s 4-digit code (verified server-side)
- **Delivery code security** — an order can’t be marked delivered without the customer’s code
- **Motion & design system** — animated “aurora” background, glassmorphism cards, scroll-reveal, staggered entrances, skeleton loaders, animated counters, haptics — all 60fps and **reduced-motion aware**
- **Light & dark mode**

## Tech stack

- **Expo SDK 54**, **React Native 0.81**, **Expo Router** (file-based routing)
- **TypeScript**
- **Supabase** — Auth, Postgres, Row Level Security
- `react-native-maps`, `expo-blur`, `expo-linear-gradient`, `expo-haptics`

## Getting started

```bash
npm install
```

1. Create a free Supabase project, then copy `.env.example` → `.env` and fill in:
   - `EXPO_PUBLIC_SUPABASE_URL` — your project URL (`https://<ref>.supabase.co`)
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` — the **publishable** (anon) key
2. In the Supabase SQL Editor, run **`supabase-schema.sql`**, then **`supabase-rider-migration.sql`**.
3. Start it:
   ```bash
   npx expo start -c
   ```
   Scan the QR code with **Expo Go** (iOS/Android). The app runs in local mode even without Supabase keys.

## Project structure

```
src/
  app/            # screens (Expo Router): tabs, new-delivery, buy-me, track, rider, sign-in, ...
  components/     # aurora, motion system, confetti, delivery-map (+ .web stub)
  lib/            # supabase client, auth, orders, profile, motion presets
  constants/      # theme tokens, mock data
supabase-schema.sql            # profiles + orders tables, Row Level Security
supabase-rider-migration.sql   # rider columns, rider RLS, secure complete_delivery() RPC
```

## Notes for production

- **Maps:** free to test in Expo Go (no key). Store builds need a Google Maps API key (`android`/`ios` config in `app.json`) and a development/EAS build.
- **Payments:** add the buyer’s provider at checkout (`new-delivery` / `buy-me`).
- **Possible next steps:** payments, push notifications, real-time tracking from the rider’s live location, restaurant/menu mode.

---

Made in Ghana 🇬🇭
