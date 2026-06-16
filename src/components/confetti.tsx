/** A lightweight confetti burst (RN Animated, no native deps). */

import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');
const COLORS = ['#FF6B00', '#FF9A2E', '#34D399', '#F23D02', '#FBBF24', '#60A5FA', '#F472B6'];
const COUNT = 40;

export function Confetti() {
  const pieces = useRef(
    Array.from({ length: COUNT }).map(() => ({
      anim: new Animated.Value(0),
      left: Math.random() * W,
      size: 6 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      drift: (Math.random() - 0.5) * 180,
      delay: Math.random() * 500,
      spins: 1 + Math.random() * 4,
      duration: 2200 + Math.random() * 1000,
    })),
  ).current;

  useEffect(() => {
    Animated.parallel(
      pieces.map((p) => Animated.timing(p.anim, { toValue: 1, duration: p.duration, delay: p.delay, useNativeDriver: true })),
    ).start();
  }, [pieces]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p, i) => {
        const translateY = p.anim.interpolate({ inputRange: [0, 1], outputRange: [-40, H * 0.75] });
        const translateX = p.anim.interpolate({ inputRange: [0, 1], outputRange: [0, p.drift] });
        const rotate = p.anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${p.spins * 360}deg`] });
        const opacity = p.anim.interpolate({ inputRange: [0, 0.85, 1], outputRange: [1, 1, 0] });
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              left: p.left,
              width: p.size,
              height: p.size * 0.55,
              backgroundColor: p.color,
              borderRadius: 2,
              opacity,
              transform: [{ translateY }, { translateX }, { rotate }],
            }}
          />
        );
      })}
    </View>
  );
}
