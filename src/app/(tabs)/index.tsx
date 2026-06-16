import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Dimensions, Easing, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/aurora';
import { Counter, FadeInView, Reveal, Skeleton, useReducedMotion } from '@/components/motion';
import { Brand, Colors, glassColors, Radius, Spacing, type ThemePalette } from '@/constants/theme';

const SCREEN_W = Dimensions.get('window').width;

type Glass = { bg: string; border: string };

export default function HomeScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  const glass: Glass = glassColors(scheme);

  return (
    <View style={{ flex: 1 }}>
      <AuroraBackground />

      <Animated.ScrollView
        style={{ backgroundColor: 'transparent' }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
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
          <Pressable onPress={() => router.push('/notifications')} style={[styles.avatar, { backgroundColor: glass.bg, borderColor: glass.border, borderWidth: 1 }]}>
            <Ionicons name="notifications-outline" size={22} color={Brand.primary} />
          </Pressable>
        </FadeInView>

        {/* Hero */}
        <FadeInView delay={80} style={styles.heroWrap}>
          <LinearGradient colors={['#FF9A2E', '#FF6B00', '#F23D02']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
            <HeroBackground />
            <Shine />
            <HeroParticles />
            <Text style={styles.heroTitle}>Get anything{'\n'}done, fast.</Text>
            <Text style={styles.heroSub}>Send a parcel or have a rider buy what you need — delivered in minutes.</Text>
            <HeroBadge />
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
            glass={glass}
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
            glass={glass}
            onPress={() => router.push('/buy-me')}
          />
        </FadeInView>

        {/* Stats (skeleton -> animated counters) */}
        <FadeInView delay={380}>
          <StatsStrip c={c} glass={glass} />
        </FadeInView>

        {/* How it works (scroll-reveal) */}
        <Reveal scrollY={scrollY}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>How it works</Text>
          <View style={styles.stepsRow}>
            <Step n="1" label="Tell us what you need" color={c} />
            <Step n="2" label="A rider accepts" color={c} />
            <Step n="3" label="Track & pay" color={c} />
          </View>
        </Reveal>

        {/* Trust / security (scroll-reveal) */}
        <Reveal scrollY={scrollY}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>Safe &amp; secure</Text>
          <View style={[styles.trust, { backgroundColor: glass.bg, borderColor: glass.border }]}>
            <TrustItem icon="shield-checkmark" color={Brand.accent} label="Verified riders" c={c} />
            <View style={[styles.trustDivider, { backgroundColor: glass.border }]} />
            <View style={styles.trustItem}>
              <LiveDot />
              <Text style={[styles.trustLabel, { color: c.text }]}>Live tracking</Text>
            </View>
            <View style={[styles.trustDivider, { backgroundColor: glass.border }]} />
            <TrustItem icon="key" color={Brand.primary} label="Delivery code" c={c} />
          </View>
        </Reveal>
      </Animated.ScrollView>
    </View>
  );
}

/* ---------------- Stats ---------------- */

function StatsStrip({ c, glass }: { c: ThemePalette; glass: Glass }) {
  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(reduced);
  useEffect(() => {
    if (reduced) {
      setLoaded(true);
      return;
    }
    const t = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <View style={[styles.stats, { backgroundColor: glass.bg, borderColor: glass.border }]}>
      <StatCell c={c} label="Deliveries" loaded={loaded}>
        <Counter value={12000} suffix="+" style={[styles.statNum, { color: c.text }]} />
      </StatCell>
      <View style={[styles.statSep, { backgroundColor: glass.border }]} />
      <StatCell c={c} label="Avg. time" loaded={loaded}>
        <Counter value={25} suffix="m" style={[styles.statNum, { color: c.text }]} />
      </StatCell>
      <View style={[styles.statSep, { backgroundColor: glass.border }]} />
      <StatCell c={c} label="Rating" loaded={loaded}>
        <Counter value={4.9} decimals={1} style={[styles.statNum, { color: c.text }]} />
      </StatCell>
    </View>
  );
}

function StatCell({ c, label, loaded, children }: { c: ThemePalette; label: string; loaded: boolean; children: ReactNode }) {
  return (
    <View style={styles.statCell}>
      {loaded ? children : <Skeleton width={46} height={22} radius={6} />}
      <Text style={[styles.statLabel, { color: c.textSecondary }]}>{label}</Text>
    </View>
  );
}

/* ---------------- Animated hero decor ---------------- */

function HeroBadge() {
  const reduced = useReducedMotion();
  const s = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (reduced) return;
    const l = Animated.loop(
      Animated.sequence([
        Animated.timing(s, { toValue: 1.06, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(s, { toValue: 1, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ]),
    );
    l.start();
    return () => l.stop();
  }, [reduced, s]);
  return (
    <Animated.View style={[styles.heroBadge, { transform: [{ scale: s }] }]}>
      <Ionicons name="flash" size={14} color={Brand.primaryDark} />
      <Text style={[styles.heroBadgeText, { color: Brand.primaryDark }]}>Avg. 25 min</Text>
    </Animated.View>
  );
}

function HeroParticles() {
  const reduced = useReducedMotion();
  const dots = useRef(
    Array.from({ length: 6 }).map(() => ({
      v: new Animated.Value(0),
      x: 16 + Math.random() * (SCREEN_W - 90),
      size: 4 + Math.random() * 5,
      dur: 4000 + Math.random() * 3000,
      delay: Math.random() * 3000,
    })),
  ).current;
  useEffect(() => {
    if (reduced) return;
    const ls = dots.map((d) =>
      Animated.loop(Animated.timing(d.v, { toValue: 1, duration: d.dur, delay: d.delay, useNativeDriver: true, easing: Easing.linear })),
    );
    ls.forEach((l) => l.start());
    return () => ls.forEach((l) => l.stop());
  }, [reduced, dots]);
  if (reduced) return null;
  return (
    <>
      {dots.map((d, i) => {
        const translateY = d.v.interpolate({ inputRange: [0, 1], outputRange: [170, -20] });
        const opacity = d.v.interpolate({ inputRange: [0, 0.15, 0.85, 1], outputRange: [0, 0.7, 0.7, 0] });
        return (
          <Animated.View
            key={i}
            pointerEvents="none"
            style={{ position: 'absolute', left: d.x, bottom: 0, width: d.size, height: d.size, borderRadius: d.size / 2, backgroundColor: 'rgba(255,255,255,0.9)', opacity, transform: [{ translateY }] }}
          />
        );
      })}
    </>
  );
}

function HeroBackground() {
  const reduced = useReducedMotion();
  const shift = useRef(new Animated.Value(0)).current;
  const b1 = useRef(new Animated.Value(0)).current;
  const b2 = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const breathe = (v: Animated.Value, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, { toValue: 1, duration, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(v, { toValue: 0, duration, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        ]),
      );
    const loops = [breathe(shift, 3500), breathe(b1, 6000), breathe(b2, 7500)];
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [reduced, shift, b1, b2]);

  const overlayOpacity = reduced ? 0.25 : shift.interpolate({ inputRange: [0, 1], outputRange: [0, 0.6] });
  const b1t = {
    transform: [
      { translateX: b1.interpolate({ inputRange: [0, 1], outputRange: [0, 26] }) },
      { translateY: b1.interpolate({ inputRange: [0, 1], outputRange: [0, 18] }) },
      { scale: b1.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] }) },
    ],
  };
  const b2t = {
    transform: [
      { translateX: b2.interpolate({ inputRange: [0, 1], outputRange: [0, -22] }) },
      { translateY: b2.interpolate({ inputRange: [0, 1], outputRange: [0, -16] }) },
      { scale: b2.interpolate({ inputRange: [0, 1], outputRange: [1.15, 0.85] }) },
    ],
  };

  return (
    <>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: overlayOpacity }]}>
        <LinearGradient colors={['#FFC24B', '#FF477E', '#F23D02']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <Animated.View pointerEvents="none" style={[styles.blob1, b1t]} />
      <Animated.View pointerEvents="none" style={[styles.blob2, b2t]} />
    </>
  );
}

