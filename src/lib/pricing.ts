/**
 * Distance-based delivery pricing. Uses the haversine (straight-line) distance
 * between two coordinates — free, no API key. Swap in a routing API (e.g. Google
 * Distance Matrix) later for real road distance/time.
 */

export type Coord = { latitude: number; longitude: number };

const EARTH_KM = 6371;

export function haversineKm(a: Coord, b: Coord): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.sqrt(h));
}

export const PRICING = {
  baseFare: 8, // GHS — covers pickup
  perKm: 2.5, // GHS per km
  minFare: 12, // GHS floor
  sizeAddon: { small: 0, medium: 6, large: 14 } as Record<string, number>,
};

export type Quote = { ready: boolean; km: number; total: number };

export function quotePackage(pickup: Coord | null, dropoff: Coord | null, sizeId: string): Quote {
  if (!pickup || !dropoff) return { ready: false, km: 0, total: 0 };
  const km = haversineKm(pickup, dropoff);
  const addon = PRICING.sizeAddon[sizeId] ?? 0;
  const raw = PRICING.baseFare + km * PRICING.perKm + addon;
  return { ready: true, km, total: Math.max(PRICING.minFare, Math.round(raw)) };
}
