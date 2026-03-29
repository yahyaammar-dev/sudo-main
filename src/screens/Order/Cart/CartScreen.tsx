import { use$ } from '@legendapp/state/react';
import { useGetAllAddresses } from 'api/address';
import { useGetCart, useGetShippingRates } from 'api/cart';
import { useUpdateCartItem, useRemoveCartItem, useUpdateCart } from 'api/cart/mutations';
import { useGetFactories } from 'api/catalogue/queries';
import { useGetEstimatedShipping } from 'api/extra';
import { CartFooter, CartItem, CartNotice, ThemedSafeAreaView } from 'components';
import { Header } from 'components/ui';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { Routes } from 'routers';
import { userStore } from 'store';
import { CartItem as SwellCartItem } from 'swell-js';
import { YStack, Text } from 'tamagui';

export default function CartScreen() {
  const { account } = use$(userStore);
  const { data: cart, isLoading } = useGetCart();
  const { serviceId } = useGetShippingRates();
  const { data: addresses } = useGetAllAddresses(account?.id ?? '');
  const { data: factories } = useGetFactories();
  const updateCartItemMutation = useUpdateCartItem();
  const removeCartItemMutation = useRemoveCartItem();
  const updateCartMutation = useUpdateCart();
  const { data: estimatedShippingData } = useGetEstimatedShipping();
  console.log({ cart: cart?.items?.[1]?.product });

  const factory = useMemo(() => {
    const factoryId = cart?.items?.[0]?.product?.content?.factoryId;
    if (!factories || !factoryId) return null;
    return factories.find((factory) => factory.id === factoryId);
  }, [factories, cart]);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeCartItemMutation.mutateAsync(itemId);
      return;
    }

    try {
      await updateCartItemMutation.mutateAsync({
        itemId,
        item: { quantity: newQuantity } as SwellCartItem,
      });
    } catch (error) {
      console.error('Failed to update cart item:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await removeCartItemMutation.mutateAsync(itemId);
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    }
  };

  const onCheckoutPress = async () => {
    try {
      const requiredShippingFields = [
        'name',
        'address1',
        'city',
        'state',
        'zip',
        'country',
        'phone',
      ];

      const hasCompleteShipping =
        cart?.shipping &&
        requiredShippingFields.every(
          (field) => !!cart.shipping?.[field as keyof typeof cart.shipping]
        );

      if (hasCompleteShipping) {
        router.push(Routes.Checkout);
        return;
      }

      if (!addresses || addresses.length === 0) {
        router.push({
          pathname: Routes.ModifyAddress,
          params: {
            from: 'cart',
          },
        });
        return;
      }

      const [primaryAddress] = addresses;
      if (!primaryAddress) {
        router.push({
          pathname: Routes.ModifyAddress,
          params: {
            from: 'cart',
          },
        });
        return;
      }

      await updateCartMutation.mutateAsync({
        shipping: {
          service: serviceId,
          name: account?.name ?? '',
          address1: primaryAddress.address1,
          address2: primaryAddress.address2,
          city: primaryAddress.city,
          state: primaryAddress.state,
          zip: primaryAddress.zip,
          country: primaryAddress.country,
          phone: primaryAddress.phone,
        },
      });

      router.push(Routes.Checkout);
    } catch (error) {
      console.error('Error during checkout process:', error);
    }
  };

  return (
    <ThemedSafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: '#fff' }}>
      <YStack flex={1} backgroundColor="#fff">
        <Header
          stackProps={{
            gap: 12,
          }}
          title={
            <YStack>
              <Text color="#000" fontSize={15} fontWeight="600">
                Cart
              </Text>
              <Text color="#858585" fontSize={12} fontWeight="500">
                {factory?.name ?? ''}
              </Text>
            </YStack>
          }
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack mb={100} padding={16} gap={16}>
            <Text fontSize={14} color="#000" fontWeight="600">
              Items
            </Text>

            {isLoading ? (
              <YStack alignItems="center" gap={16} paddingVertical={40}>
                <ActivityIndicator size="large" color="#6CC51D" />
                <Text fontSize={16} color="#858585">
                  Loading cart...
                </Text>
              </YStack>
            ) : !cart?.items || cart.items.length === 0 ? (
              <YStack alignItems="center" gap={16} paddingVertical={40}>
                <Text fontSize={18} fontWeight="600" color="#000">
                  Your cart is empty
                </Text>
                <Text fontSize={14} color="#858585" textAlign="center">
                  Add some products to your cart to get started
                </Text>
              </YStack>
            ) : (
              <YStack gap={16}>
                {cart.items.map(
                  (item) =>
                    item.product && (
                      <CartItem
                        key={item.id}
                        item={item}
                        removeItem={removeItem}
                        updateQuantity={updateQuantity}
                      />
                    )
                )}
              </YStack>
            )}

            <CartNotice
              subtotal={cart?.subTotal ?? 0}
              shipping={estimatedShippingData?.shippingRate.max_rate ?? 0}
              total={cart?.grandTotal ?? 0}
              currency={cart?.currency}
            />
          </YStack>
        </ScrollView>

        <CartFooter
          amountNeeded={0}
          isEmpty={false}
          onCheckoutPress={onCheckoutPress}
          isLoading={updateCartMutation.status === 'pending'}
          currency={cart?.currency}
        />
      </YStack>
    </ThemedSafeAreaView>
  );
}
