import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';

import { PressableScale } from '@/components/motion';
import { Brand, Colors, Radius, Spacing } from '@/constants/theme';
import { useProfile } from '@/lib/profile';

export default function Addresses() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const { profile, addAddress, removeAddress } = useProfile();
  const [text, setText] = useState('');

  function add() {
    const a = text.trim();
    if (a.length < 3) return;
    addAddress(a);
    setText('');
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: Spacing.three }} keyboardShouldPersistTaps="handled">
        {/* Add new */}
        <View style={[styles.addRow, { backgroundColor: c.card, borderColor: c.border }]}>
          <Ionicons name="location" size={18} color={Brand.primary} />
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Add an address, e.g. Osu, Accra"
            placeholderTextColor={c.textSecondary}
            style={[styles.input, { color: c.text }]}
            onSubmitEditing={add}
            returnKeyType="done"
          />
          <PressableScale onPress={add} style={[styles.addBtn, { backgroundColor: Brand.primary }]}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </PressableScale>
        </View>

        {profile.addresses.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="map-outline" size={40} color={c.textSecondary} />
            <Text style={[styles.emptyText, { color: c.textSecondary }]}>No saved addresses yet. Add the places you order to most.</Text>
          </View>
        ) : (
          profile.addresses.map((a) => (
            <View key={a} style={[styles.item, { backgroundColor: c.card, borderColor: c.border }]}>
              <Ionicons name="location-outline" size={20} color={Brand.primary} />
              <Text style={[styles.itemText, { color: c.text }]} numberOfLines={1}>{a}</Text>
              <Pressable onPress={() => removeAddress(a)} hitSlop={8}>
                <Ionicons name="trash-outline" size={20} color={c.textSecondary} />
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  addRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, borderRadius: Radius.md, borderWidth: 1, paddingHorizontal: Spacing.three, marginBottom: Spacing.four },
  input: { flex: 1, fontSize: 15, fontWeight: '600', paddingVertical: Platform.OS === 'ios' ? 14 : 10 },
  addBtn: { width: 36, height: 36, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },

  item: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three, borderRadius: Radius.md, borderWidth: 1, marginBottom: Spacing.two },
  itemText: { flex: 1, fontSize: 15, fontWeight: '600' },

  empty: { alignItems: 'center', paddingVertical: Spacing.six, gap: Spacing.three },
  emptyText: { fontSize: 14, textAlign: 'center', maxWidth: 260, lineHeight: 20 },
});
