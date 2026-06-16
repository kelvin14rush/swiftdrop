import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FadeInView, PressableScale } from '@/components/motion';
import { Brand, Colors, Radius, Spacing } from '@/constants/theme';
import { useProfile } from '@/lib/profile';

type Row = { icon: keyof typeof Ionicons.glyphMap; label: string; route: Href };

const ROWS: Row[] = [
  { icon: 'person-outline', label: 'Edit profile', route: '/edit-profile' },
  { icon: 'card-outline', label: 'Payment methods', route: '/payment-methods' },
  { icon: 'location-outline', label: 'Saved addresses', route: '/addresses' },
  { icon: 'notifications-outline', label: 'Notifications', route: '/notifications' },
  { icon: 'help-circle-outline', label: 'Help & support', route: '/help' },
  { icon: 'information-circle-outline', label: 'About SwiftDrop', route: '/about' },
];

export default function AccountScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  const initial = (profile.name.trim()[0] || 'G').toUpperCase();

  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={{ paddingTop: insets.top + Spacing.four, paddingBottom: Spacing.six, paddingHorizontal: Spacing.three }}>
      <FadeInView>
        <Text style={[styles.title, { color: c.text }]}>Account</Text>
      </FadeInView>

      <FadeInView delay={60}>
        <PressableScale onPress={() => router.push('/edit-profile')} style={[styles.profile, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={[styles.avatar, { backgroundColor: Brand.primary }]}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: c.text }]}>{profile.name.trim() || 'Guest user'}</Text>
            <Text style={[styles.sub, { color: c.textSecondary }]}>{profile.phone.trim() || 'Tap to set up your profile'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={c.textSecondary} />
        </PressableScale>
      </FadeInView>

      <FadeInView delay={140}>
        <View style={[styles.menu, { backgroundColor: c.card, borderColor: c.border }]}>
          {ROWS.map((row, i) => (
            <PressableScale
              key={row.label}
              onPress={() => router.push(row.route)}
              style={[styles.row, i < ROWS.length - 1 ? { borderBottomWidth: 1, borderBottomColor: c.border } : null]}>
              <View style={[styles.rowIcon, { backgroundColor: Brand.primarySoft }]}>
                <Ionicons name={row.icon} size={18} color={Brand.primary} />
              </View>
              <Text style={[styles.rowLabel, { color: c.text }]}>{row.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={c.textSecondary} />
            </PressableScale>
          ))}
        </View>
      </FadeInView>

      <Text style={[styles.version, { color: c.textSecondary }]}>SwiftDrop v1.0.0 • Made in Ghana 🇬🇭</Text>
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
  rowIcon: { width: 34, height: 34, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '500' },

  version: { textAlign: 'center', marginTop: Spacing.four, fontSize: 12 },
});
