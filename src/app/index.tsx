import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { use$ } from '@legendapp/state/react';
import { Redirect } from 'expo-router';
import { useTranslation } from 'hooks';
import { Routes } from 'routers';
import { userStore } from 'store';

export default function Index() {
  const { isLoggedIn, isInitialized, isOnboardingComplete } = use$(userStore);
  const { isInitialized: isLocalizationInitialized } = useTranslation();

  // Don't show anything while the app is still initializing
  // The splash screen in _layout.tsx will handle this
  if (!isInitialized || !isLocalizationInitialized) {
    return null;
  }

  if (isLoggedIn) {
    return <Redirect href={Routes.Home} />;
  } else if (!isOnboardingComplete) {
    return <Redirect href={Routes.Onboarding} />;
  } else {
    return <Redirect href={Routes.Login} />;
  }
}
