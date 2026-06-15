import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Brand, Colors } from '@/constants/theme';
import { OrdersProvider } from '@/lib/orders';

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <OrdersProvider>
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: Brand.primary },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: { fontWeight: '700' },
                contentStyle: { backgroundColor: Colors[scheme].background },
              }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="new-delivery" options={{ title: 'Send a Package' }} />
              <Stack.Screen name="buy-me" options={{ title: 'Buy me something' }} />
            </Stack>
          </OrdersProvider>
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
