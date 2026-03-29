import { useQueryClient } from '@tanstack/react-query';
import { useCancelOrder } from 'api/mutations';
import { ordersKeyFactory } from 'api/orders/key-factory';
import { useGetOrder } from 'api/orders/queries';
import {
  OrderInfoCard,
  PaymentMethod,
  DeliveryInfo,
  ThemedSafeAreaView,
  OrderItems,
  LogisticsInfoCard,
  PaymentDetails,
  Header,
  OrderDetailsSkeleton,
} from 'components';
import { canCancel, viewDocuments } from 'constants/order-details';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useTranslation } from 'hooks';
import { DocumentText, Location } from 'iconsax-react-nativejs';
import moment from 'moment';
import { useCallback, useEffect } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { Routes } from 'routers';
import { YStack, Text, Button } from 'tamagui';
import { OrderStatus } from 'types';

function OrderDetailsScreen() {
  const queryClient = useQueryClient();
  const { id, from } = useLocalSearchParams();
  const { data, isLoading, isFetching } = useGetOrder(id as string);
  const { mutateAsync: cancelOrder, isPending } = useCancelOrder();
  const { translations } = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    if (!from) {
      navigation.setOptions?.({ gestureEnabled: false });
    }
  }, [from]);
  const handleCancelOrder = useCallback(async () => {
    await cancelOrder(data?.id as string);
  }, [data?.id, cancelOrder]);

  const documents = [
    {
      url: data?.content?.shipping_qutation?.url,
      filename: data?.content?.shipping_qutation?.filename,
      id: data?.content?.shipping_qutation?.id,
      title: translations.shippingQuotation,
    },
    {
      url: data?.content?.invoice_by_factory?.url,
      filename: data?.content?.invoice_by_factory?.filename,
      id: data?.content?.invoice_by_factory?.id,
      title: translations.factoryInvoice,
    },
    {
      url: data?.content?.dhl_invoice?.url,
      filename: data?.content?.dhl_invoice?.filename,
      id: data?.content?.dhl_invoice?.id,
      title: translations.billOfLading,
    },
    {
      url: data?.content?.inspection_report?.url,
      filename: data?.content?.inspection_report?.filename,
      id: data?.content?.inspection_report?.id,
      title: translations.inspectionReport,
    },
    {
      url: data?.content?.shipping_policy?.url,
      filename: data?.content?.shipping_policy?.filename,
      id: data?.content?.shipping_policy?.id,
      title: translations.shippingPolicy,
    },
    ...(data?.content?.other_documents || []).map((doc: any, index: number) => ({
      url: doc.url,
      filename: doc.originalFilename,
      id: index,
      title: doc.originalFilename,
    })),
  ];
  
  return (
    <ThemedSafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: '#fff' }}>
      <YStack flex={1} backgroundColor="#fff">
        <Header
          center
          title={translations.orderDetails}
          onBackPress={() => {
            if (from === 'orders') {
              queryClient
                .resetQueries({ queryKey: ordersKeyFactory.getOrder(id as string) })
                .then(() => {
                  router.navigate(Routes.Orders);
                });
            } else {
              router.navigate(Routes.Home);
            }
          }}
        />

        {isLoading || isFetching ? (
          <OrderDetailsSkeleton />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <YStack gap={10}>
              <YStack padding={20} gap={20}>
                <OrderInfoCard
                  factoryImage={data?.factory?.content?.store_front_logo?.url}
                  orderId={data?.number || ''}
                  orderStatus={data?.status as OrderStatus}
                  estimatedArrival={
                    data?.shipping?.shipping_date
                      ? moment(data.shipping.shipping_date).format('Do [of] MMMM')
                      : 'N/A'
                  }
                />

                {(data?.status === OrderStatus.PaymentRequired ||
                  data?.status === OrderStatus.PendingPayment) && (
                  <>
                    <LogisticsInfoCard
                      dispatch_date={data?.content?.factory_dispatch}
                      factory={data?.factory}
                      production_duration={data?.content?.production_duration}
                      shipping={data?.shipping}
                      currency={data?.currency}
                      subtotal={data?.sub_total ?? 0}
                    />
                    <PaymentMethod
                      orderId={data?.id}
                      isPaymentRequired={data?.status === OrderStatus.PaymentRequired}
                    />
                  </>
                )}
                <DeliveryInfo
                  address={{
                    address1: data?.shipping.address1,
                    address2: data?.shipping.address2,
                    city: data?.shipping.city,
                    country: data?.shipping.country,
                    state: data?.shipping.state,
                    zip: data?.shipping.zip,
                  }}
                />
              </YStack>
              <OrderItems factory={data?.factory} items={data?.items ?? []} />

              <YStack px={20} gap={40}>
                <PaymentDetails
                  shipping={data?.shipping?.price ?? 0}
                  subtotal={data?.sub_total ?? 0}
                  total={data?.grand_total ?? 0}
                  currency={data?.currency}
                />

                <YStack gap={10}>
                  {data?.status === OrderStatus.OrderShipped && (
                    <Button
                      onPress={() =>
                        router.push({
                          pathname: Routes.ShipmentDetails,
                          params: {
                            id: data?.id,
                            tracking_number: data?.content?.shipping_tracking_number,
                          },
                        })
                      }
                      height={54}
                      backgroundColor="#108910"
                      borderWidth={1}
                      borderColor="#108910"
                      borderRadius={25}
                      pressStyle={{ opacity: 0.8 }}>
                      <Text color="#fff" fontSize={14} fontWeight="500">
                        {translations.trackShipment}
                      </Text>
                      <Location size={17} color="#fff" />
                    </Button>
                  )}
                  {data?.status === OrderStatus.OrderInspected &&
                    data?.content?.inspection_report?.url && (
                      <Button
                        onPress={() =>
                          router.push({
                            pathname: Routes.PdfViewer,
                            params: {
                              url: data?.content?.inspection_report?.url,
                              title: translations.inspectionReport,
                            },
                          })
                        }
                        height={54}
                        backgroundColor="#108910"
                        borderWidth={1}
                        borderColor="#108910"
                        borderRadius={25}
                        pressStyle={{ opacity: 0.8 }}>
                        <Text color="#fff" fontSize={14} fontWeight="500">
                          {translations.downloadInspectionReport}
                        </Text>
                        <DocumentText size={17} color="#fff" />
                      </Button>
                    )}
                  {data?.status && data?.status in viewDocuments && (
                    <Button
                      onPress={() =>
                        router.push({
                          pathname: Routes.OrderDocuments,
                          params: {
                            documents: JSON.stringify(documents),
                          },
                        })
                      }
                      height={54}
                      backgroundColor="transparent"
                      borderWidth={1}
                      borderColor="#000"
                      borderRadius={25}
                      pressStyle={{ opacity: 0.8 }}>
                      <Text color="#667085" fontSize={14} fontWeight="500">
                        {translations.viewDocuments}
                      </Text>
                      <DocumentText size={17} color="#667085" />
                    </Button>
                  )}
                </YStack>
                {data?.status && data?.status in canCancel && (
                  <Button
                    onPress={handleCancelOrder}
                    height={54}
                    backgroundColor="transparent"
                    borderWidth={1}
                    disabled={isPending}
                    borderColor="#000"
                    borderRadius={25}
                    marginTop={8}
                    marginBottom={20}
                    pressStyle={{ opacity: 0.8 }}>
                    {isPending ? (
                      <ActivityIndicator size="small" color="#667085" />
                    ) : (
                      <Text color="#667085" fontSize={14} fontWeight="500">
                        {translations.cancelOrder}
                      </Text>
                    )}
                  </Button>
                )}
              </YStack>
            </YStack>
          </ScrollView>
        )}
      </YStack>
    </ThemedSafeAreaView>
  );
}

export default OrderDetailsScreen;
