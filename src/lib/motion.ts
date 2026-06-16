/**
 * One source of truth for motion, so every animation feels cohesive.
 * RN's Animated engine is used app-wide (reliable in Expo Go). Animate only
 * transform/opacity for 60fps; respect reduced motion via useReducedMotion().
 */

import { Easing } from 'react-native';

export const Durations = {
  instant: 120,
  fast: 220,
  base: 360,
  slow: 560,
} as const;

/** Easing curves — use with Animated.timing({ easing }). */
export const Curves = {
  standard: Easing.bezier(0.2, 0, 0, 1),
  decelerate: Easing.out(Easing.cubic),
  accelerate: Easing.in(Easing.cubic),
  inOut: Easing.inOut(Easing.ease),
} as const;

/** Spring presets — spread into Animated.spring({ ...preset }). */
export const Springs = {
  gentle: { friction: 9, tension: 50 },
  snappy: { friction: 7, tension: 110 },
  bouncy: { friction: 5, tension: 80 },
} as const;

/** Delay between consecutive items in a staggered group (ms). */
export const STAGGER_MS = 70;

/** How far elements slide while fading in (px). */
export const REVEAL_TRANSLATE = 22;
