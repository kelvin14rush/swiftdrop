import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Dimensions, Easing, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand, Colors, Radius, Spacing, type ThemePalette } from '@/constants/theme';

const SCREEN_W = Dimensions.get('window').width;

export default function HomeScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: c.background }}>
      {/* Soft glow behind the top of the screen */}
      <LinearGradient
        colors={[scheme === 'dark' ? '#2A1605' : '#FFEAD8', c.background]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.45 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + Spacing.three, paddingBottom: Spacing.six }}
        showsVerticalScrollIndicator={false}>
        {/* Greeting + location */}
        <FadeInView style={styles.headerRow}>
          <View>
            <Text style={[styles.greeting, { color: c.textSecondary }]}>Good day 👋</Text>
            <Pressable onPress={() => router.push('/addresses')} style={styles.locationRow}>
              <Ionicons name="location" size={16} color={Brand.primary} />
              <Text style={[styles.location, { color: c.text }]}>Accra, Ghana</Text>
              <Ionicons name="chevron-down" size={16} color={c.textSecondary} />
            </Pressable>
          </View>
          <Pressable onPress={() => router.push('/notifications')} style={[styles.avatar, { backgroundColor: Brand.primarySoft }]}>
            <Ionicons name="notifications-outline" size={22} color={Brand.primaryDark} />
          </Pressable>
        </FadeInView>

        {/* Hero */}
        <FadeInView delay={80} style={styles.heroWrap}>
          <LinearGradient
            colors={['#FF9A2E', '#FF6B00', '#F23D02']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}>
            <View style={styles.heroCircle1} />
            <View style={styles.heroCircle2} />
            <Shine />
            <Text style={styles.heroTitle}>Get anything{'\n'}done, fast.</Text>
            <Text style={styles.heroSub}>Send a parcel or have a rider buy what you need — delivered in minutes.</Text>
            <View style={styles.heroBadge}>
              <Ionicons name="flash" size={14} color={Brand.primaryDark} />
              <Text style={[styles.heroBadgeText, { color: Brand.primaryDark }]}>Avg. 25 min</Text>
            </View>
            <Scooter />
          </LinearGradient>
        </FadeInView>

        {/* Two main actions */}
        <FadeInView delay={160}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>What do you need?</Text>
        </FadeInView>

        <FadeInView delay={220}>
          <ActionCard
            title="Send a package"
            subtitle="Errands, documents, parcels"
            icon="cube"
            gradient={['#FF9A2E', '#FF6B00']}
            c={c}
            onPress={() => router.push('/new-delivery')}
          />
        </FadeInView>
        <FadeInView delay={300}>
          <ActionCard
            title="Buy me something"
            subtitle="A rider buys & delivers it to you"
            icon="bag-handle"
            gradient={['#34D399', '#059669']}
            c={c}
            onPress={() => router.push('/buy-me')}
          />
        </FadeInView>

        {/* How it works */}
        <FadeInView delay={380}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>How it works</Text>
          <View style={styles.stepsRow}>
            <Step n="1" label="Tell us what you need" color={c} />
            <Step n="2" label="A rider accepts" color={c} />
            <Step n="3" label="Track & pay" color={c} />
          </View>
        </FadeInView>

        {/* Trust / security */}
        <FadeInView delay={460}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>Safe &amp; secure</Text>
          <View style={[styles.trust, { backgroundColor: c.card, borderColor: c.border }]}>
            <TrustItem icon="shield-checkmark" color={Brand.accent} label="Verified riders" c={c} />
            <View style={[styles.trustDivider, { backgroundColor: c.border }]} />
            <View style={styles.trustItem}>
              <LiveDot />
              <Text style={[styles.trustLabel, { color: c.text }]}>Live tracking</Text>
            </View>
            <View style={[styles.trustDivider, { backgroundColor: c.border }]} />
            <TrustItem icon="key" color={Brand.primary} label="Delivery code" c={c} />
          </View>
        </FadeInView>
      </ScrollView>
    </View>
  );
}

