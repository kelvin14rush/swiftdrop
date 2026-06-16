import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { Brand, Colors, Radius, Spacing } from '@/constants/theme';
import { useProfile } from '@/lib/profile';

const NETWORKS = [
  { id: 'mtn', label: 'MTN MoMo', emoji: '🟡' },
  { id: 'telecel', label: 'Telecel Cash', emoji: '🔴' },
  { id: 'at', label: 'AT Money', emoji: '🔵' },
];

export default function PaymentMethods() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const { profile } = useProfile();

  return (
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={{ padding: Spacing.three }}>
      {/* Active method */}
      <View style={[styles.active, { backgroundColor: c.card, borderColor: Brand.primary }]}>
        <View style={[styles.icon, { backgroundColor: Brand.primarySoft }]}>
          <Ionicons name="phone-portrait-outline" size={22} color={Brand.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.activeTitle, { color: c.text }]}>Mobile Money</Text>
          <Text style={[styles.activeSub, { color: c.textSecondary }]}>
            {profile.phone.trim() ? `Pay with ${profile.phone.trim()}` : 'You pay your rider on delivery'}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: Brand.accentSoft }]}>
          <Text style={[styles.badgeText, { color: Brand.accent }]}>Default</Text>
        </View>
      </View>

      <Text style={[styles.section, { color: c.textSecondary }]}>Supported networks</Text>
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
        {NETWORKS.map((n, i) => (
          <View key={n.id} style={[styles.row, i < NETWORKS.length - 1 ? { borderBottomWidth: 1, borderBottomColor: c.border } : null]}>
            <Text style={{ fontSize: 20 }}>{n.emoji}</Text>
            <Text style={[styles.rowLabel, { color: c.text }]}>{n.label}</Text>
            <Ionicons name="checkmark-circle" size={20} color={Brand.accent} />
          </View>
        ))}
      </View>

      <View style={[styles.soon, { backgroundColor: c.backgroundElement }]}>
        <Ionicons name="card-outline" size={20} color={c.textSecondary} />
        <Text style={[styles.soonText, { color: c.textSecondary }]}>Debit/credit cards coming soon.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  active: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three, borderRadius: Radius.md, borderWidth: 1.5 },
  icon: { width: 46, height: 46, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  activeTitle: { fontSize: 16, fontWeight: '700' },
  activeSub: { fontSize: 13, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill },
  badgeText: { fontSize: 11, fontWeight: '800' },

  section: { fontSize: 13, fontWeight: '600', marginTop: Spacing.four, marginBottom: Spacing.three },
  card: { borderRadius: Radius.md, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '600' },

  soon: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, padding: Spacing.three, borderRadius: Radius.md, marginTop: Spacing.four },
  soonText: { fontSize: 13, fontWeight: '500' },
});
