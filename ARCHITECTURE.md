# SwiftDrop — Trust, Payments & Pricing Architecture

This document explains how SwiftDrop is designed to be safe and fair for both
customers and riders. Some pieces are implemented; the payment/KYC integrations
are documented here as the production design (they need third-party providers).

## 1. Rider trust & safety (preventing theft / absconding)

A layered "trust stack" — no single feature, but together they make stealing a
bad deal:

| Layer | What it does | Status |
|---|---|---|
| **KYC + facial verification** | Riders verify a government ID (Ghana Card) + a **liveness selfie matched to the ID** before they can accept jobs. Use a provider — **Smile ID** (built for Africa), or Dojah, Prembly, Veriff, Onfido, Persona. You don't build face-matching yourself. | Onboarding flow (placeholder) + "Verified rider" badge |
| **Live GPS tracking** | Customer watches the rider move in real time; the platform records the route. | Map + tracking screen (simulated; wire to rider GPS) |
| **Delivery code** | An order can't be completed until the rider enters the customer's 4-digit code, **verified in the database** (`complete_delivery` RPC) — a rider can't fake delivery, and never sees the code. | ✅ Implemented |
| **Rider deposit / bond** | A small refundable bond held by the platform; forfeited on confirmed theft. | Design |
| **Ratings & reports** | Bad actors are flagged and removed. | Design |
| **Insurance / guarantee fund** | Covers the customer for the rare lost item, up to a cap. | Design |

## 2. Payments & escrow (the "buy me something" problem)

**Problem:** the customer pays for the goods, the rider buys and holds them — what
stops the rider running off with money *and* product?

**Solution — escrow + pay-on-delivery + rider float:**

1. The customer's payment is **held in escrow by the platform**, not handed to the rider.
2. The rider buys the item with a **platform-issued float / one-time payment** — not
   the customer's cash directly, and not their own money long-term.
3. The **reimbursement + delivery fee is released to the rider only after the customer
   confirms delivery** (the code).
4. If anything goes wrong, escrow **refunds the customer**.
5. An **item-value cap** (e.g. ≤ GHS 500) limits exposure on each errand.

So the rider never holds the customer's money, theft is deterred by verified
identity + tracking + payout-on-delivery, and the customer is protected by escrow +
insurance. This requires a payment provider (Hubtel / Paystack / Stripe) + a wallet/
escrow ledger — intentionally not bundled, so a buyer plugs in their own provider.

## 3. Pricing (fair, distance-based)

Flat pricing is unfair (far trips subsidised by near ones; riders skip far jobs).
SwiftDrop charges **base fare + per-km** (extendable to per-minute / zones / surge):

```
total = max(minFare, baseFare + distanceKm × perKm + sizeAddon)
```

- **Now:** distance is the **haversine** (straight-line) distance between pickup and
  drop-off, set by tapping a map. Free, no API key. See `src/lib/pricing.ts`.
- **Production:** swap in **Google Distance Matrix** (or Mapbox / OpenRouteService)
  for real road distance + duration, and add address autocomplete (Places).

## 4. Data security

- **Supabase Row Level Security:** customers only read/write their own orders &
  profile; riders read open jobs + their own deliveries **through a view that omits
  the delivery code** (`rider_jobs`); completion goes through a `SECURITY DEFINER`
  function that checks the code server-side.
- **Keys:** the publishable (anon) key ships in the app (protected by RLS); the
  secret key is never used client-side. Env vars are managed via EAS, not committed.

## 5. Production roadmap

1. Wire a KYC provider (Smile ID) into rider onboarding.
2. Payments + escrow wallet (Hubtel / Paystack) for goods & fees.
3. Real-time rider GPS → live customer tracking + live status.
4. Google Distance Matrix pricing + Places autocomplete.
5. Push notifications; ratings; dispute resolution; insurance fund.
