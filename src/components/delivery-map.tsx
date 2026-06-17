import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, type Region } from 'react-native-maps';

import { Brand } from '@/constants/theme';

export type Coord = { latitude: number; longitude: number };

/** Native live map (react-native-maps). The .web.tsx variant is used on web. */
export function DeliveryMap({ pickup, dropoff, rider }: { pickup: Coord; dropoff: Coord; rider: Coord }) {
  const region: Region = {
    latitude: (pickup.latitude + dropoff.latitude) / 2,
    longitude: (pickup.longitude + dropoff.longitude) / 2,
    latitudeDelta: Math.abs(pickup.latitude - dropoff.latitude) * 2.4 + 0.03,
    longitudeDelta: Math.abs(pickup.longitude - dropoff.longitude) * 2.4 + 0.03,
  };
  return (
    <MapView style={StyleSheet.absoluteFill} provider={PROVIDER_DEFAULT} initialRegion={region}>
      <Marker coordinate={pickup} title="Pickup" anchor={{ x: 0.5, y: 0.5 }}>
        <View style={[styles.pin, { backgroundColor: Brand.accent }]}>
          <Ionicons name="cube" size={14} color="#FFFFFF" />
        </View>
      </Marker>
      <Marker coordinate={dropoff} title="Drop-off" anchor={{ x: 0.5, y: 0.5 }}>
        <View style={[styles.pin, { backgroundColor: Brand.primary }]}>
          <Ionicons name="location" size={14} color="#FFFFFF" />
        </View>
      </Marker>
      <Marker coordinate={rider} title="Your rider" anchor={{ x: 0.5, y: 0.5 }}>
        <View style={styles.rider}>
          <Text style={{ fontSize: 20 }}>🛵</Text>
        </View>
      </Marker>
      <Polyline coordinates={[pickup, dropoff]} strokeColor={Brand.primary} strokeWidth={3} lineDashPattern={[8, 8]} />
    </MapView>
  );
}

const styles = StyleSheet.create({
  pin: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  rider: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Brand.primary },
});
