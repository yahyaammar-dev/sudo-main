import { useUpdateTransferId } from 'api/mutations';
import { BankInfoCard, PaymentConfirmation, ThemedSafeAreaView } from 'components';
import { Header } from 'components/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native';
import { YStack, Text, Button } from 'tamagui';

import { styles } from './styles';
function PaymentInstructionsScreen() {
  const { orderId } = useLocalSearchParams();
  const [transferId, setTransferId] = useState('');
  const { mutateAsync: updateTransferId, isSuccess, reset, isPending } = useUpdateTransferId();
  useEffect(() => {
    if (isSuccess) {
      router.back();
      reset();
    }
  }, [isSuccess, reset, router]);
  return (
    <ThemedSafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardAvoidingView}>
        <YStack flex={1} backgroundColor="#fff">
          <Header
            stackProps={{
              gap: 45,
            }}
            title="Payment Instructions"
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            <YStack padding={16} gap={24}>
              <BankInfoCard />
              <PaymentConfirmation transferId={transferId} setTransferId={setTransferId} />
            </YStack>
          </ScrollView>

          <YStack padding={16} gap={12}>
            <Button
              height={48}
              backgroundColor="#108910"
              borderRadius={24}
              pressStyle={{ opacity: 0.8 }}
              disabled={isPending || !transferId}
              onPress={() => {
                if (orderId && transferId) {
                  updateTransferId({
                    orderId: orderId as string,
                    transferId,
                  });
                }
              }}>
              {isPending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text fontSize={14} color="white" fontWeight="600">
                  Submit
                </Text>
              )}
            </Button>

            <Button
              height={48}
              backgroundColor="transparent"
              borderWidth={1}
              borderColor="#000"
              borderRadius={24}
              onPress={() => {
                router.back();
              }}
              disabled={isPending}
              pressStyle={{ opacity: 0.8 }}>
              <Text fontSize={14} color="#000" fontWeight="600">
                Cancel
              </Text>
            </Button>
          </YStack>
        </YStack>
      </KeyboardAvoidingView>
    </ThemedSafeAreaView>
  );
}

export default PaymentInstructionsScreen;
