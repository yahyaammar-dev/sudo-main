import { use$ } from '@legendapp/state/react';
import { useGetAllOrders } from 'api/orders/queries';
import { OrderItemCard, OrdersListSkeleton } from 'components';
import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { userStore } from 'store';
import { XStack, YStack, Text, Button } from 'tamagui';
import { OrderStatus, SwellOrder } from 'types';

function OrdersScreen() {
  const { account } = use$(userStore);
  const {
    data,
    isSuccess,
    isLoading,
    isPending,
    refetch: refetchOrders,
    isFetching,
  } = useGetAllOrders(account?.id as string);
  const [refreshing, setRefreshing] = useState(false);

  const categorizeOrders = (orders: SwellOrder[]): Record<string, SwellOrder[]> => {
    const statusGroups: Record<string, OrderStatus[]> = {
      upcoming: [
        OrderStatus.OrderPlaced,
        OrderStatus.PaymentRequired,
        OrderStatus.PaymentReceived,
        OrderStatus.OrderInspected,
        OrderStatus.OrderShipped,
        OrderStatus.Pending,
        OrderStatus.PendingPayment,
      ],
      delivered: [OrderStatus.OrderDelivered],
      cancelled: [OrderStatus.OrderCancelled, OrderStatus.Canceled],
      returned: [OrderStatus.OrderReturned],
    };

    const categorized: Record<string, SwellOrder[]> = {
      all: orders,
      upcoming: [],
      delivered: [],
      cancelled: [],
      returned: [],
    };

    orders.forEach((order) => {
      const status = order.status as OrderStatus;
      Object.entries(statusGroups).forEach(([key, statuses]) => {
        if (statuses.includes(status)) {
          categorized[key].push(order);
        }
      });
    });

    Object.keys(categorized).forEach((key) => {
      if (!Array.isArray(categorized[key])) {
        categorized[key] = [];
      }
    });

    return categorized;
  };

  const { statusesOrders, statuses } = useMemo(() => {
    const orders = data?.orders || [];
    const categorized = categorizeOrders(orders);

    return {
      statusesOrders: categorized,
      statuses: [
        { value: 'all', label: 'All' },
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'returned', label: 'Returned' },
      ] as { value: string; label: string }[],
    };
  }, [data]);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());

  const toggleOrderExpanded = (orderId: string) => {
    setExpandedOrderIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <YStack flex={1} backgroundColor="#fff">
        <YStack paddingHorizontal={22} paddingVertical={16} backgroundColor="#fff">
          <Text fontSize={18} color="#000" fontWeight="600" textAlign="center">
            Orders
          </Text>
        </YStack>
        <>
          <XStack paddingVertical={4} backgroundColor="#fff">
            <ScrollView
              contentContainerStyle={{ gap: 8, paddingHorizontal: 22, backgroundColor: '#fff' }}
              horizontal
              showsHorizontalScrollIndicator={false}>
              {statuses?.map((tab, index) => (
                <Button
                  key={index}
                  backgroundColor={activeTab === tab.value ? '#108910' : 'transparent'}
                  color={activeTab === tab.value ? '#108910' : '#5F728F'}
                  borderWidth={1}
                  borderColor={activeTab === tab.value ? '#108910' : '#F4F5F9'}
                  borderRadius={7}
                  paddingHorizontal={11}
                  height={28}
                  justifyContent="center"
                  alignItems="center"
                  onPress={() => setActiveTab(tab.value)}>
                  <Text
                    color={activeTab === tab.value ? 'white' : '#5F728F'}
                    fontWeight={activeTab === tab.value ? '600' : '400'}>
                    {tab.label}
                  </Text>
                </Button>
              ))}
            </ScrollView>
          </XStack>
          {isSuccess &&
            (statusesOrders[activeTab as keyof typeof statusesOrders] || []).length === 0 && (
              <YStack flex={1} alignItems="center" justifyContent="center" padding={32}>
                <Text fontSize={16} color="#858585" textAlign="center">
                  No orders found for this status.
                </Text>
              </YStack>
            )}

          {isLoading || isPending || isFetching || !account?.id ? (
            <OrdersListSkeleton />
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={async () => {
                    setRefreshing(true);
                    setTimeout(async () => {
                      setRefreshing(false);
                      await refetchOrders();
                    }, 1000);
                  }}
                />
              }
              showsVerticalScrollIndicator={false}>
              <YStack padding={16} gap={8}>
                {isSuccess &&
                  (statusesOrders[activeTab as keyof typeof statusesOrders] || [])?.map(
                    (order: SwellOrder, index: number) => (
                      <OrderItemCard
                        key={index}
                        order={order}
                        isExpanded={expandedOrderIds.has(order.id)}
                        toggleOrderExpanded={toggleOrderExpanded}
                      />
                    )
                  )}
              </YStack>
            </ScrollView>
          )}
        </>
      </YStack>
    </SafeAreaView>
  );
}

export default OrdersScreen;
