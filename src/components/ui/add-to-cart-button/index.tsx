import { use$ } from '@legendapp/state/react';
import { useTranslation } from 'hooks';
import { Add, Minus } from 'iconsax-react-nativejs';
import { StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { userStore } from 'store';
import { Button, Text, View, XStack, YStack } from 'tamagui';
import { SwellSearchProduct } from 'types';

import { Bag2Icon } from '../../../../assets/icons';

interface AddToCartButtonProps {
  addToCart: () => void;
  isLoading?: boolean;
  setQuantity: (quantity: number) => void;
  quantity: number;
  product: SwellSearchProduct | undefined;
  moq?: number;
}

const AddToCartButton = ({
  addToCart,
  isLoading = false,
  setQuantity,
  quantity,
  product,
  moq = 1,
}: AddToCartButtonProps) => {
  const { translations } = useTranslation();
  const { account } = use$(userStore);
  const { bottom } = useSafeAreaInsets();
  return (
    <YStack pb={bottom + 16} pt={14} px={18} gap={27} borderTopWidth={1} borderTopColor="#EBEBEB">
      {account?.isVerified && (
        <XStack
          alignItems="center"
          justifyContent="space-between"
          borderColor="#EBEBEB"
          borderWidth={1}
          borderRadius={5}>
          <Text px={18} py={12} color="#868889" fontSize={12} fontWeight="500">
            {translations.quantity}
          </Text>
          <XStack alignItems="center">
            <Button
              width={50}
              backgroundColor="transparent"
              onPress={() => setQuantity(Math.max(moq, quantity - moq))}>
              <Minus size={20} color={quantity <= moq ? '#EBEBEB' : '#6CC51D'} />
            </Button>
            <View
              borderLeftColor="#EBEBEB"
              borderRightColor="#EBEBEB"
              borderRightWidth={1}
              borderLeftWidth={1}
              height={50}
              justifyContent="center"
              width={50}>
              <Text textAlign="center" fontSize={16} fontWeight="600">
                {quantity}
              </Text>
            </View>
            <Button
              width={50}
              backgroundColor="transparent"
              onPress={() => setQuantity(quantity + moq)}>
              <Add size={20} color="#6CC51D" />
            </Button>
          </XStack>
        </XStack>
      )}
      <View px={12}>
        <TouchableOpacity
          style={[styles.addToCartButton, { backgroundColor: isLoading ? '#0a6b0a' : '#108910' }]}
          onPress={() => {
            if (account?.isVerified) {
              addToCart();
            } else {
              Linking.openURL(
                `whatsapp://send?phone=+15557796106&text= I want to buy this product: ${product?.name} - ${product?.id}`
              ).catch((_) => {
                Alert.alert('WhatsApp not installed');
              });
            }
          }}
          disabled={isLoading}>
          <View />

          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text color="#fff" fontSize={16} fontWeight="600">
              {account?.isVerified ? translations.addToCart : translations.getQuote}
            </Text>
          )}

          {!isLoading ? <Bag2Icon /> : <View />}
        </TouchableOpacity>
      </View>
    </YStack>
  );
};

export default AddToCartButton;

const styles = StyleSheet.create({
  fixedBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingBottom: 40,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
  },
  minusButton: {
    width: 32,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#EBEBEB',
    paddingRight: 12,
  },
  plusButton: {
    width: 32,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#EBEBEB',
    paddingLeft: 12,
  },
  addToCartButton: {
    backgroundColor: '#108910',
    borderRadius: 27,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
});
