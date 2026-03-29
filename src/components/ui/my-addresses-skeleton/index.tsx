import React from 'react';
import { ScrollView } from 'react-native';
import { XStack, YStack } from 'tamagui';

import Skeleton from '../skeleton';

type MyAddressesSkeletonProps = {
  itemCount?: number;
};

function MyAddressesSkeleton({ itemCount = 5 }: MyAddressesSkeletonProps = {}) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {Array.from({ length: itemCount }, (_, index) => (
        <YStack key={index}>
          <XStack width="100%" justifyContent="space-between" alignItems="center">
            <YStack flex={1} gap={6} py={10} borderBottomWidth={1} borderBottomColor="#F3F4F6">
              <Skeleton width="15%" height={16} borderRadius={4} />
              <Skeleton width="30%" height={13} borderRadius={4} />
              <Skeleton width="45%" height={13} borderRadius={4} />
            </YStack>

            <Skeleton width={24} height={24} borderRadius={12} />
          </XStack>
        </YStack>
      ))}
    </ScrollView>
  );
}

export default MyAddressesSkeleton;
