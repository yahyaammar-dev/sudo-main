import { router } from 'expo-router';
import { useTranslation } from 'hooks';
import { Image } from 'react-native';
import { Routes } from 'routers';
import { Button, Card, Circle, Square, Text, XStack, YStack } from 'tamagui';

type PaymentMethodProps = {
  isPaymentRequired?: boolean;
  orderId?: string;
};
function PaymentMethod({ isPaymentRequired, orderId }: PaymentMethodProps) {
  const { translations } = useTranslation();
  return (
    <YStack gap={18}>
      <YStack gap={4}>
        <Text fontSize={15} fontWeight="600" color="#000">
          {translations.paymentMethod}
        </Text>
        <Card
          backgroundColor="white"
          borderRadius={12}
          borderWidth={1}
          borderColor="#eee"
          padding={16}>
          <XStack alignItems="center" justifyContent="space-between">
            <XStack alignItems="center" gap={12}>
              <Image
                source={require('../../../../assets/images/bank.png')}
                style={{ width: 25, height: 25 }}
                resizeMode="contain"
              />
              <Text fontSize={11} fontWeight="500" color="#000">
                {translations.bankTransfer}
              </Text>
            </XStack>
            <Circle size={24} backgroundColor="#fff" borderWidth={2} borderColor="#333">
              <Circle size={12} backgroundColor="#333" />
            </Circle>
          </XStack>
        </Card>
      </YStack>
      {isPaymentRequired && orderId && (
        <Button
          onPress={() => {
            router.navigate({
              pathname: Routes.PaymentInstructions,
              params: { orderId },
            });
          }}
          height={50}
          backgroundColor="#108910"
          borderRadius={25}
          pressStyle={{ opacity: 0.8 }}>
          <XStack alignItems="center" gap={8}>
            <Text color="white" fontWeight="600" fontSize={14}>
              {translations.paymentInstructions}
            </Text>
            <Square borderRadius={4} size={20} backgroundColor="white">
              <Text color="#108910" fontSize={12}>
                $
              </Text>
            </Square>
          </XStack>
        </Button>
      )}
    </YStack>
  );
}

export default PaymentMethod;
