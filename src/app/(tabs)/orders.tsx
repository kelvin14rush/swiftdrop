import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { FlatList, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/aurora';
import { FadeInView, PressableScale, Skeleton } from '@/components/motion';
import { Brand, Colors, glassColors, Radius, Spacing, type ThemePalette } from '@/constants/theme';
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
  const glass = glassColors(scheme);
  const insets = useSafeAreaInsets();
  const { orders, loaded } = useOrders();

  // Loading skeletons while orders hydrate from storage.
  if (!loaded) {
    return (
      <View style={{ flex: 1 }}>
        <AuroraBackground />
        <View style={{ paddingHorizontal: Spacing.three, paddingTop: insets.top + Spacing.four }}>
          <Text style={[styles.title, { color: c.text }]}>Your orders</Text>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.card, { backgroundColor: glass.bg, borderColor: glass.border, marginBottom: Spacing.three }]}>
              <Skeleton width={46} height={46} radius={Radius.sm} />
              <View style={{ flex: 1, gap: 8 }}>
                <Skeleton width="70%" height={14} />
                <Skeleton width="45%" height={12} />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <AuroraBackground />
        <FadeInView style={[styles.empty, { paddingTop: insets.top }]}>
          <View style={[styles.emptyIcon, { backgroundColor: Brand.primarySoft }]}>
            <Ionicons name="cube-outline" size={40} color={Brand.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: c.text }]}>No orders yet</Text>
          <Text style={[styles.emptySub, { color: c.textSecondary }]}>Your deliveries and errands will show up here.</Text>
          <PressableScale onPress={() => router.push('/new-delivery')} style={[styles.cta, { backgroundColor: Brand.primary }]}>
            <Text style={styles.ctaText}>Start an order</Text>
          </PressableScale>
        </FadeInView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AuroraBackground />
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingHorizontal: Spacing.three, paddingTop: insets.top + Spacing.four, paddingBottom: Spacing.six }}
        ListHeaderComponent={<Text style={[styles.title, { color: c.text }]}>Your orders</Text>}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.three }} />}
        renderItem={({ item, index }) => (
          <FadeInView delay={Math.min(index, 6) * 70}>
            <OrderCard o={item} c={c} glass={glass} />
          </FadeInView>
        )}
      />
    </View>
  );
}

function OrderCard({ o, c, glass }: { o: Order; c: ThemePalette; glass: { bg: string; border: string } }) {
  const icon = o.type === 'package' ? 'cube' : 'bag-handle';
  return (
    <PressableScale
      onPress={() => router.push({ pathname: '/track', params: { id: o.id } } as Href)}
      style={[styles.card, { backgroundColor: glass.bg, borderColor: glass.border }]}>
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
        {o.pin ? (
          <View style={[styles.pinChip, { backgroundColor: c.backgroundElement }]}>
            <Ionicons name="lock-closed" size={11} color={c.textSecondary} />
            <Text style={[styles.pinText, { color: c.textSecondary }]}>Delivery code {o.pin}</Text>
          </View>
        ) : null}
      </View>
      <Text style={[styles.total, { color: c.text }]}>GHS {o.total}</Text>
    </PressableScale>
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
  pinChip: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.pill, marginTop: Spacing.two },
  pinText: { fontSize: 11, fontWeight: '700' },
  total: { fontSize: 15, fontWeight: '800' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.four },
  emptyIcon: { width: 88, height: 88, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.four },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySub: { fontSize: 14, textAlign: 'center', marginTop: Spacing.two, maxWidth: 260, lineHeight: 20 },
  cta: { marginTop: Spacing.four, paddingHorizontal: Spacing.five, paddingVertical: Spacing.three, borderRadius: Radius.pill },
  ctaText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