function Scooter() {
  const reduced = useReducedMotion();
  const x = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const a = Animated.loop(Animated.timing(x, { toValue: 1, duration: 3400, delay: 500, useNativeDriver: true, easing: Easing.linear }));
    const b = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 450, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(bob, { toValue: 0, duration: 450, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ]),
    );
    a.start();
    b.start();
    return () => {
      a.stop();
      b.stop();
    };
  }, [reduced, x, bob]);
  if (reduced) return null;
  const translateX = x.interpolate({ inputRange: [0, 1], outputRange: [-70, SCREEN_W - 10] });
  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -5] });
  return <Animated.Text style={[styles.scooter, { transform: [{ translateX }, { translateY }, { scaleX: -1 }] }]}>🛵</Animated.Text>;
}

function Shine() {
  const reduced = useReducedMotion();
  const x = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const l = Animated.loop(Animated.timing(x, { toValue: 1, duration: 2400, delay: 1000, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }));
    l.start();
    return () => l.stop();
  }, [reduced, x]);
  if (reduced) return null;
  const translateX = x.interpolate({ inputRange: [0, 1], outputRange: [-140, SCREEN_W] });
  return <Animated.View pointerEvents="none" style={[styles.shine, { transform: [{ translateX }, { rotate: '18deg' }] }]} />;
}

function LiveDot() {
  const reduced = useReducedMotion();
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const l = Animated.loop(Animated.timing(pulse, { toValue: 1, duration: 1500, useNativeDriver: true }));
    l.start();
    return () => l.stop();
  }, [reduced, pulse]);
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });
  return (
    <View style={styles.liveWrap}>
      {!reduced && <Animated.View style={[styles.liveRing, { transform: [{ scale }], opacity }]} />}
      <View style={styles.liveCore} />
    </View>
  );
}

/* ---------------- Cards / steps ---------------- */

function ActionCard({
  title,
  subtitle,
  icon,
  gradient,
  c,
  glass,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: [string, string];
  c: ThemePalette;
  glass: Glass;
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
        { backgroundColor: glass.bg, borderColor: glass.border, opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] },
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
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  hero: { padding: Spacing.four, overflow: 'hidden', minHeight: 190 },
  blob1: { position: 'absolute', top: -40, right: -30, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.18)' },
  blob2: { position: 'absolute', bottom: -50, left: -20, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.12)' },
  shine: { position: 'absolute', top: -60, left: 0, width: 70, height: 320, backgroundColor: 'rgba(255,255,255,0.18)' },
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

  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: Spacing.two, marginBottom: Spacing.three, paddingHorizontal: Spacing.three },

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

  stats: {
    flexDirection: 'row',
    marginHorizontal: Spacing.three,
    marginTop: Spacing.two,
    marginBottom: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  statCell: { flex: 1, alignItems: 'center', gap: 4 },
  statSep: { width: 1, marginVertical: 4 },
  statNum: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600' },

  stepsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.three, marginBottom: Spacing.five, gap: Spacing.two },
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
