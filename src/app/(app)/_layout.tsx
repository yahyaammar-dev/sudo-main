import { use$ } from '@legendapp/state/react';
import { useAccountVerification, useGetSession, useLogin } from 'api/account';
import { useGetCart } from 'api/cart';
import { useStoreToken } from 'api/extra/mutations';
import { env } from 'config';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { notificationStore, userStore } from 'store';

export default function AppLayout() {
  const { userInfo, account } = use$(userStore);
  const { data: session } = useGetSession();
  const { mutate: login } = useLogin();
  const { mutate: storeToken } = useStoreToken();
  useAccountVerification();
  useGetCart();
  useEffect(() => {
    const isSwellLoggedIn = session && (session as Record<string, unknown>).accountLoggedIn;
    if (!isSwellLoggedIn && userInfo?.email) {
      console.log('[AppLayout] Swell session not authenticated, logging in...', {
        hasSession: !!session,
        accountLoggedIn: (session as Record<string, unknown>)?.accountLoggedIn,
        email: userInfo?.email,
      });
      login({ user: userInfo?.email, password: env.swellPublicKey });
    }
  }, [session, userInfo, login]);

  useEffect(() => {
    if (notificationStore.token.get()) {
      storeToken(notificationStore.token.get() ?? '');
    }
  }, [notificationStore.token.get()]);
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="account/my-addresses" options={{ headerShown: false }} />
      <Stack.Screen name="address/index" options={{ headerShown: false }} />
      <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="product/search/[search_text]" options={{ headerShown: false }} />
      <Stack.Screen name="product/categories/index" options={{ headerShown: false }} />
      <Stack.Screen name="product/categories/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="factory/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="order/shipping-address" options={{ headerShown: false }} />
      <Stack.Screen name="order/order-documents" options={{ headerShown: false }} />
      <Stack.Screen name="order/shipment-details" options={{ headerShown: false }} />
      <Stack.Screen name="order/cart" options={{ headerShown: false }} />
      <Stack.Screen name="order/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="order/checkout" options={{ headerShown: false }} />
      <Stack.Screen name="order/protections" options={{ headerShown: false }} />
      <Stack.Screen name="payment/payment-instructions" options={{ headerShown: false }} />
      <Stack.Screen name="order/pdf-viewer" options={{ headerShown: false }} />
      <Stack.Screen name="thank-you" options={{ headerShown: false }} />
    </Stack>
  );
}
