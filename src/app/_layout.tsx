import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  useFonts,
} from '@expo-google-fonts/outfit';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { ServicesProvider, prefetchServices, useServices } from '@/services/ServicesProvider';
import { colors, fonts } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

// Keeps the tabs under a directly opened screen, so its native back button lands on Today.
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ServicesProvider>
      <RootStack />
    </ServicesProvider>
  );
}

// The splash screen stays up until the fonts load and each service has its data cached.
function RootStack() {
  const services = useServices();
  const [loaded, error] = useFonts({
    [fonts.regular]: Outfit_400Regular,
    [fonts.medium]: Outfit_500Medium,
    [fonts.semiBold]: Outfit_600SemiBold,
  });
  const [prefetched, setPrefetched] = useState(false);
  const ready = (loaded || error !== null) && prefetched;

  useEffect(() => {
    let active = true;
    prefetchServices(services).then(() => {
      if (active) {
        setPrefetched(true);
      }
    });
    return () => {
      active = false;
    };
  }, [services]);

  useEffect(() => {
    if (ready) {
      SplashScreen.hide();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <>
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
    </>
  );
}
