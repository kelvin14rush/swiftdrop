import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { Confetti } from '@/components/confetti';
import { PressableScale } from '@/components/motion';
import { Brand, Colors, Radius, Spacing } from '@/constants/theme';
import { useOrders } from '@/lib/orders';

export default function OrderConfirmed() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const { orders } = useOrders();
  const order = orders[0];

  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 80 }).start();
  }, [scale]);

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Confetti />

      <Animated.View style={[styles.check, { transform: [{ scale }] }]}>
        <Ionicons name="checkmark" size={56} color="#FFFFFF" />
      </Animated.View>

      <Text style={[styles.title, { color: c.text }]}>Order placed!</Text>
      <Text style={[styles.sub, { color: c.textSecondary }]}>A rider is being matched right now.</Text>

      {order ? (
        <View style={[styles.codeCard, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={styles.codeHeader}>
            <Ionicons name="lock-closed" size={14} color={Brand.primary} />
            <Text style={[styles.codeLabel, { color: c.textSecondary }]}>Your delivery code</Text>
          </View>
          <Text style={[styles.code, { color: Brand.primary }]}>{order.pin}</Text>
          <Text style={[styles.codeHint, { color: c.textSecondary }]}>
            Give it to the rider only when your order arrives — it can&apos;t be completed without you.
          </Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <PressableScale onPress={() => router.replace('/orders')} style={[styles.primary, { backgroundColor: Brand.primary }]}>
          <View style={styles.primaryInner}>
            <Text style={styles.primaryText}>View my orders</Text>
          </View>
        </PressableScale>
        <PressableScale haptic={false} onPress={() => router.replace('/')} style={styles.secondary}>
          <View style={styles.secondaryInner}>
            <Text style={[styles.secondaryText, { color: c.textSecondary }]}>Back to home</Text>
          </View>
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.five },
  check: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Brand.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.four,
    shadowColor: Brand.accent,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  title: { fontSize: 24, fontWeight: '800' },
  sub: { fontSize: 14, marginTop: Spacing.two, textAlign: 'center' },

  codeCard: { width: '100%', borderRadius: Radius.md, borderWidth: 1, padding: Spacing.four, alignItems: 'center', marginTop: Spacing.five },
  codeHeader: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  codeLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  code: { fontSize: 40, fontWeight: '800', letterSpacing: 8, marginTop: Spacing.two },
  codeHint: { fontSize: 12, textAlign: 'center', marginTop: Spacing.two, lineHeight: 18 },

  actions: { width: '100%', marginTop: Spacing.five, gap: Spacing.two },
  primary: { borderRadius: Radius.pill },
  primaryInner: { paddingVertical: Spacing.three, alignItems: 'center' },
  primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  secondary: { borderRadius: Radius.pill },
  secondaryInner: { paddingVertical: Spacing.three, alignItems: 'center' },
  secondaryText: { fontSize: 15, fontWeight: '700' },
});
