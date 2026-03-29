import { useGetCart, useGetShippingRates } from 'api/cart';
import { useAddSudoManagementFee, useGetEstimatedShipping } from 'api/extra';
import { useSubmitOrder, useUpdateCart } from 'api/mutations';
import {
  DeliveryInfo,
  PaymentDetails,
  PaymentMethod,
  Protections,
  ThemedSafeAreaView,
} from 'components';
import { Header } from 'components/ui';
import { router } from 'expo-router';
import { formatCurrency } from 'helpers';
import { useTranslation } from 'hooks';
import { ShieldTick } from 'iconsax-react-nativejs';
import { useEffect } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { Routes } from 'routers';
import { YStack, Text, Button } from 'tamagui';

function CheckoutScreen() {
  const { translations } = useTranslation();
  const { mutate: addSudoManagementFee } = useAddSudoManagementFee();
  const {data: estimatedShippingData } = useGetEstimatedShipping();
  const { data } = useGetCart();
  const { serviceId } = useGetShippingRates();
  const { mutateAsync: updateCart } = useUpdateCart();
  const { mutate, isSuccess, data: orderData, isPending, reset } = useSubmitOrder();
  if (isSuccess && orderData?.id) {
    router.push({
      pathname: Routes.OrderDetails,
      params: { id: orderData.id },
    });
    reset();
  }


  useEffect(() => {
    if (data?.id) {
      addSudoManagementFee(data.id);
    }
  }, [data?.id]);

  useEffect(() => {
    if (data?.id && serviceId && !data?.shipping?.service) {
      updateCart({ shipping: { service: serviceId } });
    }
  }, [data?.id, serviceId]);

  return (
    <ThemedSafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: '#fff' }}>
      <YStack flex={1} backgroundColor="#fff">
        <Header
          title={
            <YStack marginLeft={12} flex={1} alignItems="center">
              <Text fontSize={18} fontWeight="500">
                {translations.checkout}
              </Text>
              <Text fontSize={10} color="#076D05">
                {translations.checkoutScreenDescription}
              </Text>
            </YStack>
          }
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack padding={16} gap={20}>
            <DeliveryInfo
              address={{
                address1: data?.shipping?.address1,
                address2: data?.shipping?.address2,
                city: data?.shipping?.city,
                country: data?.shipping?.country,
                state: data?.shipping?.state,
                zip: data?.shipping?.zip,
                phone: data?.shipping?.phone,
              }}
              isNavigable
            />
            <PaymentMethod />
            <PaymentDetails
              currency={data?.currency || 'USD'}
              total={data?.grandTotal || 0}
              shipping={estimatedShippingData?.shippingRate.max_rate || 0}
              subtotal={data?.subTotal || 0}
            />
            <Protections />
          </YStack>
        </ScrollView>

        <YStack
          py={16}
          px={40}
          backgroundColor="#fff"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text fontSize={12} fontWeight="700">
            {formatCurrency(data?.grandTotal ?? 0, data?.currency ?? 'USD')}
          </Text>
          <Button
            height={48}
            width={150}
            backgroundColor="#108910"
            borderRadius={24}
            pressStyle={{ opacity: 0.8 }}
            disabled={isPending}
            onPress={() => {
              mutate();
            }}>
            {isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ShieldTick size={20} color="#fff" variant="Bold" />
            )}
            <Text color="white" fontSize={11} fontWeight="500">
              {isPending ? 'Processing...' : 'Confirm'}
            </Text>
          </Button>
        </YStack>
      </YStack>
    </ThemedSafeAreaView>
  );
}

export default CheckoutScreen;
