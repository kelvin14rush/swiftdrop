/**
 * SwiftDrop design system — brand colors, light/dark palettes, spacing, fonts.
 * Other styling options exist (Nativewind, Tamagui, unistyles); we use plain
 * StyleSheet + these tokens to keep things simple and dependency-free.
 */

import { Platform } from 'react-native';

/** Brand palette — the SwiftDrop orange. */
export const Brand = {
  primary: '#FF6B00',
  primaryDark: '#E25E00',
  primarySoft: '#FFF1E6',
  accent: '#10B981', // success / "delivered"
  accentSoft: '#E7F7F0',
  warning: '#F59E0B',
} as const;

export type ThemePalette = {
  text: string;
  textSecondary: string;
  background: string;
  backgroundElement: string;
  backgroundSelected: string;
  card: string;
  border: string;
  tint: string;
};

export const Colors: { light: ThemePalette; dark: ThemePalette } = {
  light: {
    text: '#0F1419',
    textSecondary: '#5B6470',
    background: '#FFFFFF',
    backgroundElement: '#F4F5F7',
    backgroundSelected: '#E6E8EB',
    card: '#FFFFFF',
    border: '#E6E8EB',
    tint: Brand.primary,
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#B0B4BA',
    background: '#0B0D10',
    backgroundElement: '#16191D',
    backgroundSelected: '#23272D',
    card: '#16191D',
    border: '#23272D',
    tint: Brand.primary,
  },
};

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/** Translucent "glass" surface colors for cards layered over the aurora. */
export function glassColors(scheme: 'light' | 'dark') {
  return scheme === 'dark'
    ? { bg: 'rgba(26,26,34,0.55)', border: 'rgba(255,255,255,0.10)' }
    : { bg: 'rgba(255,255,255,0.62)', border: 'rgba(255,255,255,0.75)' };
}

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

/** 4-pt spacing scale. */
export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
