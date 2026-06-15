import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand, Colors, Radius, Spacing } from '@/constants/theme';

export default function OrdersScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: c.background, paddingTop: insets.top + Spacing.four }]}>
      <Text style={[styles.title, { color: c.text }]}>Your orders</Text>

      {/* Empty state — real orders will load here from Supabase later. */}
      <View style={styles.empty}>
        <View style={[styles.emptyIcon, { backgroundColor: Brand.primarySoft }]}>
          <Ionicons name="cube-outline" size={40} color={Brand.primary} />
        </View>
        <Text style={[styles.emptyTitle, { color: c.text }]}>No orders yet</Text>
        <Text style={[styles.emptySub, { color: c.textSecondary }]}>
          Your deliveries and food orders will show up here.
        </Text>
        <Pressable
          onPress={() => router.push('/new-delivery')}
          style={({ pressed }) => [styles.cta, { backgroundColor: Brand.primary, opacity: pressed ? 0.85 : 1 }]}>
          <Text style={styles.ctaText}>Start an order</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.three },
  title: { fontSize: 24, fontWeight: '800', marginBottom: Spacing.four },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: Spacing.six },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.four,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySub: { fontSize: 14, textAlign: 'center', marginTop: Spacing.two, maxWidth: 260, lineHeight: 20 },
  cta: {
    marginTop: Spacing.four,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: Radius.pill,
  },
  ctaText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
