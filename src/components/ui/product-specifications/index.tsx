import { useTranslation } from 'hooks';
import { FC, Fragment } from 'react';
import { Text, XStack, YStack } from 'tamagui';

type ProductSpecificationsProps = {
  product_details: Record<string, string | number>;
};
const ProductSpecifications: FC<ProductSpecificationsProps> = ({ product_details }) => {
  const { translations } = useTranslation();
  return (
    <YStack justifyContent="flex-start" pt={15} gap={7}>
      <Text fontSize={15} fontWeight="600" color="#000">
        {translations.productDetails}
      </Text>

      <YStack gap={6}>
        {Object.entries(product_details).map(([key, value]) => (
          <Fragment key={key}>
            {value && typeof value !== 'object' && (
              <XStack alignItems="center">
                <Text fontSize={12} color="#525252" fontWeight="700" width="50%">
                  {key.replace(/_/g, ' ')}:
                </Text>
                <Text fontSize={12} color="#525252" fontWeight="400">
                  {value}
                </Text>
              </XStack>
            )}
          </Fragment>
        ))}
      </YStack>
    </YStack>
  );
};

export default ProductSpecifications;
