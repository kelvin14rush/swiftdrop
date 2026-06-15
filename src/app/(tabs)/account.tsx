import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand, Colors, Radius, Spacing } from '@/constants/theme';

type Row = { icon: keyof typeof Ionicons.glyphMap; label: string };

const ROWS: Row[] = [
  { icon: 'person-outline', label: 'Edit profile' },
  { icon: 'card-outline', label: 'Payment methods' },
  { icon: 'location-outline', label: 'Saved addresses' },
  { icon: 'notifications-outline', label: 'Notifications' },
  { icon: 'help-circle-outline', label: 'Help & support' },
  { icon: 'information-circle-outline', label: 'About SwiftDrop' },
];

export default function AccountScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={{ paddingTop: insets.top + Spacing.four, paddingBottom: Spacing.six, paddingHorizontal: Spacing.three }}>
      <Text style={[styles.title, { color: c.text }]}>Account</Text>

      {/* Profile header */}
      <View style={[styles.profile, { backgroundColor: c.card, borderColor: c.border }]}>
        <View style={[styles.avatar, { backgroundColor: Brand.primary }]}>
          <Text style={styles.avatarText}>D</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: c.text }]}>Guest user</Text>
          <Text style={[styles.sub, { color: c.textSecondary }]}>Sign in to save your orders</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={c.textSecondary} />
      </View>

      {/* Menu */}
      <View style={[styles.menu, { backgroundColor: c.card, borderColor: c.border }]}>
        {ROWS.map((row, i) => (
          <View key={row.label} style={[styles.row, i < ROWS.length - 1 && { borderBottomWidth: 1, borderBottomColor: c.border }]}>
            <Ionicons name={row.icon} size={22} color={Brand.primary} />
            <Text style={[styles.rowLabel, { color: c.text }]}>{row.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={c.textSecondary} />
          </View>
        ))}
      </View>

      <Text style={[styles.version, { color: c.textSecondary }]}>SwiftDrop v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', marginBottom: Spacing.four },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.four,
  },
  avatar: { width: 52, height: 52, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  name: { fontSize: 16, fontWeight: '700' },
  sub: { fontSize: 13, marginTop: 2 },

  menu: { borderRadius: Radius.md, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '500' },

  version: { textAlign: 'center', marginTop: Spacing.four, fontSize: 12 },
});
