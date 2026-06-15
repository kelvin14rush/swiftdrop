import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand, Colors, Radius, Spacing } from '@/constants/theme';
import { useOrders, type Order } from '@/lib/orders';

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function OrdersScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const insets = useSafeAreaInsets();
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: c.background, paddingTop: insets.top }]}>
        <View style={[styles.emptyIcon, { backgroundColor: Brand.primarySoft }]}>
          <Ionicons name="cube-outline" size={40} color={Brand.primary} />
        </View>
        <Text style={[styles.emptyTitle, { color: c.text }]}>No orders yet</Text>
        <Text style={[styles.emptySub, { color: c.textSecondary }]}>
          Your deliveries and errands will show up here.
        </Text>
        <Pressable
          onPress={() => router.push('/new-delivery')}
          style={({ pressed }) => [styles.cta, { backgroundColor: Brand.primary, opacity: pressed ? 0.85 : 1 }]}>
          <Text style={styles.ctaText}>Start an order</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ paddingHorizontal: Spacing.three, paddingTop: insets.top + Spacing.four, paddingBottom: Spacing.six }}
        ListHeaderComponent={<Text style={[styles.title, { color: c.text }]}>Your orders</Text>}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.three }} />}
        renderItem={({ item }) => <OrderCard o={item} c={c} />}
      />
    </View>
  );
}

function OrderCard({ o, c }: { o: Order; c: (typeof Colors)['light'] }) {
  const icon = o.type === 'package' ? 'cube' : 'bag-handle';
  return (
    <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: Brand.primarySoft }]}>
        <Ionicons name={icon} size={22} color={Brand.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.cardTitle, { color: c.text }]} numberOfLines={1}>
          {o.title}
        </Text>
        <Text style={[styles.cardSub, { color: c.textSecondary }]} numberOfLines={1}>
          {o.subtitle}
        </Text>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: Brand.warning }]} />
          <Text style={[styles.status, { color: Brand.warning }]}>{o.status}</Text>
          <Text style={[styles.time, { color: c.textSecondary }]}>• {timeAgo(o.createdAt)}</Text>
        </View>
      </View>
      <Text style={[styles.total, { color: c.text }]}>GHS {o.total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', marginBottom: Spacing.four },

  card: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three, borderRadius: Radius.md, borderWidth: 1 },
  iconWrap: { width: 46, height: 46, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  cardSub: { fontSize: 13, marginTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: Spacing.two },
  dot: { width: 7, height: 7, borderRadius: 4 },
  status: { fontSize: 12, fontWeight: '700' },
  time: { fontSize: 12 },
  total: { fontSize: 15, fontWeight: '800' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.four },
  emptyIcon: { width: 88, height: 88, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.four },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySub: { fontSize: 14, textAlign: 'center', marginTop: Spacing.two, maxWidth: 260, lineHeight: 20 },
  cta: { marginTop: Spacing.four, paddingHorizontal: Spacing.five, paddingVertical: Spacing.three, borderRadius: Radius.pill },
  ctaText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
