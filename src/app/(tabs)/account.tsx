import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/aurora';
import { FadeInView, PressableScale } from '@/components/motion';
import { Brand, Colors, glassColors, Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/lib/auth';
import { useProfile } from '@/lib/profile';

type Row = { icon: keyof typeof Ionicons.glyphMap; label: string; route: Href };

const ROWS: Row[] = [
  { icon: 'bicycle-outline', label: 'Rider mode — deliver & earn', route: '/rider' as Href },
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
  const glass = glassColors(scheme);
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  const { user, signOut } = useAuth();
  const initial = (profile.name.trim()[0] || user?.email?.[0] || 'G').toUpperCase();

  return (
    <View style={{ flex: 1 }}>
      <AuroraBackground />
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + Spacing.four, paddingBottom: Spacing.six, paddingHorizontal: Spacing.three }}>
        <FadeInView>
          <Text style={[styles.title, { color: c.text }]}>Account</Text>
        </FadeInView>

        <FadeInView delay={60}>
          <PressableScale onPress={() => router.push((user ? '/edit-profile' : '/sign-in') as Href)} style={[styles.profile, { backgroundColor: glass.bg, borderColor: glass.border }]}>
            <View style={[styles.avatar, { backgroundColor: Brand.primary }]}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: c.text }]}>{user ? profile.name.trim() || 'My account' : 'Sign in'}</Text>
              <Text style={[styles.sub, { color: c.textSecondary }]}>{user ? user.email : 'Sync your orders across devices'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={c.textSecondary} />
          </PressableScale>
        </FadeInView>

        <FadeInView delay={140}>
          <View style={[styles.menu, { backgroundColor: glass.bg, borderColor: glass.border }]}>
            {ROWS.map((row, i) => (
              <PressableScale
                key={row.label}
                onPress={() => router.push(row.route)}
                style={[styles.row, i < ROWS.length - 1 ? { borderBottomWidth: 1, borderBottomColor: glass.border } : null]}>
                <View style={[styles.rowIcon, { backgroundColor: Brand.primarySoft }]}>
                  <Ionicons name={row.icon} size={18} color={Brand.primary} />
                </View>
                <Text style={[styles.rowLabel, { color: c.text }]}>{row.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={c.textSecondary} />
              </PressableScale>
            ))}
          </View>
        </FadeInView>

        {user ? (
          <FadeInView delay={200}>
            <PressableScale onPress={() => signOut()} style={[styles.signOut, { borderColor: glass.border, backgroundColor: glass.bg }]}>
              <Ionicons name="log-out-outline" size={18} color="#EF4444" />
              <Text style={styles.signOutText}>Sign out</Text>
            </PressableScale>
          </FadeInView>
        ) : null}

        <Text style={[styles.version, { color: c.textSecondary }]}>SwiftDrop v1.0.0 • Made in Ghana 🇬🇭</Text>
      </ScrollView>
    </View>
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

  signOut: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: Spacing.four, paddingVertical: Spacing.three, borderRadius: Radius.pill, borderWidth: 1 },
  signOutText: { color: '#EF4444', fontWeight: '700', fontSize: 15 },
  version: { textAlign: 'center', marginTop: Spacing.four, fontSize: 12 },
});
