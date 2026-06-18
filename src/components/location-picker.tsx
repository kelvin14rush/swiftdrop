import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, type Region } from 'react-native-maps';

import { Brand, Radius, Spacing, type ThemePalette } from '@/constants/theme';
import type { Coord } from '@/lib/pricing';

const ACCRA: Region = { latitude: 5.6037, longitude: -0.187, latitudeDelta: 0.18, longitudeDelta: 0.18 };

type Props = {
  pickup: Coord | null;
  dropoff: Coord | null;
  onChange: (pickup: Coord | null, dropoff: Coord | null) => void;
  c: ThemePalette;
};

export function LocationPicker({ pickup, dropoff, onChange, c }: Props) {
  return <Picker pickup={pickup} dropoff={dropoff} onChange={onChange} c={c} />;
}

function Picker({ pickup, dropoff, onChange, c }: Props) {
  function handlePress(e: any) {
    const coord = e.nativeEvent.coordinate as Coord;
    if (!pickup) onChange(coord, dropoff);
    else if (!dropoff) onChange(pickup, coord);
    else onChange(pickup, coord); // move drop-off
  }

  return (
    <View>
      <View style={styles.mapWrap}>
        <MapView style={StyleSheet.absoluteFill} provider={PROVIDER_DEFAULT} initialRegion={ACCRA} onPress={handlePress}>
          {pickup ? <Marker coordinate={pickup} title="Pickup" pinColor="green" /> : null}
          {dropoff ? <Marker coordinate={dropoff} title="Drop-off" pinColor="orange" /> : null}
          {pickup && dropoff ? <Polyline coordinates={[pickup, dropoff]} strokeColor={Brand.primary} strokeWidth={3} lineDashPattern={[6, 6]} /> : null}
        </MapView>
      </View>
      <Text style={[styles.hint, { color: c.textSecondary }]}>
        {!pickup ? 'Tap the map to set your pickup point.' : !dropoff ? 'Now tap to set the drop-off point.' : 'Tap again to move the drop-off.'}
      </Text>
      {(pickup || dropoff) && (
        <Pressable onPress={() => onChange(null, null)} hitSlop={6}>
          <Text style={[styles.reset, { color: Brand.primary }]}>Reset points</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrap: { height: 220, borderRadius: Radius.md, overflow: 'hidden' },
  hint: { fontSize: 12, marginTop: Spacing.two },
  reset: { fontSize: 12, fontWeight: '700', marginTop: 4 },
});
