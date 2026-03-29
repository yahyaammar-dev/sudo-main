import { Text, XStack, YStack } from 'tamagui';
import { SwellFactory, SwellProduct } from 'types';

import StoreProductCard from '../store-product-card';

function StoreProductList({
  subCategory,
  products,
  factory,
}: {
  subCategory?: string;
  factory: SwellFactory;
  products: SwellProduct[];
}) {
  return (
    <YStack>
      <Text fontSize={18} fontWeight="600" marginTop={20} marginBottom={12} paddingHorizontal={16}>
        {subCategory}
      </Text>
      <XStack paddingHorizontal={16} gap={16}>
        {products?.map((product, index) => (
          <StoreProductCard key={index} product={product} width="48%" />
        ))}
      </XStack>
    </YStack>
  );
}

export default StoreProductList;
