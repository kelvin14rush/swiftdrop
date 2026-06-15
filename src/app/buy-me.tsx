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

import { BUY_SUGGESTIONS } from '@/constants/mock';
import { Brand, Colors, Radius, Spacing } from '@/constants/theme';
import { useOrders } from '@/lib/orders';

const DELIVERY_FEE = 15; // flat GHS for now; real pricing comes from distance later

export default function BuyMeScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];

  const [category, setCategory] = useState('food');
  const [items, setItems] = useState('');
  const [shop, setShop] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [budget, setBudget] = useState('');
  const { addOrder } = useOrders();

  const ready = items.trim().length > 2 && dropoff.trim().length > 2;

  function findRider() {
    const firstLine = items.trim().split('\n')[0].slice(0, 40);
    addOrder({
      type: 'buy',
      title: firstLine ? `Buy: ${firstLine}` : 'Shopping errand',
      subtitle: `Deliver to ${dropoff}`,
      total: DELIVERY_FEE,
    });
    Alert.alert('Order placed 🎉', "We're matching you with a rider. Track it under Orders.", [
      { text: 'View orders', onPress: () => router.replace('/orders') },
    ]);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={{ backgroundColor: c.background }}
        contentContainerStyle={{ padding: Spacing.three, paddingBottom: Spacing.six }}
        keyboardShouldPersistTaps="handled">
        {/* Category quick-picks */}
        <Text style={[styles.sectionTitle, { color: c.text, marginTop: 0 }]}>What kind of errand?</Text>
        <View style={styles.chipsWrap}>
          {BUY_SUGGESTIONS.map((s) => {
            const active = s.id === category;
            return (
              <Pressable
                key={s.id}
                onPress={() => setCategory(s.id)}
                style={[
                  styles.chip,
                  { backgroundColor: active ? Brand.primarySoft : c.card, borderColor: active ? Brand.primary : c.border },
                ]}>
                <Text style={{ fontSize: 16 }}>{s.emoji}</Text>
                <Text style={[styles.chipText, { color: active ? Brand.primaryDark : c.text }]}>{s.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* What to buy */}
        <Text style={[styles.sectionTitle, { color: c.text }]}>What should we buy?</Text>
        <TextInput
          value={items}
          onChangeText={setItems}
          placeholder={'e.g. 2 jollof with chicken,\n1 bottle of water'}
          placeholderTextColor={c.textSecondary}
          multiline
          style={[styles.box, { backgroundColor: c.card, borderColor: c.border, color: c.text, minHeight: 90 }]}
        />

        {/* Where to buy */}
        <Text style={[styles.sectionTitle, { color: c.text }]}>Where to buy (optional)</Text>
        <TextInput
          value={shop}
          onChangeText={setShop}
          placeholder="e.g. Mama Gold Kitchen, East Legon"
          placeholderTextColor={c.textSecondary}
          style={[styles.box, { backgroundColor: c.card, borderColor: c.border, color: c.text }]}
        />

        {/* Deliver to */}
        <Text style={[styles.sectionTitle, { color: c.text }]}>Deliver to</Text>
        <View style={[styles.fieldRow, { backgroundColor: c.card, borderColor: c.border }]}>
          <Ionicons name="location" size={18} color={Brand.primary} />
          <TextInput
            value={dropoff}
            onChangeText={setDropoff}
            placeholder="e.g. Osu, Accra"
            placeholderTextColor={c.textSecondary}
            style={[styles.fieldInput, { color: c.text }]}
          />
        </View>

        {/* Budget */}
        <Text style={[styles.sectionTitle, { color: c.text }]}>Max budget for items (optional)</Text>
        <View style={[styles.fieldRow, { backgroundColor: c.card, borderColor: c.border }]}>
          <Text style={[styles.ghs, { color: c.textSecondary }]}>GHS</Text>
          <TextInput
            value={budget}
            onChangeText={setBudget}
            placeholder="e.g. 100"
            keyboardType="numeric"
            placeholderTextColor={c.textSecondary}
            style={[styles.fieldInput, { color: c.text }]}
          />
        </View>

        {/* Fee note */}
        <View style={[styles.summary, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={styles.summaryRow}>
            <Text style={{ color: c.textSecondary, fontSize: 14 }}>Delivery fee</Text>
            <Text style={{ color: c.text, fontSize: 14, fontWeight: '700' }}>GHS {DELIVERY_FEE}</Text>
          </View>
          <Text style={[styles.note, { color: c.textSecondary }]}>
            You pay the cost of the items to the rider on delivery. The rider confirms the price before buying.
          </Text>
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
            {ready ? `Find a rider • GHS ${DELIVERY_FEE} delivery` : 'Add items & delivery address'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 15, fontWeight: '700', marginTop: Spacing.four, marginBottom: Spacing.three },

  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
  },
  chipText: { fontSize: 13, fontWeight: '600' },

  box: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.three, fontSize: 15, textAlignVertical: 'top' },

  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
  },
  fieldInput: { flex: 1, fontSize: 15, fontWeight: '600', paddingVertical: Platform.OS === 'ios' ? 14 : 12 },
  ghs: { fontSize: 14, fontWeight: '700' },

  summary: { marginTop: Spacing.four, borderRadius: Radius.md, borderWidth: 1, padding: Spacing.three },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  note: { fontSize: 12, marginTop: Spacing.two, lineHeight: 18 },

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
