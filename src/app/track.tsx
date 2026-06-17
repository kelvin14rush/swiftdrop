import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DeliveryMap } from '@/components/delivery-map';
import { Brand, Colors, Radius, Spacing } from '@/constants/theme';
import { useOrders } from '@/lib/orders';

// Mock Accra coordinates until real geocoding (needs a Maps API key) is added.
const PICKUP = { latitude: 5.6505, longitude: -0.156 };
const DROPOFF = { latitude: 5.5571, longitude: -0.182 };

const STAGES = [
  { at: 0, label: 'Rider picked up your order' },
  { at: 0.35, label: 'On the way to you' },
  { at: 0.75, label: 'Almost there' },
  { at: 1, label: 'Delivered 🎉' },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function Track() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === id) ?? orders[0];

  // Simulate the rider moving from pickup to drop-off.
  const [t, setT] = useState(0);
  useEffect(() => {
    const steps = 40;
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      setT(Math.min(i / steps, 1));
      if (i >= steps) clearInterval(iv);
    }, 700);
    return () => clearInterval(iv);
  }, []);

  const rider = {
    latitude: lerp(PICKUP.latitude, DROPOFF.latitude, t),
    longitude: lerp(PICKUP.longitude, DROPOFF.longitude, t),
  };
  const stage = [...STAGES].reverse().find((s) => t >= s.at) ?? STAGES[0];

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <View style={{ flex: 1 }}>
        <DeliveryMap pickup={PICKUP} dropoff={DROPOFF} rider={rider} />
      </View>

      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border, paddingBottom: insets.bottom + Spacing.three }]}>
        <View style={styles.statusRow}>
          <View style={styles.live} />
          <Text style={[styles.status, { color: c.text }]}>{stage.label}</Text>
        </View>
        {order ? (
          <Text style={[styles.sub, { color: c.textSecondary }]}>
            {order.title} • give the rider code {order.pin} on arrival
          </Text>
        ) : null}
        <View style={styles.steps}>
          {STAGES.map((s, i) => (
            <View key={i} style={[styles.stepDot, { backgroundColor: t >= s.at ? Brand.primary : c.border }]} />
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
  status: { fontSize: 17, fontWeight: '800' },
  sub: { fontSize: 13, marginTop: Spacing.two },
  steps: { flexDirection: 'row', gap: 6, marginTop: Spacing.three },
  stepDot: { flex: 1, height: 5, borderRadius: 3 },
});
