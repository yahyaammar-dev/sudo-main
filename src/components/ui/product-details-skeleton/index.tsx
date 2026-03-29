import { View, XStack, YStack } from 'tamagui';

import { styles } from './styles';

export const ProductImageSkeleton = () => <View style={[styles.imageContainer]} />;

export const ProductInfoSkeleton = () => (
  <YStack gap={8} px={16} py={26}>
    <XStack justifyContent="space-between" alignItems="center">
      <View height={24} width={100} backgroundColor="#f0f0f0" borderRadius={4} />
      <View height={40} width={40} backgroundColor="#f0f0f0" borderRadius={20} />
    </XStack>
    <View height={28} width={200} backgroundColor="#f0f0f0" borderRadius={4} />
    <View height={16} width={150} backgroundColor="#f0f0f0" borderRadius={4} />
    <View height={16} width={180} backgroundColor="#f0f0f0" borderRadius={4} />
    <View height={40} width="100%" backgroundColor="#f0f0f0" borderRadius={4} mt={10} />
    <View height={50} backgroundColor="#f0f0f0" borderRadius={10} mt={10} />
  </YStack>
);

export const AddToCartSkeleton = ({ bottom }: { bottom: number }) => (
  <View
    style={styles.fixedBottomContainer}
    height={120}
    backgroundColor="#f0f0f0"
    borderTopLeftRadius={10}
    borderTopRightRadius={10}
  />
);
