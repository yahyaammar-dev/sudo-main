import { use$ } from '@legendapp/state/react';
import { router } from 'expo-router';
import { formatCurrency } from 'helpers';
import { useTranslation } from 'hooks';
import { ActivityIndicator } from 'react-native';
import { Routes } from 'routers';
import { factoryStore } from 'store';
import { Button, Text, XStack, YStack } from 'tamagui';

import InfoIcon from '../../../../assets/icons/info';

type CartFooterProps = {
  amountNeeded: number;
  isEmpty?: boolean;
  onCheckoutPress: () => void;
  isLoading?: boolean;
  currency?: string;
};

function CartFooter({
  amountNeeded,
  isEmpty = false,
  onCheckoutPress,
  isLoading = false,
  currency = 'USD',
}: CartFooterProps) {
  const canCheckout = !isEmpty && amountNeeded <= 0;
  const { translations } = useTranslation();
  const { factoryId } = use$(factoryStore);
  return (
    <YStack
      borderTopColor="#E3E7EC"
      borderTopWidth={1}
      paddingTop={50}
      paddingHorizontal={16}
      gap={16}>
      {!isEmpty && amountNeeded > 0 && (
        <XStack alignItems="center" gap={3} justifyContent="center">
          <InfoIcon />
          <Text color="#343538" fontSize={13}>
            {formatCurrency(amountNeeded, currency ?? 'USD')}
            {translations.neededToReachMinimumOrder}
          </Text>
        </XStack>
      )}
      <XStack gap={12}>
        <Button
          flex={1}
          height={54}
          backgroundColor="transparent"
          borderWidth={1}
          borderColor="#000"
          borderRadius={27}
          onPress={() => {
            if (factoryId) {
              router.navigate({
                pathname: Routes.Factory,
                params: {
                  id: factoryId,
                },
              });
            }
          }}>
          <Text fontSize={14} color="#000" fontWeight="600">
            {isEmpty ? 'Continue Shopping' : translations.addItems}
          </Text>
        </Button>

        <Button
          flex={1}
          height={54}
          borderWidth={1}
          borderColor={canCheckout ? '#108910' : '#E5E5E5'}
          backgroundColor={canCheckout ? '#108910' : '#E5E5E5'}
          borderRadius={27}
          disabled={!canCheckout || isLoading}
          onPress={onCheckoutPress}>
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text color={canCheckout ? 'white' : '#A1A1A1'} fontSize={17} fontWeight="500">
              {translations.checkout}
            </Text>
          )}
        </Button>
      </XStack>
    </YStack>
  );
}

export default CartFooter;
