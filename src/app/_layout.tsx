import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Brand, Colors } from '@/constants/theme';
import { AuthProvider } from '@/lib/auth';
import { OrdersProvider } from '@/lib/orders';
import { ProfileProvider } from '@/lib/profile';

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthProvider>
          <ProfileProvider>
            <OrdersProvider>
              <Stack
                screenOptions={{
                  headerStyle: { backgroundColor: Brand.primary },
                  headerTintColor: '#FFFFFF',
                  headerTitleStyle: { fontWeight: '700' },
                  contentStyle: { backgroundColor: Colors[scheme].background },
                  animation: 'slide_from_right',
                }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="new-delivery" options={{ title: 'Send a Package' }} />
                <Stack.Screen name="buy-me" options={{ title: 'Buy me something' }} />
                <Stack.Screen name="edit-profile" options={{ title: 'Edit profile' }} />
                <Stack.Screen name="addresses" options={{ title: 'Saved addresses' }} />
                <Stack.Screen name="payment-methods" options={{ title: 'Payment methods' }} />
                <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
                <Stack.Screen name="help" options={{ title: 'Help & support' }} />
                <Stack.Screen name="about" options={{ title: 'About SwiftDrop' }} />
                <Stack.Screen name="sign-in" options={{ title: 'Account' }} />
                <Stack.Screen name="order-confirmed" options={{ headerShown: false, animation: 'fade' }} />
              </Stack>
            </OrdersProvider>
          </ProfileProvider>
          </AuthProvider>
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
