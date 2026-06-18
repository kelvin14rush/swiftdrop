import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/aurora';
import { PressableScale } from '@/components/motion';
import { Brand, Colors, glassColors, Radius, Spacing, type ThemePalette } from '@/constants/theme';
import { useAuth } from '@/lib/auth';
import { useProfile } from '@/lib/profile';
import { supabase } from '@/lib/supabase';

type Job = { id: string; type: string; title: string; subtitle: string; total: number; status: string; rider_id: string | null };

const COLS = 'id,type,title,subtitle,total,status,rider_id';

export default function Rider() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const glass = glassColors(scheme);
  const insets = useSafeAreaInsets();
  const { user, configured } = useAuth();
  const { profile } = useProfile();

  const [available, setAvailable] = useState<Job[]>([]);
  const [mine, setMine] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase || !user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    // Read from the rider_jobs view, which excludes the delivery code (pin).
    const [a, m] = await Promise.all([
      supabase.from('rider_jobs').select(COLS).is('rider_id', null).eq('status', 'Finding a rider').order('created_at', { ascending: false }),
      supabase.from('rider_jobs').select(COLS).eq('rider_id', user.id).neq('status', 'Delivered').order('created_at', { ascending: false }),
    ]);
    setAvailable((a.data ?? []) as Job[]);
    setMine((m.data ?? []) as Job[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  async function accept(job: Job) {
    if (!supabase || !user) return;
    if (profile.riderStatus !== 'verified') {
      Alert.alert('Get verified first', 'You need to verify your identity before accepting deliveries.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Verify now', onPress: () => router.push('/rider-verify') },
      ]);
      return;
    }
    const { error } = await supabase
      .from('orders')
      .update({ rider_id: user.id, rider_name: profile.name || 'Rider', status: 'Accepted' })
      .eq('id', job.id);
    if (error) return Alert.alert('Could not accept', error.message);
    load();
  }

  async function start(job: Job) {
    if (!supabase) return;
    const { error } = await supabase.from('orders').update({ status: 'On the way' }).eq('id', job.id);
    if (error) return Alert.alert('Update failed', error.message);
    load();
  }

  async function complete(job: Job, code: string) {
    if (!supabase) return;
    const { data, error } = await supabase.rpc('complete_delivery', { p_order_id: job.id, p_code: code.trim() });
    if (error) return Alert.alert('Error', error.message);
    if (data === true) {
      Alert.alert('Delivered ✅', 'Nice work — order completed.');
      load();
    } else {
      Alert.alert('Wrong code', 'That code doesn’t match. Ask the customer for their 4-digit delivery code.');
    }
  }

  if (!configured || !user) {
    return (
      <View style={{ flex: 1 }}>
        <AuroraBackground />
        <View style={[styles.center, { paddingTop: insets.top }]}>
          <View style={[styles.bigIcon, { backgroundColor: Brand.primarySoft }]}>
            <Ionicons name="bicycle" size={40} color={Brand.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: c.text }]}>Deliver with SwiftDrop</Text>
          <Text style={[styles.emptySub, { color: c.textSecondary }]}>Sign in to see delivery jobs near you and start earning.</Text>
          <PressableScale onPress={() => router.push('/sign-in')} style={[styles.cta, { backgroundColor: Brand.primary }]}>
            <Text style={styles.ctaText}>Sign in to ride</Text>
          </PressableScale>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AuroraBackground />
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingHorizontal: Spacing.three, paddingTop: insets.top + Spacing.four, paddingBottom: Spacing.six }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={Brand.primary} />}>
        <Text style={[styles.title, { color: c.text }]}>Rider mode</Text>

        {profile.riderStatus !== 'verified' ? (
          <PressableScale onPress={() => router.push('/rider-verify')} style={styles.verifyBanner}>
            <Ionicons name="shield-checkmark" size={20} color={Brand.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.verifyTitle, { color: Brand.primaryDark }]}>Get verified to accept jobs</Text>
              <Text style={[styles.verifySub, { color: c.textSecondary }]}>Quick ID + selfie check.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Brand.primary} />
          </PressableScale>
        ) : (
          <View style={styles.verifiedRow}>
            <Ionicons name="shield-checkmark" size={16} color={Brand.accent} />
            <Text style={[styles.verifiedText, { color: Brand.accent }]}>Verified rider</Text>
          </View>
        )}

        {loading && available.length === 0 && mine.length === 0 ? (
          <ActivityIndicator color={Brand.primary} style={{ marginTop: Spacing.five }} />
        ) : null}

        {/* My active deliveries */}
        {mine.length > 0 && (
          <>
            <Text style={[styles.section, { color: c.textSecondary }]}>Your active deliveries</Text>
            {mine.map((job) => (
              <ActiveJob key={job.id} job={job} c={c} glass={glass} onStart={() => start(job)} onComplete={(code) => complete(job, code)} />
            ))}
          </>
        )}

        {/* Available jobs */}
        <Text style={[styles.section, { color: c.textSecondary }]}>Available jobs {available.length ? `(${available.length})` : ''}</Text>
        {available.length === 0 && !loading ? (
          <Text style={[styles.muted, { color: c.textSecondary }]}>No open jobs right now. Pull down to refresh.</Text>
        ) : (
          available.map((job) => (
            <View key={job.id} style={[styles.card, { backgroundColor: glass.bg, borderColor: glass.border }]}>
              <View style={[styles.iconWrap, { backgroundColor: Brand.primarySoft }]}>
                <Ionicons name={job.type === 'package' ? 'cube' : 'bag-handle'} size={20} color={Brand.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.jobTitle, { color: c.text }]} numberOfLines={1}>
                  {job.title}
                </Text>
                <Text style={[styles.jobSub, { color: c.textSecondary }]} numberOfLines={1}>
                  {job.subtitle}
                </Text>
              </View>
              <PressableScale onPress={() => accept(job)} style={[styles.accept, { backgroundColor: Brand.primary }]}>
                <Text style={styles.acceptText}>Accept</Text>
              </PressableScale>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function ActiveJob({
  job,
  c,
  glass,
  onStart,
  onComplete,
}: {
  job: Job;
  c: ThemePalette;
  glass: { bg: string; border: string };
  onStart: () => void;
  onComplete: (code: string) => void;
}) {
  const [code, setCode] = useState('');
  return (
    <View style={[styles.card, { backgroundColor: glass.bg, borderColor: glass.border, alignItems: 'stretch', flexDirection: 'column', gap: Spacing.three }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.three }}>
        <View style={[styles.iconWrap, { backgroundColor: Brand.primarySoft }]}>
          <Ionicons name={job.type === 'package' ? 'cube' : 'bag-handle'} size={20} color={Brand.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.jobTitle, { color: c.text }]} numberOfLines={1}>
            {job.title}
          </Text>
          <Text style={[styles.jobSub, { color: Brand.primary, fontWeight: '700' }]}>{job.status}</Text>
        </View>
      </View>

      {job.status === 'Accepted' ? (
        <PressableScale onPress={onStart} style={[styles.fullBtn, { backgroundColor: Brand.primary }]}>
          <Text style={styles.acceptText}>Start delivery</Text>
        </PressableScale>
      ) : (
        <View style={{ flexDirection: 'row', gap: Spacing.two }}>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Customer's 4-digit code"
            placeholderTextColor={c.textSecondary}
            keyboardType="number-pad"
            maxLength={4}
            style={[styles.codeInput, { color: c.text, borderColor: glass.border }]}
          />
          <PressableScale onPress={() => onComplete(code)} style={[styles.completeBtn, { backgroundColor: Brand.accent }]}>
            <Text style={styles.acceptText}>Complete</Text>
          </PressableScale>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', marginBottom: Spacing.three },
  verifyBanner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Brand.primary, backgroundColor: Brand.primarySoft, marginBottom: Spacing.two },
  verifyTitle: { fontSize: 14, fontWeight: '800' },
  verifySub: { fontSize: 12, marginTop: 1 },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: Spacing.two },
  verifiedText: { fontSize: 13, fontWeight: '700' },
  section: { fontSize: 13, fontWeight: '700', marginTop: Spacing.four, marginBottom: Spacing.three, textTransform: 'uppercase', letterSpacing: 0.5 },
  muted: { fontSize: 14, lineHeight: 20 },

  card: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three, borderRadius: Radius.md, borderWidth: 1, marginBottom: Spacing.three },
  iconWrap: { width: 42, height: 42, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  jobTitle: { fontSize: 15, fontWeight: '700' },
  jobSub: { fontSize: 13, marginTop: 2 },

  accept: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, borderRadius: Radius.pill },
  acceptText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  fullBtn: { paddingVertical: Spacing.three, borderRadius: Radius.pill, alignItems: 'center' },
  codeInput: { flex: 1, borderWidth: 1, borderRadius: Radius.sm, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, fontSize: 16, fontWeight: '700', letterSpacing: 2 },
  completeBtn: { paddingHorizontal: Spacing.three, justifyContent: 'center', borderRadius: Radius.sm },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.four },
  bigIcon: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.four },
  emptyTitle: { fontSize: 20, fontWeight: '800' },
  emptySub: { fontSize: 14, textAlign: 'center', marginTop: Spacing.two, maxWidth: 280, lineHeight: 20 },
  cta: { marginTop: Spacing.four, paddingHorizontal: Spacing.five, paddingVertical: Spacing.three, borderRadius: Radius.pill },
  ctaText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
});
