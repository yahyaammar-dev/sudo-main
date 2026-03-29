import React from 'react';
import { Card, View, XStack, YStack } from 'tamagui';

import Skeleton from '../skeleton';

type OrderItemSkeletonProps = {
  marginBottom?: number;
};

function OrderItemSkeleton({ marginBottom = 8 }: OrderItemSkeletonProps) {
  return (
    <Card
      backgroundColor="white"
      borderColor="#E5E5E5"
      borderWidth={1}
      borderRadius={17}
      py={12}
      px={16}
      marginBottom={marginBottom}>
      <XStack gap={4} alignItems="center" marginBottom={12}>
        <Skeleton width={80} height={24} borderRadius={4} />
        <Skeleton width={180} height={12} borderRadius={4} />
      </XStack>
      <XStack width="100%" alignItems="center" justifyContent="space-between" marginBottom={12}>
        <XStack alignItems="center" gap={10}>
          <Skeleton width={85} height={60} borderRadius={8} />

          <YStack gap={4}>
            <Skeleton width={120} height={16} borderRadius={4} />
            <Skeleton width={100} height={12} borderRadius={4} />
          </YStack>
        </XStack>

        <XStack alignItems="center" gap={8}>
          <Skeleton width={60} height={12} borderRadius={4} />
          <View width={32} height={32} borderRadius={16}>
            <Skeleton width={32} height={32} borderRadius={16} />
          </View>
        </XStack>
      </XStack>

      <XStack alignItems="center" justifyContent="space-between">
        <XStack gap={12}>
          <Skeleton width={80} height={32} borderRadius={30} />
          <Skeleton width={80} height={32} borderRadius={30} />
        </XStack>

        <YStack alignItems="flex-end" gap={4}>
          <Skeleton width={70} height={12} borderRadius={4} />
          <Skeleton width={80} height={10} borderRadius={4} />
        </YStack>
      </XStack>
    </Card>
  );
}

export default OrderItemSkeleton;
