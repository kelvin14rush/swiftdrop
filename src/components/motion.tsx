/**
 * Reusable motion building blocks, all driven by the presets in lib/motion and
 * all respecting reduced motion. Animate transform/opacity only (60fps).
 */

import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Dimensions,
  Pressable,
  Text,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { Curves, Durations, REVEAL_TRANSLATE, Springs } from '@/lib/motion';

const VH = Dimensions.get('window').height;

/** Tracks the OS "Reduce Motion" accessibility setting. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (mounted) setReduced(!!v);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (v) => setReduced(!!v));
    return () => {
      mounted = false;
      sub?.remove?.();
    };
  }, []);
  return reduced;
}

/** Fade + slide-up entrance on mount. Use `delay` to stagger groups. */
export function FadeInView({ delay = 0, children, style }: { delay?: number; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const reduced = useReducedMotion();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(REVEAL_TRANSLATE)).current;
  useEffect(() => {
    if (reduced) {
      opacity.setValue(1);
      translateY.setValue(0);
      return;
    }
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: Durations.base, delay, useNativeDriver: true, easing: Curves.decelerate }),
      Animated.spring(translateY, { toValue: 0, delay, useNativeDriver: true, ...Springs.gentle }),
    ]).start();
  }, [reduced, delay, opacity, translateY]);
  return <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>{children}</Animated.View>;
}

/** Reveals its content (fade + slide) as it scrolls into view. Pass the parent's scrollY. */
export function Reveal({ scrollY, children, style }: { scrollY: Animated.Value; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const reduced = useReducedMotion();
  const [y, setY] = useState<number | null>(null);

  let animStyle: Animated.WithAnimatedObject<ViewStyle> = {};
  if (!reduced && y !== null) {
    const inputRange = [y - VH + 40, y - VH + 170];
    animStyle = {
      opacity: scrollY.interpolate({ inputRange, outputRange: [0, 1], extrapolate: 'clamp' }),
      transform: [{ translateY: scrollY.interpolate({ inputRange, outputRange: [REVEAL_TRANSLATE, 0], extrapolate: 'clamp' }) }],
    };
  }
  return (
    <Animated.View onLayout={(e) => setY(e.nativeEvent.layout.y)} style={[style, animStyle]}>
      {children}
    </Animated.View>
  );
}

/** Pressable with a spring scale-down + haptic on press (the standard micro-interaction). */
export function PressableScale({
  onPress,
  children,
  style,
  haptic = true,
  disabled = false,
}: {
  onPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  haptic?: boolean;
  disabled?: boolean;
}) {
  const reduced = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) => {
    if (!reduced) Animated.spring(scale, { toValue: v, useNativeDriver: true, ...Springs.snappy }).start();
  };
  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => to(0.97)}
      onPressOut={() => to(1)}
      onPress={() => {
        if (haptic) Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}>
      <Animated.View style={[style, { transform: [{ scale }], opacity: disabled ? 0.5 : 1 }]}>{children}</Animated.View>
    </Pressable>
  );
}

/** Pulsing placeholder shown while content loads. */
export function Skeleton({ width, height, radius = 8, style }: { width: number | `${number}%`; height: number; radius?: number; style?: StyleProp<ViewStyle> }) {
  const reduced = useReducedMotion();
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(Animated.timing(shimmer, { toValue: 1, duration: 1100, useNativeDriver: true, easing: Curves.inOut }));
    loop.start();
    return () => loop.stop();
  }, [reduced, shimmer]);
  const opacity = reduced ? 0.5 : shimmer.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.35, 0.7, 0.35] });
  return <Animated.View style={[{ width, height, borderRadius: radius, backgroundColor: 'rgba(150,150,150,0.35)' }, style, { opacity }]} />;
}

/** Counts up to `value` once on mount. */
export function Counter({
  value,
  duration = 1200,
  decimals = 0,
  prefix = '',
  suffix = '',
  style,
}: {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  style?: StyleProp<TextStyle>;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);
  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    const av = new Animated.Value(0);
    const id = av.addListener(({ value: v }) => setDisplay(v));
    Animated.timing(av, { toValue: value, duration, useNativeDriver: false, easing: Curves.decelerate }).start();
    return () => av.removeListener(id);
  }, [value, reduced, duration]);
  const text = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString();
  return (
    <Text style={style}>
      {prefix}
      {text}
      {suffix}
    </Text>
  );
}
