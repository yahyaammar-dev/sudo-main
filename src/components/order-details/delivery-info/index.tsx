import { router } from 'expo-router';
import { useTranslation } from 'hooks';
import { ArrowRight2 } from 'iconsax-react-nativejs';
import { Image, TouchableWithoutFeedback } from 'react-native';
import { Routes } from 'routers';
import { Text, XStack, YStack } from 'tamagui';

import { styles } from './styles';

type DeliveryInfoProps = {
  address?: Partial<{
    address1: string;
    address2: string;
    city: string;
    zip: string;
    state: string;
    country: string;
    phone: string;
  }>;
  isNavigable?: boolean;
};
function DeliveryInfo({ address, isNavigable }: DeliveryInfoProps) {
  const { translations } = useTranslation();
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (isNavigable) {
          router.navigate({
            pathname: Routes.MyAddresses,
            params: {
              address: JSON.stringify(address),
            },
          });
        }
      }}>
      <YStack gap={8}>
        <Text fontSize={10} color="#6B6B6B">
          {translations.deliveringTo}
        </Text>
        <XStack alignItems="center" gap={8} justifyContent="space-between">
          <XStack alignItems="center" gap={8}>
            <Image
              source={require('../../../../assets/images/house.png')}
              style={styles.image}
              resizeMode="contain"
            />
            <Text fontSize={15} fontWeight="600" color="#262626">
              {address?.city}
            </Text>
          </XStack>
          {isNavigable && <ArrowRight2 size={20} fontWeight="bold" color="#000" />}
        </XStack>
        <Text fontSize={11} color="#262626" lineHeight={20}>
          {address?.address1}
          {address?.address2 && `, ${address?.address2}`}
          {address?.zip && `, ${address?.zip}`}
          {address?.state && `, ${address?.state}`}
          {address?.country && `, ${address?.country}`}
        </Text>
      </YStack>
    </TouchableWithoutFeedback>
  );
}

export default DeliveryInfo;
