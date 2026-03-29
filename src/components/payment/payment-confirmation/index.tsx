import { useTranslation } from 'hooks';
import { TextInput } from 'react-native';
import { Text, YStack } from 'tamagui';

import { styles } from './styles';

interface PaymentConfirmationProps {
  transferId: string;
  setTransferId: React.Dispatch<React.SetStateAction<string>>;
}
function PaymentConfirmation({ transferId, setTransferId }: PaymentConfirmationProps) {
  const { translations } = useTranslation();
  return (
    <YStack gap={40}>
      <YStack gap={8}>
        <Text fontSize={18} color="#000" fontWeight="600">
          {translations.confirmYourPayment}
        </Text>

        <Text fontSize={12} color="#868889" lineHeight={20}>
          {translations.confirmYourPaymentDescription}
        </Text>
      </YStack>

      <YStack gap={8}>
        <Text fontSize={15} color="#000" fontWeight="600">
          {translations.depositIdOrTransferId}
        </Text>

        <TextInput
          value={transferId}
          onChangeText={setTransferId}
          placeholder={translations.enterDepositIdOrTransferId}
          style={styles.input}
        />

        <Text fontSize={12} color="#86888980">
          {translations.depositIdOrTransferIdDescription}
        </Text>
      </YStack>
    </YStack>
  );
}

export default PaymentConfirmation;
