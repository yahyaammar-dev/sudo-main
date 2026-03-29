import { useCancelOrder } from 'api/mutations';
import { canCancel, getStatusColor, orderStatusText } from 'constants/order-details';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { formatCurrency } from 'helpers';
import { useTranslation } from 'hooks';
import { ArrowDown2 } from 'iconsax-react-nativejs';
import moment from 'moment';
import { useCallback } from 'react';
import { Routes } from 'routers';
import { Button, Card, Text, View, XStack, YStack } from 'tamagui';
import { OrderStatus, SwellOrder } from 'types';

type OrderItemCardProps = {
  order: SwellOrder;
  isExpanded: boolean;
  toggleOrderExpanded: (id: string) => void;
};

function OrderItemCard({ order, isExpanded, toggleOrderExpanded }: OrderItemCardProps) {
  const { translations } = useTranslation();
  const { mutateAsync: cancelOrder, isPending: isCancellingOrder } = useCancelOrder();
  const handleCancelOrder = useCallback(async () => {
    await cancelOrder(order.id);
  }, [order.id, cancelOrder, isCancellingOrder]);
  return (
    <Card
      backgroundColor="white"
      borderColor="#E5E5E5"
      borderWidth={1}
      borderRadius={17}
      py={12}
      px={16}
      overflow="hidden">
      <XStack gap={4} alignItems="center">
        <View backgroundColor={getStatusColor(order.status as OrderStatus)} p={4} borderRadius={4}>
          <Text color="white" fontSize={10}>
            {orderStatusText[order.status as OrderStatus]}
          </Text>
        </View>
        {/* <Text fontSize={10} color="#525252" fontWeight="600">
          Expected Delivery :{' '}
          {order.expected_delivery ? moment(order.expected_delivery).format('D MMMM YYYY') : ''}
        </Text> */}
      </XStack>

      <XStack width="100%" alignItems="center" justifyContent="space-between">
        <XStack alignItems="center" gap={10}>
          <View overflow="hidden" marginVertical={10} borderRadius={8} justifyContent="flex-start">
            <Image
              source={{
                uri: order.factory?.content?.store_front_logo?.url,
              }}
              style={{ width: 85, height: 60, borderRadius: 8 }}
              contentFit="fill"
            />
          </View>
          <YStack>
            <Text fontSize={16} fontWeight="500">
              {order?.factory?.name}
            </Text>
            <Text fontSize={10} color="#525252" fontWeight="700">
              Order ID :
              <Text color="#525252" fontSize={8} fontWeight="400">
                {order.number}
              </Text>
            </Text>
          </YStack>
        </XStack>
        <XStack alignItems="center" gap={8}>
          <Text fontSize={10} color="#858585">
            {order.item_quantity ?? 0} Pieces
          </Text>
          <Button
            circular
            size="$2"
            backgroundColor="transparent"
            onPress={() => {
              toggleOrderExpanded(order.id);
            }}>
            <ArrowDown2
              size={20}
              color="#666"
              style={{
                transform: [{ rotate: isExpanded ? '180deg' : '0deg' }],
              }}
            />
          </Button>
        </XStack>
      </XStack>

      {isExpanded && (
        <YStack paddingHorizontal={16} gap={12}>
          {order.items?.map((item, index) => (
            <XStack
              key={index}
              alignItems="center"
              justifyContent="space-between"
              paddingVertical={8}>
              <XStack alignItems="center" gap={12} flex={1}>
                <Image
                  source={{
                    uri: item.product?.images?.[0]?.file?.url,
                  }}
                  style={{ width: 50, height: 50 }}
                  contentFit="contain"
                />
                <YStack flex={1}>
                  <Text fontSize={12} color="#262626" fontWeight="500">
                    {item.product?.name}
                  </Text>
                  <Text fontSize={10} color="#858585">
                    {item.product?.content?.unit_quantity}
                  </Text>
                </YStack>
              </XStack>
              <Text fontSize={12} color="#858585" fontWeight="500">
                {formatCurrency(item.product?.price, item.product?.currency ?? 'USD')}
              </Text>
            </XStack>
          ))}
        </YStack>
      )}

      <XStack alignItems="center" justifyContent="space-between">
        <XStack gap={12}>
          {order.status in canCancel && (
            <Button
              borderWidth={1}
              borderColor="#000"
              backgroundColor="transparent"
              paddingHorizontal={20}
              paddingVertical={10}
              onPress={handleCancelOrder}
              disabled={isCancellingOrder}
              borderRadius={30}>
              <Text fontSize={10} color="#5F728F">
                {isCancellingOrder ? 'Cancelling...' : translations.cancelOrder}
              </Text>
            </Button>
          )}
          <Button
            onPress={() =>
              router.push({
                pathname: Routes.OrderDetails,
                params: { id: order.id, from: 'orders' },
              })
            }
            borderWidth={1}
            borderColor="#000"
            backgroundColor="transparent"
            paddingHorizontal={20}
            paddingVertical={10}
            borderRadius={30}>
            <Text fontSize={10} color="#5F728F">
              View Order
            </Text>
          </Button>
        </XStack>
        <YStack alignItems="flex-end">
          <Text fontSize={9} color="#262626">
            {formatCurrency(order?.grand_total, order?.currency ?? 'USD')}
          </Text>
          <Text
            onPress={() =>
              router.push({
                pathname: Routes.OrderDetails,
                params: { id: order.id, from: 'orders' },
              })
            }
            fontSize={9}
            color="#262626"
            fontWeight="600"
            textDecorationLine="underline">
            View details
          </Text>
        </YStack>
      </XStack>
    </Card>
  );
}

export default OrderItemCard;
