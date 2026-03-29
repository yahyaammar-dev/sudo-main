import { Card, View, YStack } from 'tamagui';

type ProductCardSkeletonProps = {
  width?: string | number;
  marginBottom?: number;
  borderRadius?: number;
};

function ProductCardSkeleton({
  width = '48%',
  marginBottom = 5,
  borderRadius = 0,
}: ProductCardSkeletonProps) {
  return (
    <Card
      backgroundColor="#fff"
      width={width}
      marginBottom={marginBottom}
      borderRadius={borderRadius}>
      <YStack gap={6}>
        <View height={120} backgroundColor="#f0f0f0" />
        <YStack padding={5} gap={8}>
          <View height={20} backgroundColor="#f0f0f0" borderRadius={4} />
          <View height={16} width={80} backgroundColor="#f0f0f0" borderRadius={4} />
          <View height={14} width={60} backgroundColor="#f0f0f0" borderRadius={4} />
        </YStack>
        <View
          borderTopWidth={1}
          borderTopColor="#EBEBEB"
          height={40}
          backgroundColor="#f0f0f0"
          marginTop={4}
        />
      </YStack>
    </Card>
  );
}

export default ProductCardSkeleton;
