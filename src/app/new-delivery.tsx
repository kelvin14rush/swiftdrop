import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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

import { PACKAGE_SIZES } from '@/constants/mock';
import { Brand, Colors, Radius, Spacing } from '@/constants/theme';
import { useOrders } from '@/lib/orders';

const SERVICE_FEE = 5; // flat GHS for now; real pricing comes from distance later

export default function NewDeliveryScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [note, setNote] = useState('');
  const [sizeId, setSizeId] = useState('small');
  const { addOrder } = useOrders();

  const size = PACKAGE_SIZES.find((s) => s.id === sizeId)!;
  const total = size.baseGHS + SERVICE_FEE;
  const ready = pickup.trim().length > 2 && dropoff.trim().length > 2;

  function findRider() {
    addOrder({
      type: 'package',
      title: `Send a ${size.label.toLowerCase()} package`,
      subtitle: `${pickup} → ${dropoff}`,
      total,
    });
    Alert.alert('Order placed 🎉', 'A rider is being matched. You can track it under Orders.', [
      { text: 'View orders', onPress: () => router.replace('/orders') },
    ]);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={{ backgroundColor: c.background }}
        contentContainerStyle={{ padding: Spacing.three, paddingBottom: Spacing.six }}
        keyboardShouldPersistTaps="handled">
        {/* Route inputs */}
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          <Field
            icon="ellipse"
            iconColor={Brand.accent}
            label="Pickup from"
            placeholder="e.g. East Legon, Accra"
            value={pickup}
            onChange={setPickup}
            c={c}
          />
          <View style={[styles.divider, { backgroundColor: c.border }]} />
          <Field
            icon="location"
            iconColor={Brand.primary}
            label="Deliver to"
            placeholder="e.g. Osu, Accra"
            value={dropoff}
            onChange={setDropoff}
            c={c}
          />
        </View>

        {/* Package size */}
        <Text style={[styles.sectionTitle, { color: c.text }]}>Package size</Text>
        <View style={styles.sizeRow}>
          {PACKAGE_SIZES.map((s) => {
            const active = s.id === sizeId;
            return (
              <Pressable
                key={s.id}
                onPress={() => setSizeId(s.id)}
                style={[
                  styles.sizeChip,
                  { backgroundColor: c.card, borderColor: active ? Brand.primary : c.border },
                  active && { backgroundColor: Brand.primarySoft },
                ]}>
                <Text style={{ fontSize: 26 }}>{s.emoji}</Text>
                <Text style={[styles.sizeLabel, { color: c.text }]}>{s.label}</Text>
                <Text style={[styles.sizeHint, { color: c.textSecondary }]}>{s.hint}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Note */}
        <Text style={[styles.sectionTitle, { color: c.text }]}>Note for the rider (optional)</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="e.g. Call when you arrive at the gate"
          placeholderTextColor={c.textSecondary}
          multiline
          style={[styles.note, { backgroundColor: c.card, borderColor: c.border, color: c.text }]}
        />

        {/* Price summary */}
        <View style={[styles.summary, { backgroundColor: c.card, borderColor: c.border }]}>
          <SummaryRow label={`${size.label} package`} value={`GHS ${size.baseGHS}`} c={c} />
          <SummaryRow label="Service fee" value={`GHS ${SERVICE_FEE}`} c={c} />
          <View style={[styles.divider, { backgroundColor: c.border, marginVertical: Spacing.two }]} />
          <SummaryRow label="Estimated total" value={`GHS ${total}`} c={c} bold />
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={[styles.footer, { backgroundColor: c.background, borderTopColor: c.border }]}>
        <Pressable
          disabled={!ready}
          onPress={findRider}
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: ready ? Brand.primary : c.backgroundSelected, opacity: pressed ? 0.85 : 1 },
          ]}>
          <Ionicons name="bicycle" size={20} color={ready ? '#FFFFFF' : c.textSecondary} />
          <Text style={[styles.ctaText, { color: ready ? '#FFFFFF' : c.textSecondary }]}>
            {ready ? `Find a rider • GHS ${total}` : 'Enter pickup & drop-off'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Field({
  icon,
  iconColor,
  label,
  placeholder,
  value,
  onChange,
  c,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (t: string) => void;
  c: (typeof Colors)['light'];
}) {
  return (
    <View style={styles.field}>
      <Ionicons name={icon} size={14} color={iconColor} style={{ marginTop: 6 }} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.fieldLabel, { color: c.textSecondary }]}>{label}</Text>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={c.textSecondary}
          style={[styles.fieldInput, { color: c.text }]}
        />
      </View>
    </View>
  );
}

function SummaryRow({ label, value, c, bold }: { label: string; value: string; c: (typeof Colors)['light']; bold?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[{ color: bold ? c.text : c.textSecondary, fontSize: bold ? 16 : 14, fontWeight: bold ? '800' : '500' }]}>
        {label}
      </Text>
      <Text style={[{ color: bold ? Brand.primary : c.text, fontSize: bold ? 16 : 14, fontWeight: bold ? '800' : '600' }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: Radius.md, borderWidth: 1, paddingHorizontal: Spacing.three },
  field: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.three, paddingVertical: Spacing.three },
  fieldLabel: { fontSize: 12, fontWeight: '600' },
  fieldInput: { fontSize: 16, fontWeight: '600', paddingVertical: Platform.OS === 'ios' ? 4 : 0 },
  divider: { height: 1, marginLeft: 26 },

  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: Spacing.four, marginBottom: Spacing.three },

  sizeRow: { flexDirection: 'row', gap: Spacing.two },
  sizeChip: { flex: 1, alignItems: 'center', borderRadius: Radius.md, borderWidth: 1.5, paddingVertical: Spacing.three, gap: 2 },
  sizeLabel: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  sizeHint: { fontSize: 10, textAlign: 'center', paddingHorizontal: 4 },

  note: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.three, minHeight: 70, fontSize: 15, textAlignVertical: 'top' },

  summary: { marginTop: Spacing.four, borderRadius: Radius.md, borderWidth: 1, padding: Spacing.three },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },

  footer: { padding: Spacing.three, borderTopWidth: 1 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    borderRadius: Radius.pill,
  },
  ctaText: { fontSize: 16, fontWeight: '800' },
});
