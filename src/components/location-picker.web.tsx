import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, Radius, Spacing, type ThemePalette } from '@/constants/theme';
import type { Coord } from '@/lib/pricing';

type Props = {
  pickup: Coord | null;
  dropoff: Coord | null;
  onChange: (pickup: Coord | null, dropoff: Coord | null) => void;
  c: ThemePalette;
};

// react-native-maps is native-only; on web we offer sample points so pricing previews.
export function LocationPicker({ pickup, dropoff, onChange, c }: Props) {
  const set = () => onChange({ latitude: 5.65, longitude: -0.156 }, { latitude: 5.557, longitude: -0.182 });
  return (
    <View style={[styles.box, { backgroundColor: c.backgroundElement, borderColor: c.border }]}>
      <Ionicons name="map" size={32} color={Brand.primary} />
      <Text style={[styles.title, { color: c.text }]}>Map picker (mobile app)</Text>
      <Text style={[styles.sub, { color: c.textSecondary }]}>On the phone you tap the map to set pickup & drop-off.</Text>
      <View style={styles.row}>
        <Pressable onPress={set} style={[styles.btn, { backgroundColor: Brand.primary }]}>
          <Text style={styles.btnText}>Use sample trip</Text>
        </Pressable>
        <Pressable onPress={() => onChange(null, null)} style={[styles.btn, { backgroundColor: 'transparent', borderColor: c.border, borderWidth: 1 }]}>
          <Text style={[styles.btnText, { color: c.text }]}>Clear</Text>
        </Pressable>
      </View>
      <Text style={[styles.status, { color: c.textSecondary }]}>{pickup && dropoff ? 'Sample points set ✓' : 'No points set'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.four, alignItems: 'center' },
  title: { fontSize: 15, fontWeight: '700', marginTop: Spacing.two },
  sub: { fontSize: 12, textAlign: 'center', marginTop: 4, maxWidth: 280 },
  row: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.three },
  btn: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, borderRadius: Radius.pill },
  btnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  status: { fontSize: 12, marginTop: Spacing.three },
});
