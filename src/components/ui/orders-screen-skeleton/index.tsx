import React from 'react';
import { ScrollView } from 'react-native';
import { XStack, YStack, View } from 'tamagui';

import OrderItemSkeleton from '../order-item-skeleton';
import Skeleton from '../skeleton';

function OrdersScreenSkeleton() {
  return (
    <YStack flex={1} backgroundColor="#fff">
      <XStack paddingVertical={4} backgroundColor="#fff">
        <ScrollView
          contentContainerStyle={{ gap: 8, paddingHorizontal: 22, backgroundColor: '#fff' }}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {[1, 2, 3, 4, 5].map((index) => (
            <View key={index} borderRadius={7} paddingHorizontal={11} height={28}>
              <Skeleton width={60} height={28} borderRadius={7} />
            </View>
          ))}
        </ScrollView>
      </XStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding={16} gap={8}>
          {[1, 2, 3, 4].map((index) => (
            <OrderItemSkeleton key={index} />
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  );
}

export default OrdersScreenSkeleton;
