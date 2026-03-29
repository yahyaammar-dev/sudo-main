import { XStack, YStack, View } from 'tamagui';

import ProductCardSkeleton from '../product-card-skeleton';
import Skeleton from '../skeleton';

function ProductSearchSkeleton() {
  return (
    <YStack gap={40}>
      {[1, 2].map((_, index) => (
        <YStack key={index} gap={10}>
          <XStack gap={8} alignItems="center">
            <View borderColor="#E5E5E5" borderWidth={1} br={8} width={59} height={59}>
              <Skeleton width={59} height={59} borderRadius={8} />
            </View>
            <YStack gap={7}>
              <Skeleton width={150} height={20} borderRadius={4} />
              <YStack gap={2}>
                <Skeleton width={80} height={12} borderRadius={4} />
                <Skeleton width={120} height={16} borderRadius={4} />
              </YStack>
            </YStack>
          </XStack>

          <XStack gap={10} flexWrap="wrap">
            {[1, 2, 3, 4].map((_, productIndex) => (
              <ProductCardSkeleton key={productIndex} />
            ))}
          </XStack>
        </YStack>
      ))}
    </YStack>
  );
}

export default ProductSearchSkeleton;
