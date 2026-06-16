import { ScrollView, StyleSheet, Switch, Text, useColorScheme, View } from 'react-native';

import { Brand, Colors, Radius, Spacing } from '@/constants/theme';
import { useProfile } from '@/lib/profile';

export default function Notifications() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const { profile, update } = useProfile();

  return (
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={{ padding: Spacing.three }}>
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
        <Toggle
          c={c}
          title="Order updates"
          subtitle="Rider matched, on the way, delivered"
          value={profile.notifyOrders}
          onChange={(v) => update({ notifyOrders: v })}
          divider
        />
        <Toggle
          c={c}
          title="Promotions & offers"
          subtitle="Deals and discounts from SwiftDrop"
          value={profile.notifyPromos}
          onChange={(v) => update({ notifyPromos: v })}
        />
      </View>
      <Text style={[styles.note, { color: c.textSecondary }]}>You can change these anytime.</Text>
    </ScrollView>
  );
}

function Toggle({
  c,
  title,
  subtitle,
  value,
  onChange,
  divider,
}: {
  c: (typeof Colors)['light'];
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (v: boolean) => void;
  divider?: boolean;
}) {
  return (
    <View style={[styles.row, divider ? { borderBottomWidth: 1, borderBottomColor: c.border } : null]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: c.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: c.textSecondary }]}>{subtitle}</Text>
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: Brand.primary, false: '#9CA3AF' }} thumbColor="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: Radius.md, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three },
  title: { fontSize: 15, fontWeight: '700' },
  subtitle: { fontSize: 12, marginTop: 2 },
  note: { fontSize: 12, marginTop: Spacing.three, paddingHorizontal: Spacing.one },
});
