import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { Brand, Colors, Radius, Spacing } from '@/constants/theme';

export default function About() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];

  return (
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={{ padding: Spacing.three, alignItems: 'center' }}>
      <LinearGradient colors={['#FF9A2E', '#FF6B00']} style={styles.logo}>
        <Ionicons name="bicycle" size={40} color="#FFFFFF" />
      </LinearGradient>
      <Text style={[styles.name, { color: c.text }]}>SwiftDrop</Text>
      <Text style={[styles.version, { color: c.textSecondary }]}>Version 1.0.0</Text>

      <Text style={[styles.body, { color: c.textSecondary }]}>
        SwiftDrop gets anything done, fast. Send a parcel across town or have a trusted rider buy what you need and
        bring it to your door — paid by mobile money, tracked every step of the way.
      </Text>

      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
        <Text style={[styles.cardText, { color: c.text }]}>Made with care in Ghana 🇬🇭</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  logo: { width: 84, height: 84, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.four },
  name: { fontSize: 24, fontWeight: '800', marginTop: Spacing.three },
  version: { fontSize: 13, marginTop: 2 },
  body: { fontSize: 14, textAlign: 'center', lineHeight: 21, marginTop: Spacing.four, maxWidth: 320 },
  card: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.three, marginTop: Spacing.five, width: '100%', alignItems: 'center' },
  cardText: { fontSize: 14, fontWeight: '600' },
});
