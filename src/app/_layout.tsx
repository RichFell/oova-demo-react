import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  useFonts,
} from '@expo-google-fonts/outfit';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { DemoStateProvider } from '@/state/DemoStateProvider';
import { colors, fonts } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

// Keeps the tabs under a directly opened screen, so its native back button lands on Today.
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    [fonts.regular]: Outfit_400Regular,
    [fonts.medium]: Outfit_500Medium,
    [fonts.semiBold]: Outfit_600SemiBold,
  });
  const ready = loaded || error !== null;

  useEffect(() => {
    if (ready) {
      SplashScreen.hide();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <DemoStateProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}>
        {/* The native header gives scan setup the system back button, with Liquid Glass on iOS 26. */}
        <Stack.Screen
          name="scan"
          options={{
            headerShown: Platform.OS === 'ios',
            title: '',
            headerBackTitle: 'Back',
            headerBackButtonDisplayMode: 'minimal',
            headerTintColor: colors.navy,
          }}
        />
      </Stack>
    </DemoStateProvider>
  );
}
