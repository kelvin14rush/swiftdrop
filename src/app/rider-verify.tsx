import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { PressableScale } from '@/components/motion';
import { Brand, Colors, Radius, Spacing, type ThemePalette } from '@/constants/theme';
import { useProfile } from '@/lib/profile';

export default function RiderVerify() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const { profile, update } = useProfile();

  const [idImage, setIdImage] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function pickId() {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.5 });
    if (!res.canceled) setIdImage(res.assets[0].uri);
  }

  async function takeSelfie() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Camera access needed', 'Please allow the camera so we can take your liveness selfie.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ cameraType: ImagePicker.CameraType.front, quality: 0.5 });
    if (!res.canceled) setSelfie(res.assets[0].uri);
  }

  function submit() {
    if (!idImage || !selfie) return;
    setBusy(true);
    // Demo: auto-approves. In production a KYC provider (e.g. Smile ID) verifies the
    // ID, runs a liveness check, and matches the selfie to the ID photo.
    setTimeout(() => {
      update({ riderStatus: 'verified' });
      setBusy(false);
      Alert.alert('Verified ✅', 'You’re verified and can start accepting deliveries.', [
        { text: 'Start riding', onPress: () => router.back() },
      ]);
    }, 900);
  }

  if (profile.riderStatus === 'verified') {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <View style={[styles.badge, { backgroundColor: Brand.accent }]}>
          <Ionicons name="shield-checkmark" size={44} color="#FFFFFF" />
        </View>
        <Text style={[styles.title, { color: c.text }]}>You’re a verified rider</Text>
        <Text style={[styles.sub, { color: c.textSecondary }]}>Your identity is confirmed. You can accept and deliver jobs.</Text>
        <PressableScale onPress={() => router.back()} style={[styles.cta, { backgroundColor: Brand.primary }]}>
          <Text style={styles.ctaText}>Back to rider mode</Text>
        </PressableScale>
      </View>
    );
  }

  const ready = !!idImage && !!selfie && !busy;

  return (
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={{ padding: Spacing.three, paddingBottom: Spacing.six }}>
      <Text style={[styles.heading, { color: c.text }]}>Get verified to deliver</Text>
      <Text style={[styles.lead, { color: c.textSecondary }]}>
        For everyone’s safety, riders verify their identity before accepting jobs. In production this is handled by a KYC
        provider (e.g. Smile ID) — ID check, liveness, and a face match.
      </Text>

      <Capture c={c} label="Government ID (Ghana Card)" icon="card-outline" image={idImage} onPress={pickId} />
      <Capture c={c} label="Liveness selfie" icon="happy-outline" image={selfie} onPress={takeSelfie} />

      <PressableScale disabled={!ready} onPress={submit} style={[styles.submit, { backgroundColor: Brand.primary }]}>
        <Text style={styles.submitText}>{busy ? 'Verifying…' : 'Submit for verification'}</Text>
      </PressableScale>
    </ScrollView>
  );
}

function Capture({
  c,
  label,
  icon,
  image,
  onPress,
}: {
  c: ThemePalette;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  image: string | null;
  onPress: () => void;
}) {
  return (
    <PressableScale haptic onPress={onPress} style={[styles.capture, { backgroundColor: c.card, borderColor: image ? Brand.accent : c.border }]}>
      {image ? (
        <Image source={{ uri: image }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.placeholder, { backgroundColor: c.backgroundElement }]}>
          <Ionicons name={icon} size={24} color={Brand.primary} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={[styles.captureLabel, { color: c.text }]}>{label}</Text>
        <Text style={[styles.captureHint, { color: image ? Brand.accent : c.textSecondary }]}>{image ? 'Captured ✓ — tap to retake' : 'Tap to capture'}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={c.textSecondary} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 22, fontWeight: '800', marginTop: Spacing.two },
  lead: { fontSize: 14, lineHeight: 20, marginTop: Spacing.two, marginBottom: Spacing.four },

  capture: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three, borderRadius: Radius.md, borderWidth: 1.5, marginBottom: Spacing.three },
  thumb: { width: 56, height: 56, borderRadius: Radius.sm },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  captureLabel: { fontSize: 15, fontWeight: '700' },
  captureHint: { fontSize: 12, marginTop: 2, fontWeight: '600' },

  submit: { marginTop: Spacing.three, borderRadius: Radius.pill, paddingVertical: Spacing.three, alignItems: 'center' },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.four },
  badge: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.four },
  title: { fontSize: 20, fontWeight: '800' },
  sub: { fontSize: 14, textAlign: 'center', marginTop: Spacing.two, maxWidth: 280, lineHeight: 20 },
  cta: { marginTop: Spacing.four, paddingHorizontal: Spacing.five, paddingVertical: Spacing.three, borderRadius: Radius.pill },
  ctaText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
});
