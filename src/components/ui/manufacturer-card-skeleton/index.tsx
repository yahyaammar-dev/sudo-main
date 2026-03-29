import { View, YStack } from 'tamagui';

type ManufacturerCardSkeletonProps = {
  width?: number;
  height?: number;
};

function ManufacturerCardSkeleton({ width = 70, height = 70 }: ManufacturerCardSkeletonProps) {
  return (
    <YStack alignItems="center" justifyContent="center" gap={2} width={width}>
      <View backgroundColor="#f0f0f0" width={width} height={height} borderRadius={60} />
      <View backgroundColor="#f0f0f0" width={width * 0.9} height={10} borderRadius={4} />
    </YStack>
  );
}

export default ManufacturerCardSkeleton;
