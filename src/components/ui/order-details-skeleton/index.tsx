import { ScrollView } from 'react-native';
import { View, XStack, YStack } from 'tamagui';

import Skeleton from '../skeleton';

export default function OrderDetailsSkeleton() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <YStack gap={10}>
        <YStack padding={20} gap={20}>
          {/* Order Info Card Skeleton */}
          <YStack backgroundColor="#fff" borderRadius={12} padding={16} gap={12}>
            <XStack alignItems="center" gap={12}>
              <Skeleton width={60} height={60} borderRadius={30} />
              <YStack flex={1} gap={6}>
                <Skeleton width="60%" height={16} borderRadius={4} />
                <Skeleton width="40%" height={12} borderRadius={4} />
              </YStack>
            </XStack>
            <XStack justifyContent="space-between" alignItems="center">
              <YStack gap={4}>
                <Skeleton width={80} height={12} borderRadius={4} />
                <Skeleton width={100} height={16} borderRadius={4} />
              </YStack>
              <Skeleton width={120} height={32} borderRadius={16} />
            </XStack>
          </YStack>

          {/* Logistics Info Card Skeleton */}
          <YStack backgroundColor="#fff" borderRadius={12} padding={16} gap={16}>
            <Skeleton width="50%" height={18} borderRadius={4} />
            <YStack gap={12}>
              <XStack justifyContent="space-between">
                <Skeleton width="40%" height={14} borderRadius={4} />
                <Skeleton width="30%" height={14} borderRadius={4} />
              </XStack>
              <XStack justifyContent="space-between">
                <Skeleton width="45%" height={14} borderRadius={4} />
                <Skeleton width="25%" height={14} borderRadius={4} />
              </XStack>
              <XStack justifyContent="space-between">
                <Skeleton width="35%" height={14} borderRadius={4} />
                <Skeleton width="40%" height={14} borderRadius={4} />
              </XStack>
              <XStack justifyContent="space-between">
                <Skeleton width="50%" height={14} borderRadius={4} />
                <Skeleton width="35%" height={14} borderRadius={4} />
              </XStack>
            </YStack>
          </YStack>

          {/* Payment Method Skeleton */}
          <YStack backgroundColor="#fff" borderRadius={12} padding={16} gap={12}>
            <Skeleton width="40%" height={16} borderRadius={4} />
            <XStack alignItems="center" gap={12}>
              <Skeleton width={40} height={32} borderRadius={6} />
              <YStack flex={1} gap={4}>
                <Skeleton width="60%" height={14} borderRadius={4} />
                <Skeleton width="40%" height={12} borderRadius={4} />
              </YStack>
            </XStack>
          </YStack>

          {/* Delivery Info Skeleton */}
          <YStack backgroundColor="#fff" borderRadius={12} padding={16} gap={12}>
            <Skeleton width="35%" height={16} borderRadius={4} />
            <YStack gap={6}>
              <Skeleton width="80%" height={14} borderRadius={4} />
              <Skeleton width="70%" height={14} borderRadius={4} />
              <Skeleton width="60%" height={14} borderRadius={4} />
              <Skeleton width="50%" height={14} borderRadius={4} />
            </YStack>
          </YStack>
        </YStack>

        {/* Order Items Skeleton */}
        <YStack backgroundColor="#fff" padding={16} gap={16}>
          <Skeleton width="30%" height={18} borderRadius={4} />
          {[1, 2].map((item) => (
            <XStack key={item} gap={12} padding={12} backgroundColor="#f9f9f9" borderRadius={8}>
              <Skeleton width={80} height={80} borderRadius={8} />
              <YStack flex={1} gap={6}>
                <Skeleton width="70%" height={16} borderRadius={4} />
                <Skeleton width="50%" height={14} borderRadius={4} />
                <XStack justifyContent="space-between" alignItems="center" marginTop={8}>
                  <Skeleton width={60} height={12} borderRadius={4} />
                  <Skeleton width={80} height={16} borderRadius={4} />
                </XStack>
              </YStack>
            </XStack>
          ))}
        </YStack>

        {/* Payment Details & Button Skeleton */}
        <YStack px={20} gap={40}>
          <YStack backgroundColor="#fff" borderRadius={12} padding={16} gap={12}>
            <Skeleton width="40%" height={16} borderRadius={4} />
            <YStack gap={8}>
              <XStack justifyContent="space-between">
                <Skeleton width="30%" height={14} borderRadius={4} />
                <Skeleton width="25%" height={14} borderRadius={4} />
              </XStack>
              <XStack justifyContent="space-between">
                <Skeleton width="25%" height={14} borderRadius={4} />
                <Skeleton width="30%" height={14} borderRadius={4} />
              </XStack>
              <View height={1} backgroundColor="#E5E5E5" marginVertical={8} />
              <XStack justifyContent="space-between">
                <Skeleton width="20%" height={16} borderRadius={4} />
                <Skeleton width="35%" height={16} borderRadius={4} />
              </XStack>
            </YStack>
          </YStack>
          <YStack marginBottom={20}>
            <Skeleton width="100%" height={54} borderRadius={25} />
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
