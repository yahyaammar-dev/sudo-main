import { formatCurrency } from 'helpers';
import { useTranslation } from 'hooks';
import moment from 'moment';
import { Image } from 'react-native';
import { Card, Text, XStack, YStack } from 'tamagui';
import { SwellFactory } from 'types';

import { styles } from './styles';

interface LogisticsInfoCardProps {
  factory: SwellFactory;
  production_duration: number;
  dispatch_date: string;
  shipping: any;
  subtotal: number;
  currency: string;
}

function LogisticsInfoCard({
  factory,
  production_duration,
  dispatch_date,
  shipping,
  currency,
  subtotal,
}: LogisticsInfoCardProps) {
  const { translations } = useTranslation();
  return (
    <YStack gap={10}>
      <Card
        backgroundColor="white"
        borderRadius={12}
        borderWidth={1}
        borderColor="#eee"
        px={16}
        py={8}>
        <XStack alignItems="center" justifyContent="space-between" marginBottom={8}>
          <XStack alignItems="center" gap={12}>
            <Image
              source={require('../../../../assets/images/factory.png')}
              style={styles.image}
              resizeMode="contain"
            />
            <YStack>
              <Text fontSize={10} color="#393939">
                {translations.producer}
              </Text>
              <Text fontSize={14} fontWeight="700" color="#333">
                {factory?.name} {factory?.location && factory?.name ? `- ${factory.location}` : ''}
              </Text>
              <Text fontSize={10} color="#393939" fontWeight="500">
                {translations.productionDuration} {production_duration} {translations.day}
              </Text>
              <Text fontSize={10} color="#393939" fontWeight="500">
                {translations.dispatchDate} {moment(dispatch_date).format('Do [of] MMMM YYYY')}
              </Text>
            </YStack>
          </XStack>

          <Text fontSize={12} fontWeight="600" color="#343538">
            {formatCurrency(subtotal, currency ?? 'USD')}
          </Text>
        </XStack>
      </Card>

      <Card
        backgroundColor="white"
        borderRadius={12}
        borderWidth={1}
        borderColor="#eee"
        px={16}
        py={8}>
        <XStack alignItems="center" justifyContent="space-between" marginBottom={8}>
          <XStack alignItems="center" gap={12}>
            <Image
              source={require('../../../../assets/images/ship.png')}
              style={styles.image}
              resizeMode="contain"
            />
            <YStack>
              <Text fontSize={10} color="#393939">
                {translations.carrier}
              </Text>
              <Text fontSize={14} fontWeight="700" color="#333">
                {shipping?.company}
              </Text>
              <Text fontSize={10} color="#393939" fontWeight="500">
                {translations.shippingDate} {moment(shipping?.shipping_date).format('Do [of] MMMM')}
              </Text>
              <Text fontSize={10} color="#393939" fontWeight="500">
                {translations.duration} {shipping?.duration}
              </Text>
            </YStack>
          </XStack>

          <Text fontSize={12} fontWeight="600" color="#343538">
            {formatCurrency(shipping?.price ?? 0, shipping?.currency ?? 'USD')}
          </Text>
        </XStack>
      </Card>
    </YStack>
  );
}

export default LogisticsInfoCard;
