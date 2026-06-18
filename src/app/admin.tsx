import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/aurora';
import { Brand, Colors, glassColors, Radius, Spacing, type ThemePalette } from '@/constants/theme';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

type Row = { id: string; type: string; title: string; subtitle: string; total: number; status: string; rider_name: string | null; created_at: string };

export default function Admin() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const glass = glassColors(scheme);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase || !user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data: flag } = await supabase.rpc('is_admin');
    const admin = flag === true;
    setIsAdmin(admin);
    if (admin) {
      const { data } = await supabase.from('admin_orders').select('*').order('created_at', { ascending: false });
      setRows((data ?? []) as Row[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  if (isAdmin === null) {
    return (
      <View style={{ flex: 1 }}>
        <AuroraBackground />
        <ActivityIndicator color={Brand.primary} style={{ marginTop: insets.top + Spacing.six }} />
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={{ flex: 1 }}>
        <AuroraBackground />
        <View style={[styles.center, { paddingTop: insets.top }]}>
          <Ionicons name="lock-closed" size={40} color={Brand.primary} />
          <Text style={[styles.lockTitle, { color: c.text }]}>Admins only</Text>
          <Text style={[styles.lockSub, { color: c.textSecondary }]}>
            Add your user id to the `admins` table in Supabase (see supabase-features-migration.sql) to unlock the dashboard.
          </Text>
        </View>
      </View>
    );
  }

  const revenue = rows.reduce((s, r) => s + Number(r.total), 0);
  const delivered = rows.filter((r) => r.status === 'Delivered').length;
  const open = rows.filter((r) => r.status === 'Finding a rider').length;

  return (
    <View style={{ flex: 1 }}>
      <AuroraBackground />
      <FlatList
        data={rows}
        keyExtractor={(r) => r.id}
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingHorizontal: Spacing.three, paddingTop: insets.top + Spacing.four, paddingBottom: Spacing.six }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={Brand.primary} />}
        ListHeaderComponent={
          <>
            <Text style={[styles.title, { color: c.text }]}>Admin dashboard</Text>
            <View style={styles.statsRow}>
              <Stat c={c} glass={glass} value={String(rows.length)} label="Orders" />
              <Stat c={c} glass={glass} value={`₵${revenue}`} label="Revenue" />
              <Stat c={c} glass={glass} value={String(delivered)} label="Delivered" />
              <Stat c={c} glass={glass} value={String(open)} label="Open" />
            </View>
            <Text style={[styles.section, { color: c.textSecondary }]}>All orders</Text>
          </>
        }
        ItemSeparatorComponent={() => <View style={{ height: Spacing.two }} />}
        renderItem={({ item }) => (
          <View style={[styles.row, { backgroundColor: glass.bg, borderColor: glass.border }]}>
            <Ionicons name={item.type === 'package' ? 'cube' : 'bag-handle'} size={20} color={Brand.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: c.text }]} numberOfLines={1}>{item.title}</Text>
              <Text style={[styles.rowSub, { color: c.textSecondary }]} numberOfLines={1}>
                {item.status}
                {item.rider_name ? ` • ${item.rider_name}` : ''}
              </Text>
            </View>
            <Text style={[styles.rowTotal, { color: c.text }]}>GHS {item.total}</Text>
          </View>
        )}
      />
    </View>
  );
}

function Stat({ c, glass, value, label }: { c: ThemePalette; glass: { bg: string; border: string }; value: string; label: string }) {
  return (
    <View style={[styles.stat, { backgroundColor: glass.bg, borderColor: glass.border }]}>
      <Text style={[styles.statValue, { color: c.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: c.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', marginBottom: Spacing.three },
  statsRow: { flexDirection: 'row', gap: Spacing.two, marginBottom: Spacing.two },
  stat: { flex: 1, borderRadius: Radius.md, borderWidth: 1, padding: Spacing.three, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  section: { fontSize: 13, fontWeight: '700', marginTop: Spacing.four, marginBottom: Spacing.three, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three, borderRadius: Radius.md, borderWidth: 1 },
  rowTitle: { fontSize: 15, fontWeight: '700' },
  rowSub: { fontSize: 12, marginTop: 2 },
  rowTotal: { fontSize: 15, fontWeight: '800' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.four, gap: Spacing.three },
  lockTitle: { fontSize: 20, fontWeight: '800' },
  lockSub: { fontSize: 14, textAlign: 'center', maxWidth: 300, lineHeight: 20 },
});
