import '../lib/polyfills';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Splash from 'components/splash';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useNotifications } from 'hooks';
import { QueryProvider } from 'lib';
import { useEffect, useState } from 'react';
import SplashScreen from 'react-native-bootsplash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { TamaguiProvider } from 'tamagui';

import config from '../../tamagui.config';
import { toastConfig } from '../lib/toast-config';

export default function Layout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useNotifications();

  // Prepare app
  useEffect(() => {
    if (fontsLoaded) setAppIsReady(true);
  }, [fontsLoaded]);

  // Hide splash ASAP
  useEffect(() => {
    if (appIsReady && fontsLoaded) SplashScreen.hide({ fade: true });
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady || !fontsLoaded) return <Splash />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryProvider>
          <TamaguiProvider config={config} defaultTheme="light">
            <BottomSheetModalProvider>
              <StatusBar style="dark" />
              <Slot />
              <Toast config={toastConfig} />
            </BottomSheetModalProvider>
          </TamaguiProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
