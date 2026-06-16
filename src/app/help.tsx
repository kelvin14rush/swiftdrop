import { Ionicons } from '@expo/vector-icons';
import { Linking, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { PressableScale } from '@/components/motion';
import { Brand, Colors, Radius, Spacing } from '@/constants/theme';

const FAQS = [
  { q: 'How do I pay?', a: 'You pay by mobile money. For "Buy me something", you also reimburse the rider for the items on delivery.' },
  { q: 'What is the delivery code?', a: 'A 4-digit code shown on your order. Give it to the rider only when your item arrives — the order can’t be completed without it.' },
  { q: 'How long does delivery take?', a: 'Most deliveries arrive in about 25 minutes, depending on distance and traffic.' },
  { q: 'Is my package safe?', a: 'Riders are verified, you can track them live, and their payment is released only after you confirm delivery.' },
];

export default function Help() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];

  return (
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={{ padding: Spacing.three }}>
      <Text style={[styles.section, { color: c.textSecondary, marginTop: 0 }]}>Frequently asked</Text>
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
        {FAQS.map((f, i) => (
          <View key={f.q} style={[styles.faq, i < FAQS.length - 1 ? { borderBottomWidth: 1, borderBottomColor: c.border } : null]}>
            <Text style={[styles.q, { color: c.text }]}>{f.q}</Text>
            <Text style={[styles.a, { color: c.textSecondary }]}>{f.a}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.section, { color: c.textSecondary }]}>Still need help?</Text>
      <PressableScale
        onPress={() => Linking.openURL('https://wa.me/233000000000').catch(() => {})}
        style={[styles.contact, { backgroundColor: c.card, borderColor: c.border }]}>
        <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
        <Text style={[styles.contactText, { color: c.text }]}>Chat on WhatsApp</Text>
        <Ionicons name="chevron-forward" size={18} color={c.textSecondary} />
      </PressableScale>
      <PressableScale
        onPress={() => Linking.openURL('mailto:support@swiftdrop.app').catch(() => {})}
        style={[styles.contact, { backgroundColor: c.card, borderColor: c.border }]}>
        <Ionicons name="mail-outline" size={22} color={Brand.primary} />
        <Text style={[styles.contactText, { color: c.text }]}>Email support</Text>
        <Ionicons name="chevron-forward" size={18} color={c.textSecondary} />
      </PressableScale>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: { fontSize: 13, fontWeight: '600', marginTop: Spacing.four, marginBottom: Spacing.three },
  card: { borderRadius: Radius.md, borderWidth: 1, overflow: 'hidden' },
  faq: { padding: Spacing.three },
  q: { fontSize: 15, fontWeight: '700' },
  a: { fontSize: 13, marginTop: Spacing.two, lineHeight: 19 },

  contact: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three, borderRadius: Radius.md, borderWidth: 1, marginBottom: Spacing.two },
  contactText: { flex: 1, fontSize: 15, fontWeight: '600' },
});
