import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';

import { PressableScale } from '@/components/motion';
import { Brand, Colors, Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/lib/auth';
import { useOrders } from '@/lib/orders';
import { supabase } from '@/lib/supabase';

export default function Rate() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === id);

  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!supabase || !user || !order) {
      router.back();
      return;
    }
    setBusy(true);
    const { error } = await supabase.from('reviews').insert({
      order_id: order.id,
      customer_id: user.id,
      rider_id: order.riderId,
      stars,
      comment: comment.trim() || null,
    });
    setBusy(false);
    if (error) {
      if (error.code === '23505') {
        Alert.alert('Already rated', 'You’ve already reviewed this delivery.');
        router.back();
        return;
      }
      Alert.alert('Could not submit', error.message);
      return;
    }
    Alert.alert('Thanks! ⭐', 'Your review helps keep riders accountable.', [{ text: 'Done', onPress: () => router.back() }]);
  }

  return (
    <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={{ padding: Spacing.three }} keyboardShouldPersistTaps="handled">
      <Text style={[styles.heading, { color: c.text }]}>Rate your rider</Text>
      {order ? <Text style={[styles.sub, { color: c.textSecondary }]}>{order.title}</Text> : null}

      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} onPress={() => setStars(n)} hitSlop={6}>
            <Ionicons name={n <= stars ? 'star' : 'star-outline'} size={38} color={Brand.warning} />
          </Pressable>
        ))}
      </View>

      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Add a comment (optional)"
        placeholderTextColor={c.textSecondary}
        multiline
        style={[styles.input, { backgroundColor: c.card, borderColor: c.border, color: c.text }]}
      />

      <PressableScale disabled={busy} onPress={submit} style={[styles.button, { backgroundColor: Brand.primary }]}>
        <Text style={styles.buttonText}>{busy ? 'Submitting…' : 'Submit review'}</Text>
      </PressableScale>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 22, fontWeight: '800', marginTop: Spacing.two },
  sub: { fontSize: 14, marginTop: Spacing.two },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.three, marginVertical: Spacing.five },
  input: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.three, minHeight: 90, fontSize: 15, textAlignVertical: 'top' },
  button: { marginTop: Spacing.four, borderRadius: Radius.pill, paddingVertical: Spacing.three, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
