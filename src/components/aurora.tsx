/**
 * A living "aurora" background: soft colored orbs drift slowly behind the UI and
 * are blurred into a smooth glow. Replaces flat backgrounds for a premium feel.
 * Transform-only animation (60fps); fully static under reduced motion.
 */

import { BlurView } from 'expo-blur';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, useColorScheme, View } from 'react-native';

import { useReducedMotion } from '@/components/motion';

type OrbCfg = { color: string; size: number; x: number; y: number; dx: number; dy: number; dur: number };

const ORBS: OrbCfg[] = [
  { color: '#FF6B00', size: 280, x: -70, y: -50, dx: 90, dy: 70, dur: 9000 },
  { color: '#FF2D78', size: 240, x: 190, y: 110, dx: -80, dy: 90, dur: 11000 },
  { color: '#7C3AED', size: 260, x: 30, y: 360, dx: 70, dy: -90, dur: 10000 },
  { color: '#F59E0B', size: 220, x: 210, y: 520, dx: -70, dy: -70, dur: 12000 },
  { color: '#06B6D4', size: 200, x: -40, y: 620, dx: 90, dy: 60, dur: 13000 },
];

function Orb({ cfg, reduced }: { cfg: OrbCfg; reduced: boolean }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: cfg.dur, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(v, { toValue: 0, duration: cfg.dur, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduced, v, cfg.dur]);

  const translateX = v.interpolate({ inputRange: [0, 1], outputRange: [0, cfg.dx] });
  const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [0, cfg.dy] });
  const scale = v.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.25, 1] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: cfg.x,
        top: cfg.y,
        width: cfg.size,
        height: cfg.size,
        borderRadius: cfg.size / 2,
        backgroundColor: cfg.color,
        opacity: 0.55,
        transform: [{ translateX }, { translateY }, { scale }],
      }}
    />
  );
}

export function AuroraBackground() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const reduced = useReducedMotion();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: scheme === 'dark' ? '#0A0A0F' : '#F4F1FB' }]} />
      {ORBS.map((o, i) => (
        <Orb key={i} cfg={o} reduced={reduced} />
      ))}
      {/* Blur the orbs into a smooth aurora glow */}
      <BlurView intensity={scheme === 'dark' ? 70 : 90} tint={scheme === 'dark' ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
    </View>
  );
}
