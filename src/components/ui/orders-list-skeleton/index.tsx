import { OrderItemSkeleton } from 'components';
import { ScrollView } from 'react-native';
import { YStack } from 'tamagui';

export default function OrdersListSkeleton() {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <YStack padding={16} gap={8}>
        {[1, 2, 3, 4].map((index) => (
          <OrderItemSkeleton key={index} />
        ))}
      </YStack>
    </ScrollView>
  );
};