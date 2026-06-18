import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import { LocationPicker } from '@/components/location-picker';
import { PACKAGE_SIZES } from '@/constants/mock';
import { Brand, Colors, Radius, Spacing, type ThemePalette } from '@/constants/theme';
import { useOrders } from '@/lib/orders';
import { PRICING, quotePackage, type Coord } from '@/lib/pricing';

export default function NewDeliveryScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];

  const [pickup, setPickup] = useState<Coord | null>(null);
  const [dropoff, setDropoff] = useState<Coord | null>(null);
  const [pickupLabel, setPickupLabel] = useState('');
  const [dropoffLabel, setDropoffLabel] = useState('');
  const [note, setNote] = useState('');
  const [sizeId, setSizeId] = useState('small');
  const { addOrder } = useOrders();

  const size = PACKAGE_SIZES.find((s) => s.id === sizeId)!;
  const quote = quotePackage(pickup, dropoff, sizeId);
  const ready = quote.ready;

  function findRider() {
    const fromTo = `${pickupLabel.trim() || 'Pickup'} → ${dropoffLabel.trim() || 'Drop-off'}`;
    addOrder({
      type: 'package',
      title: `Send a ${size.label.toLowerCase()} package`,
      subtitle: `${fromTo} • ${quote.km.toFixed(1)} km`,
      total: quote.total,
    });
    router.replace('/order-confirmed');
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: Spacing.three, paddingBottom: Spacing.six }} keyboardShouldPersistTaps="handled">
        <Text style={[styles.sectionTitle, { color: c.text, marginTop: 0 }]}>Set pickup &amp; drop-off</Text>
        <LocationPicker pickup={pickup} dropoff={dropoff} onChange={(p, d) => { setPickup(p); setDropoff(d); }} c={c} />

        <Text style={[styles.sectionTitle, { color: c.text }]}>Labels (optional)</Text>
        <View style={[styles.field, { backgroundColor: c.card, borderColor: c.border }]}>
          <Ionicons name="ellipse" size={12} color={Brand.accent} />
          <TextInput
            value={pickupLabel}
            onChangeText={setPickupLabel}
            placeholder="Pickup name, e.g. Home"
            placeholderTextColor={c.textSecondary}
            style={[styles.fieldInput, { color: c.text }]}
          />
        </View>
        <View style={[styles.field, { backgroundColor: c.card, borderColor: c.border, marginTop: Spacing.two }]}>
          <Ionicons name="location" size={14} color={Brand.primary} />
          <TextInput
            value={dropoffLabel}
            onChangeText={setDropoffLabel}
            placeholder="Drop-off name, e.g. Office"
            placeholderTextColor={c.textSecondary}
            style={[styles.fieldInput, { color: c.text }]}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: c.text }]}>Package size</Text>
        <View style={styles.sizeRow}>
          {PACKAGE_SIZES.map((s) => {
            const active = s.id === sizeId;
            return (
              <Pressable
                key={s.id}
                onPress={() => setSizeId(s.id)}
                style={[styles.sizeChip, { backgroundColor: active ? Brand.primarySoft : c.card, borderColor: active ? Brand.primary : c.border }]}>
                <Text style={{ fontSize: 24 }}>{s.emoji}</Text>
                <Text style={[styles.sizeLabel, { color: c.text }]}>{s.label}</Text>
                <Text style={[styles.sizeHint, { color: c.textSecondary }]}>{s.hint}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.sectionTitle, { color: c.text }]}>Note for the rider (optional)</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="e.g. Call when you reach the gate"
          placeholderTextColor={c.textSecondary}
          multiline
          style={[styles.note, { backgroundColor: c.card, borderColor: c.border, color: c.text }]}
        />

        {/* Distance-based price */}
        <View style={[styles.summary, { backgroundColor: c.card, borderColor: c.border }]}>
          <Row label="Distance" value={ready ? `${quote.km.toFixed(1)} km` : '—'} c={c} />
          <Row label="Base + per-km" value={ready ? `GHS ${PRICING.baseFare} + ${PRICING.perKm}/km` : '—'} c={c} />
          <Row label={`${size.label} package`} value={`+ GHS ${PRICING.sizeAddon[sizeId] ?? 0}`} c={c} />
          <View style={[styles.divider, { backgroundColor: c.border }]} />
          <Row label="Estimated total" value={ready ? `GHS ${quote.total}` : '—'} c={c} bold />
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: c.background, borderTopColor: c.border }]}>
        <Pressable
          disabled={!ready}
          onPress={findRider}
          style={({ pressed }) => [styles.cta, { backgroundColor: ready ? Brand.primary : c.backgroundSelected, opacity: pressed ? 0.85 : 1 }]}>
          <Ionicons name="bicycle" size={20} color={ready ? '#FFFFFF' : c.textSecondary} />
          <Text style={[styles.ctaText, { color: ready ? '#FFFFFF' : c.textSecondary }]}>
            {ready ? `Find a rider • GHS ${quote.total}` : 'Set pickup & drop-off on the map'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Row({ label, value, c, bold }: { label: string; value: string; c: ThemePalette; bold?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={{ color: bold ? c.text : c.textSecondary, fontSize: bold ? 16 : 14, fontWeight: bold ? '800' : '500' }}>{label}</Text>
      <Text style={{ color: bold ? Brand.primary : c.text, fontSize: bold ? 16 : 14, fontWeight: bold ? '800' : '600' }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 15, fontWeight: '700', marginTop: Spacing.four, marginBottom: Spacing.three },

  field: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, borderRadius: Radius.md, borderWidth: 1, paddingHorizontal: Spacing.three },
  fieldInput: { flex: 1, fontSize: 15, fontWeight: '600', paddingVertical: Platform.OS === 'ios' ? 14 : 10 },

  sizeRow: { flexDirection: 'row', gap: Spacing.two },
  sizeChip: { flex: 1, alignItems: 'center', borderRadius: Radius.md, borderWidth: 1.5, paddingVertical: Spacing.three, gap: 2 },
  sizeLabel: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  sizeHint: { fontSize: 10, textAlign: 'center', paddingHorizontal: 4 },

  note: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.three, minHeight: 64, fontSize: 15, textAlignVertical: 'top' },

  summary: { marginTop: Spacing.four, borderRadius: Radius.md, borderWidth: 1, padding: Spacing.three },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  divider: { height: 1, marginVertical: Spacing.two },

  footer: { padding: Spacing.three, borderTopWidth: 1 },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.two, paddingVertical: Spacing.three, borderRadius: Radius.pill },
  ctaText: { fontSize: 16, fontWeight: '800' },
});
