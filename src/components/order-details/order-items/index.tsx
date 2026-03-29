import { useTranslation } from 'hooks';
import { Image } from 'react-native';
import { Circle, Text, XStack, YStack } from 'tamagui';
import { SwellCartItem, SwellFactory } from 'types';

import { styles } from './styles';

interface OrderItemsProps {
  items: SwellCartItem[];
  factory: SwellFactory;
}
function OrderItems({ items, factory }: OrderItemsProps) {
  const { translations } = useTranslation();
  return (
    <YStack backgroundColor="#F8DE914D" px={30} py={10} gap={4}>
      <Text fontSize={10} color="#6B6B6B">
        {translations.yourOrderFrom}
      </Text>
      <XStack justifyContent="space-between">
        <YStack>
          <Text fontSize={16} fontWeight="600" color="#262626">
            {factory?.content.name ?? factory?.content?.factory_name}
          </Text>
          <Text fontSize={12} color="#262626">
            {factory?.content?.city && factory?.content?.country
              ? `${factory?.content?.city} - ${factory?.content?.country}`
              : factory?.content?.city || factory?.content?.country || ''}
          </Text>
        </YStack>
        <Image
          source={{
            uri: factory?.content?.store_front_logo?.url,
          }}
          style={styles.image}
          resizeMode="contain"
        />
      </XStack>

      <YStack gap={8} marginTop={8}>
        {items.map((item, index) => (
          <XStack key={index} alignItems="center" gap={14}>
            <Circle size={22} backgroundColor="#fff">
              <Text fontSize={10} fontWeight="500">
                {item?.quantity}
              </Text>
            </Circle>
            <Text fontSize={10} color="#262626">
              {item?.product?.name ?? ''}
            </Text>
          </XStack>
        ))}
      </YStack>
    </YStack>
  );
}

export default OrderItems;
