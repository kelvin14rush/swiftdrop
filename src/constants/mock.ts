/**
 * Lightweight data for the errand-style app. No restaurants/menus needed —
 * the customer tells us what they want and a rider handles it.
 */

export type PackageSize = {
  id: string;
  label: string;
  hint: string;
  emoji: string;
  baseGHS: number;
};

export const PACKAGE_SIZES: PackageSize[] = [
  { id: 'small', label: 'Small', hint: 'Documents, phone', emoji: '📄', baseGHS: 10 },
  { id: 'medium', label: 'Medium', hint: 'Shoebox, food pack', emoji: '📦', baseGHS: 18 },
  { id: 'large', label: 'Large', hint: 'Backpack, groceries', emoji: '🛍️', baseGHS: 28 },
];

/** Quick-pick categories for the "Buy me something" flow. */
export type BuyCategory = { id: string; label: string; emoji: string };

export const BUY_SUGGESTIONS: BuyCategory[] = [
  { id: 'food', label: 'Food / Takeout', emoji: '🍔' },
  { id: 'groceries', label: 'Groceries', emoji: '🛒' },
  { id: 'pharmacy', label: 'Pharmacy', emoji: '💊' },
  { id: 'drinks', label: 'Drinks', emoji: '🥤' },
  { id: 'fuel', label: 'Gas / Fuel', emoji: '⛽' },
  { id: 'other', label: 'Something else', emoji: '✨' },
];
