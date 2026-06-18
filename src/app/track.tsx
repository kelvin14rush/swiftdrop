import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DeliveryMap } from '@/components/delivery-map';
import { Brand, Colors, Radius, Spacing } from '@/constants/theme';
import { useOrders } from '@/lib/orders';

// Mock Accra coordinates until real geocoding (needs a Maps API key) is added.
const PICKUP = { latitude: 5.6505, longitude: -0.156 };
const DROPOFF = { latitude: 5.5571, longitude: -0.182 };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Maps the real order status (updated live via Supabase Realtime) to a position
// on the route + a friendly label.
const STAGES: { status: string; at: number; label: string }[] = [
  { status: 'Finding a rider', at: 0, label: 'Finding a rider…' },
  { status: 'Accepted', at: 0.3, label: 'Rider accepted — heading to pickup' },
  { status: 'On the way', at: 0.7, label: 'On the way to you' },
  { status: 'Delivered', at: 1, label: 'Delivered 🎉' },
];
const stageFor = (status: string) => STAGES.find((s) => s.status === status) ?? STAGES[0];

export default function Track() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === id) ?? orders[0];
  const status = order?.status ?? 'Finding a rider';

  // Smoothly move the rider marker whenever the live status advances.
  const progress = useRef(new Animated.Value(stageFor(status).at)).current;
  const [t, setT] = useState(stageFor(status).at);
  useEffect(() => {
    const sub = progress.addListener(({ value }) => setT(value));
    Animated.timing(progress, { toValue: stageFor(status).at, duration: 1200, useNativeDriver: false }).start();
    return () => progress.removeListener(sub);
  }, [status, progress]);

  const rider = {
    latitude: lerp(PICKUP.latitude, DROPOFF.latitude, t),
    longitude: lerp(PICKUP.longitude, DROPOFF.longitude, t),
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ flex: 1 }}>
        <DeliveryMap pickup={PICKUP} dropoff={DROPOFF} rider={rider} />
      </View>

      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border, paddingBottom: insets.bottom + Spacing.three }]}>
        <View style={styles.statusRow}>
          <View style={styles.live} />
          <Text style={[styles.status, { color: c.text }]}>{stageFor(status).label}</Text>
        </View>
        {order ? (
          <Text style={[styles.sub, { color: c.textSecondary }]}>
            {order.title} • give the rider code {order.pin} on arrival
          </Text>
        ) : null}
        <View style={styles.steps}>
          {STAGES.map((s) => (
            <View key={s.status} style={[styles.stepDot, { backgroundColor: t >= s.at - 0.001 ? Brand.primary : c.border }]} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: Spacing.three,
    right: Spacing.three,
    bottom: 0,
    marginBottom: Spacing.three,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  live: { width: 10, height: 10, borderRadius: 5, backgroundColor: Brand.accent },
  status: { fontSize: 17, fontWeight: '800', flex: 1 },
  sub: { fontSize: 13, marginTop: Spacing.two },
  steps: { flexDirection: 'row', gap: 6, marginTop: Spacing.three },
  stepDot: { flex: 1, height: 5, borderRadius: 3 },
});
