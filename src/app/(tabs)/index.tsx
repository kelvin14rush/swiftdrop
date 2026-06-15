import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand, Colors, Radius, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + Spacing.three, paddingBottom: Spacing.six }}
        showsVerticalScrollIndicator={false}>
        {/* Greeting + location */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greeting, { color: c.textSecondary }]}>Good day 👋</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={Brand.primary} />
              <Text style={[styles.location, { color: c.text }]}>Accra, Ghana</Text>
              <Ionicons name="chevron-down" size={16} color={c.textSecondary} />
            </View>
          </View>
          <View style={[styles.avatar, { backgroundColor: Brand.primarySoft }]}>
            <Ionicons name="notifications-outline" size={22} color={Brand.primaryDark} />
          </View>
        </View>

        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: Brand.primary }]}>
          <Text style={styles.heroTitle}>Get anything{'\n'}done, fast.</Text>
          <Text style={styles.heroSub}>Send a parcel or have a rider buy what you need — delivered in minutes.</Text>
          <View style={styles.heroBadge}>
            <Ionicons name="flash" size={14} color={Brand.primaryDark} />
            <Text style={[styles.heroBadgeText, { color: Brand.primaryDark }]}>Avg. 25 min</Text>
          </View>
        </View>

        {/* Two main actions */}
        <Text style={[styles.sectionTitle, { color: c.text }]}>What do you need?</Text>

        <ActionCard
          title="Send a package"
          subtitle="Errands, documents, parcels"
          icon="cube"
          tint={Brand.primary}
          c={c}
          onPress={() => router.push('/new-delivery')}
        />
        <ActionCard
          title="Buy me something"
          subtitle="A rider buys & delivers it to you"
          icon="bag-handle"
          tint={Brand.accent}
          c={c}
          onPress={() => router.push('/buy-me')}
        />

        {/* How it works */}
        <Text style={[styles.sectionTitle, { color: c.text }]}>How it works</Text>
        <View style={styles.stepsRow}>
          <Step n="1" label="Tell us what you need" color={c} />
          <Step n="2" label="A rider accepts" color={c} />
          <Step n="3" label="Track & pay" color={c} />
        </View>

        {/* Reassurance strip */}
        <View style={[styles.promo, { backgroundColor: c.backgroundElement }]}>
          <Ionicons name="shield-checkmark" size={22} color={Brand.accent} />
          <Text style={[styles.promoText, { color: c.text }]}>
            Pay with mobile money. Track your rider live, every step.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function ActionCard({
  title,
  subtitle,
  icon,
  tint,
  c,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  c: (typeof Colors)['light'];
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionCard,
        { backgroundColor: c.card, borderColor: c.border, opacity: pressed ? 0.85 : 1 },
      ]}>
      <View style={[styles.actionIcon, { backgroundColor: tint + '1A' }]}>
        <Ionicons name={icon} size={26} color={tint} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.actionTitle, { color: c.text }]}>{title}</Text>
        <Text style={[styles.actionSub, { color: c.textSecondary }]}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color={c.textSecondary} />
    </Pressable>
  );
}

function Step({ n, label, color }: { n: string; label: string; color: (typeof Colors)['light'] }) {
  return (
    <View style={styles.step}>
      <View style={[styles.stepBubble, { backgroundColor: Brand.primarySoft }]}>
        <Text style={[styles.stepNum, { color: Brand.primaryDark }]}>{n}</Text>
      </View>
      <Text style={[styles.stepLabel, { color: color.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.four,
  },
  greeting: { fontSize: 14, fontWeight: '500' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  location: { fontSize: 18, fontWeight: '700' },
  avatar: { width: 44, height: 44, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },

  hero: {
    marginHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    marginBottom: Spacing.five,
  },
  heroTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', lineHeight: 32 },
  heroSub: { color: '#FFE9D6', fontSize: 14, marginTop: Spacing.two, lineHeight: 20 },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    marginTop: Spacing.three,
  },
  heroBadgeText: { fontSize: 12, fontWeight: '700' },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
  },

  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  actionIcon: { width: 52, height: 52, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  actionTitle: { fontSize: 16, fontWeight: '700' },
  actionSub: { fontSize: 13, marginTop: 2 },

  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.five,
    gap: Spacing.two,
  },
  step: { flex: 1, alignItems: 'center' },
  stepBubble: { width: 36, height: 36, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },
  stepNum: { fontWeight: '800', fontSize: 16 },
  stepLabel: { fontSize: 12, textAlign: 'center', marginTop: Spacing.two },

  promo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginHorizontal: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
  },
  promoText: { flex: 1, fontSize: 13, fontWeight: '500', lineHeight: 19 },
});
