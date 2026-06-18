import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';

import { PressableScale } from '@/components/motion';
import { Brand, Colors, Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/lib/auth';

export default function SignIn() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const { configured, signIn, signUp } = useAuth();

  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const ready = email.includes('@') && password.length >= 6 && !busy && configured;

  async function submit() {
    setError(null);
    setInfo(null);
    setBusy(true);
    const run = mode === 'in' ? signIn : signUp;
    const res = await run(email.trim(), password);
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    if (mode === 'up' && res.needsConfirmation) {
      setInfo('Account created! Check your email to confirm, then sign in.');
      setMode('in');
      return;
    }
    router.back();
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: Spacing.three }} keyboardShouldPersistTaps="handled">
        <Text style={[styles.heading, { color: c.text }]}>{mode === 'in' ? 'Welcome back' : 'Create your account'}</Text>
        <Text style={[styles.subheading, { color: c.textSecondary }]}>Sign in to sync your orders across devices.</Text>

        {!configured && (
          <View style={[styles.notice, { backgroundColor: c.backgroundElement }]}>
            <Ionicons name="information-circle-outline" size={18} color={Brand.primary} />
            <Text style={[styles.noticeText, { color: c.textSecondary }]}>
              Supabase isn’t connected yet. Add your project URL and anon key to the .env file, then restart.
            </Text>
          </View>
        )}

        {/* Mode toggle */}
        <View style={[styles.toggle, { backgroundColor: c.backgroundElement }]}>
          {(['in', 'up'] as const).map((m) => (
            <PressableScale key={m} haptic={false} onPress={() => setMode(m)} style={[styles.toggleBtn, mode === m && { backgroundColor: c.card }]}>
              <Text style={[styles.toggleText, { color: mode === m ? c.text : c.textSecondary }]}>{m === 'in' ? 'Sign in' : 'Sign up'}</Text>
            </PressableScale>
          ))}
        </View>

        <Text style={[styles.label, { color: c.textSecondary }]}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={c.textSecondary}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[styles.input, { backgroundColor: c.card, borderColor: c.border, color: c.text }]}
        />

        <Text style={[styles.label, { color: c.textSecondary, marginTop: Spacing.three }]}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          placeholderTextColor={c.textSecondary}
          secureTextEntry
          style={[styles.input, { backgroundColor: c.card, borderColor: c.border, color: c.text }]}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {info ? <Text style={[styles.info, { color: Brand.accent }]}>{info}</Text> : null}

        <PressableScale onPress={submit} disabled={!ready} style={[styles.button, { backgroundColor: Brand.primary }]}>
          <View style={styles.buttonInner}>
            {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>{mode === 'in' ? 'Sign in' : 'Create account'}</Text>}
          </View>
        </PressableScale>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 24, fontWeight: '800', marginTop: Spacing.two },
  subheading: { fontSize: 14, marginTop: Spacing.two, marginBottom: Spacing.four, lineHeight: 20 },

  notice: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start', padding: Spacing.three, borderRadius: Radius.md, marginBottom: Spacing.four },
  noticeText: { flex: 1, fontSize: 12, lineHeight: 18 },

  toggle: { flexDirection: 'row', borderRadius: Radius.pill, padding: 4, marginBottom: Spacing.four },
  toggleBtn: { flex: 1, paddingVertical: Spacing.two, alignItems: 'center', borderRadius: Radius.pill },
  toggleText: { fontSize: 14, fontWeight: '700' },

  label: { fontSize: 13, fontWeight: '600', marginBottom: Spacing.two },
  input: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.three, fontSize: 16, fontWeight: '600' },

  error: { color: '#EF4444', fontSize: 13, marginTop: Spacing.three, fontWeight: '600' },
  info: { fontSize: 13, marginTop: Spacing.three, fontWeight: '600' },

  button: { marginTop: Spacing.five, borderRadius: Radius.pill },
  buttonInner: { paddingVertical: Spacing.three, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
