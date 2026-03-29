import { formatCurrency } from 'helpers';
import { Minus, Trash, Add } from 'iconsax-react-nativejs';
import { useState, useMemo } from 'react';
import { ImageBackground, ActivityIndicator } from 'react-native';
import { CartItem as SwellCartItem } from 'swell-js';
import { Button, Text, XStack, YStack } from 'tamagui';

import { styles } from './styles';
import { useTranslation } from 'hooks';

type CartItemProps = {
  item: SwellCartItem;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
};

function CartItem({ item, removeItem, updateQuantity }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { translations } = useTranslation();
  const effectiveMoq = useMemo(() => {
    const variant = item.variant as any;
    if (variant) {
      return variant.minimum_quantity ?? variant.moq ?? 1;
    }
    const product = item.product as any;
    return (
      product?.content?.moq ??
      product?.content?.minimumQuantity ??
      product?.content?.minimum_quantity ??
      product?.moq ??
      1
    );
  }, [item]);

  const handleDecreaseQuantity = async () => {
    setIsUpdating(true);
    try {
      if ((item.quantity || 0) <= effectiveMoq) {
        await removeItem(item.id);
      } else {
        await updateQuantity(item.id, (item?.quantity ?? 0) - effectiveMoq);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncreaseQuantity = async () => {
    setIsUpdating(true);
    try {
      await updateQuantity(item.id, (item?.quantity ?? 0) + effectiveMoq);
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      paddingVertical={14}
      borderBottomWidth={0.5}
      borderBottomColor="#E5E5E5">
      <YStack flex={1} gap={18}>
        <YStack gap={4}>
          <Text fontSize={12} fontWeight="600">
            {item.product?.name}
          </Text>
          <Text fontSize={10} color="#858585">
            {translations.packs} {item.product?.content?.unit_quantity ?? item.product?.content?.unitQuantity}
          </Text>
        </YStack>
        <Text fontSize={14} color="#6CC51D" fontWeight="500" mt={4}>
          {formatCurrency(item.priceTotal, item.product?.currency ?? 'USD')}
        </Text>
      </YStack>

      <ImageBackground
        source={{ uri: item?.product?.images?.[0]?.file?.url ?? (item?.product?.images?.[0] as any)?.url ?? '' }}
        style={styles.image}>
        <XStack
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          height={36}
          backgroundColor="#fff"
          borderRadius={20}
          borderWidth={0.5}
          borderColor="#72767ECC"
          alignItems="center"
          justifyContent="center"
          zIndex={100}
          gap={6}
          >
          <Button
            size="$2"
            circular
            backgroundColor="transparent"
            onPress={handleDecreaseQuantity}
            disabled={isUpdating}
            icon={
              isUpdating ? (
                <ActivityIndicator size={18} color="#6CC51D" />
              ) : (item.quantity || 0) <= effectiveMoq ? (
                <Trash size={18} color="#6CC51D" />
              ) : (
                <Minus size={18} color="#6CC51D" />
              )
            }
          />
          <Text textAlign="center" fontSize={16} fontWeight="600">
            {item.quantity}
          </Text>
          <Button
            size="$2"
            circular
            backgroundColor="transparent"
            onPress={handleIncreaseQuantity}
            disabled={isUpdating}
            icon={
              isUpdating ? (
                <ActivityIndicator size={18} color="#6CC51D" />
              ) : (
                <Add size={18} color="#6CC51D" />
              )
            }
          />
        </XStack>
      </ImageBackground>
    </XStack>
  );
}

export default CartItem;
