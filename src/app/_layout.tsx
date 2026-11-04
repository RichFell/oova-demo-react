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

import { DemoStateProvider } from '@/state/DemoStateProvider';
import { colors, fonts } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

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
        }}
      />
    </DemoStateProvider>
  );
}
