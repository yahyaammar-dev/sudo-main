
import { formatCurrency } from 'helpers';
import { useTranslation } from 'hooks';
import { Text, XStack, YStack } from 'tamagui';

type CartNoticeProps = {
  subtotal: number;
  shipping: number;
  total: number;
  currency?: string;
};

function CartNotice({ subtotal, shipping, total, currency }: CartNoticeProps) {
  const { translations } = useTranslation();
  return (
    <YStack gap={10} marginTop={16}>
      <Text fontSize={16} fontWeight="600">
        {translations.paymentDetails}
      </Text>

      <YStack gap={8}>
        <XStack justifyContent="space-between">
          <Text fontSize={10} fontWeight="500" color="#262626">
            {translations.subtotal}
          </Text>
          <Text fontSize={10} fontWeight="500" color="#262626">
            {formatCurrency(subtotal, currency ?? 'USD')}
          </Text>
        </XStack>

        <XStack justifyContent="space-between">
          <Text fontSize={10} fontWeight="500" color="#262626">
            {translations.estimatedShipping}
          </Text>
          <Text fontSize={10} fontWeight="500" color="#262626">
            {formatCurrency(shipping, currency ?? 'USD')}
          </Text>
        </XStack>

        <XStack justifyContent="space-between">
          <Text fontSize={10} fontWeight="700" color="#262626">
            {translations.totalAmount}
          </Text>
          <Text fontSize={10} fontWeight="700" color="#262626">
            {formatCurrency(total, currency ?? 'USD')}
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
}

export default CartNotice;
