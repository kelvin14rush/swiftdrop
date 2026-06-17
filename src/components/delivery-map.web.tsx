import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';

import { Brand, Colors } from '@/constants/theme';

export type Coord = { latitude: number; longitude: number };

/** Web placeholder — react-native-maps is native-only. */
export function DeliveryMap(_props: { pickup: Coord; dropoff: Coord; rider: Coord }) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  return (
    <View style={[StyleSheet.absoluteFill, styles.center, { backgroundColor: c.backgroundElement }]}>
      <Ionicons name="map" size={44} color={Brand.primary} />
      <Text style={{ color: c.textSecondary, marginTop: 8 }}>Live map opens in the mobile app</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});