/** A scooter that drives across the hero on a loop. */
function Scooter() {
  const x = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(x, { toValue: 1, duration: 3400, delay: 500, useNativeDriver: true, easing: Easing.linear }),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 450, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(bob, { toValue: 0, duration: 450, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ]),
    ).start();
  }, [x, bob]);
  const translateX = x.interpolate({ inputRange: [0, 1], outputRange: [-70, SCREEN_W - 10] });
  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -5] });
  return (
    <Animated.Text style={[styles.scooter, { transform: [{ translateX }, { translateY }, { scaleX: -1 }] }]}>
      🛵
    </Animated.Text>
  );
}

/** A diagonal light band that sweeps across the hero. */
function Shine() {
  const x = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(x, { toValue: 1, duration: 2400, delay: 1000, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
    ).start();
  }, [x]);
  const translateX = x.interpolate({ inputRange: [0, 1], outputRange: [-140, SCREEN_W] });
  return <Animated.View pointerEvents="none" style={[styles.shine, { transform: [{ translateX }, { rotate: '18deg' }] }]} />;
}

/** Fade + slide-up entrance using RN's built-in animation engine. */
function FadeInView({ delay = 0, children, style }: { delay?: number; children: ReactNode; style?: any }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, delay, useNativeDriver: true, speed: 12, bounciness: 6 }),
    ]).start();
  }, [delay, opacity, translateY]);
  return <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>{children}</Animated.View>;
}

/** Pulsing "live" indicator dot. */
function LiveDot() {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.timing(pulse, { toValue: 1, duration: 1500, useNativeDriver: true })).start();
  }, [pulse]);
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });
  return (
    <View style={styles.liveWrap}>
      <Animated.View style={[styles.liveRing, { transform: [{ scale }], opacity }]} />
      <View style={styles.liveCore} />
    </View>
  );
}

function ActionCard({
  title,
  subtitle,
  icon,
  gradient,
  c,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: [string, string];
  c: ThemePalette;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={({ pressed }) => [
        styles.actionCard,
        { backgroundColor: c.card, borderColor: c.border, opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] },
      ]}>
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.actionIcon}>
        <Ionicons name={icon} size={26} color="#FFFFFF" />
      </LinearGradient>
      <View style={{ flex: 1 }}>
        <Text style={[styles.actionTitle, { color: c.text }]}>{title}</Text>
        <Text style={[styles.actionSub, { color: c.textSecondary }]}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color={c.textSecondary} />
    </Pressable>
  );
}

function Step({ n, label, color }: { n: string; label: string; color: ThemePalette }) {
  return (
    <View style={styles.step}>
      <View style={[styles.stepBubble, { backgroundColor: Brand.primarySoft }]}>
        <Text style={[styles.stepNum, { color: Brand.primaryDark }]}>{n}</Text>
      </View>
      <Text style={[styles.stepLabel, { color: color.textSecondary }]}>{label}</Text>
    </View>
  );
}

function TrustItem({ icon, color, label, c }: { icon: keyof typeof Ionicons.glyphMap; color: string; label: string; c: ThemePalette }) {
  return (
    <View style={styles.trustItem}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.trustLabel, { color: c.text }]}>{label}</Text>
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

  heroWrap: {
    marginHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    marginBottom: Spacing.five,
    overflow: 'hidden',
    shadowColor: '#FF6B00',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  hero: { padding: Spacing.four, overflow: 'hidden', minHeight: 190 },
  heroCircle1: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  heroCircle2: {
    position: 'absolute',
    bottom: -50,
    left: -20,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  shine: {
    position: 'absolute',
    top: -60,
    left: 0,
    width: 70,
    height: 320,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  scooter: { position: 'absolute', bottom: 10, left: 0, fontSize: 30 },
  heroTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', lineHeight: 32 },
  heroSub: { color: '#FFF1E6', fontSize: 14, marginTop: Spacing.two, lineHeight: 20 },
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

  trust: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  trustItem: { flex: 1, alignItems: 'center', gap: 6 },
  trustLabel: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  trustDivider: { width: 1, height: 32 },

  liveWrap: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  liveRing: { position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: Brand.accent },
  liveCore: { width: 10, height: 10, borderRadius: 5, backgroundColor: Brand.accent },
});
