import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';

import { PressableScale } from '@/components/motion';
import { Brand, Colors, Radius, Spacing } from '@/constants/theme';
import { useProfile } from '@/lib/profile';

export default function EditProfile() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const { profile, update } = useProfile();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);

  function save() {
    update({ name: name.trim(), phone: phone.trim() });
    router.back();
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: Spacing.three }} keyboardShouldPersistTaps="handled">
        <Text style={[styles.label, { color: c.textSecondary }]}>Full name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Kofi Mensah"
          placeholderTextColor={c.textSecondary}
          style={[styles.input, { backgroundColor: c.card, borderColor: c.border, color: c.text }]}
        />

        <Text style={[styles.label, { color: c.textSecondary, marginTop: Spacing.four }]}>Phone number</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="e.g. 024 123 4567"
          keyboardType="phone-pad"
          placeholderTextColor={c.textSecondary}
          style={[styles.input, { backgroundColor: c.card, borderColor: c.border, color: c.text }]}
        />

        <Text style={[styles.hint, { color: c.textSecondary }]}>
          We use your phone number to match you with a rider and send order updates.
        </Text>

        <PressableScale onPress={save} style={[styles.button, { backgroundColor: Brand.primary }]}>
          <View style={styles.buttonInner}>
            <Text style={styles.buttonText}>Save profile</Text>
          </View>
        </PressableScale>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', marginBottom: Spacing.two },
  input: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.three, fontSize: 16, fontWeight: '600' },
  hint: { fontSize: 12, marginTop: Spacing.three, lineHeight: 18 },
  button: { marginTop: Spacing.five, borderRadius: Radius.pill },
  buttonInner: { paddingVertical: Spacing.three, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
