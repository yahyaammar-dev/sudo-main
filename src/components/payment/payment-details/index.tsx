import { formatCurrency } from 'helpers';
import { useTranslation } from 'hooks';
import { useMemo } from 'react';
import { Text, XStack, YStack } from 'tamagui';

interface PaymentDetailsProps {
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
}
function PaymentDetails({ shipping, subtotal, total, currency }: PaymentDetailsProps) {
  const { translations } = useTranslation();

  const sudoManagementFee = useMemo(() => {
    const sub = Number(subtotal) || 0;
    const ship = Number(shipping) || 0;

    const base = sub + ship;
    return +(base * 0.025).toFixed(2);
  }, [subtotal, shipping]);
  return (
    <YStack gap={12}>
      <Text fontSize={16} fontWeight="600" color="#262626">
        {translations.paymentDetails}
      </Text>
      <YStack gap={4}>
        <XStack justifyContent="space-between">
          <Text fontSize={10} color="#262626">
            {translations.subtotal}
          </Text>
          <Text fontSize={10} color="#262626">
            {formatCurrency(subtotal, currency ?? 'USD')}
          </Text>
        </XStack>
        <XStack justifyContent="space-between">
          <Text fontSize={10} color="#262626">
            {translations.estimatedShipping}
          </Text>
          <Text fontSize={10} color="#262626">
            {formatCurrency(shipping, currency ?? 'USD')}
          </Text>
        </XStack>
        <XStack justifyContent="space-between">
          <Text fontSize={10} color="#262626">
            Sudo Management Fees (2.5%)
          </Text>
          <Text fontSize={10} color="#262626">
            {formatCurrency(sudoManagementFee, currency ?? 'USD')}
          </Text>
        </XStack>
        <XStack justifyContent="space-between">
          <Text fontSize={10} color="#262626">
            {translations.total}
          </Text>
          <Text fontSize={10} color="#262626">
            {formatCurrency(total, currency ?? 'USD')}
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
}

export default PaymentDetails;
