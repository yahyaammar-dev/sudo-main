import {
  getStatusColor,
  getStatusMessage,
  getStatusTitle,
  orderStatusText,
} from 'constants/order-details';
import { useTranslation } from 'hooks';
import { Image } from 'react-native';
import { Card, Circle, Text, View, XStack, YStack } from 'tamagui';
import { OrderStatus } from 'types';

import { styles } from './styles';
import {
  InfoIcon,
  MoneyBagIcon,
  TimerIcon,
  ShippingIcon,
  CheckIcon,
  Check2Icon,
  Check3Icon,
} from '../../../../assets/icons';

type OrderInfoCardProps = {
  orderId: string;
  orderStatus: OrderStatus;
  estimatedArrival: string;
  factoryImage: string;
};
function OrderInfoCard({
  orderId,
  orderStatus,
  estimatedArrival,
  factoryImage,
}: OrderInfoCardProps) {
  const { translations } = useTranslation();
  const getStatusIcon = () => {
    switch (orderStatus) {
      case OrderStatus.PaymentRequired:
        return <InfoIcon width={20} height={20} />;
      case OrderStatus.OrderShipped:
        return <ShippingIcon width={20} height={20} />;
      case OrderStatus.OrderInspected:
        return <CheckIcon width={20} height={20} />;
      default:
        return <TimerIcon width={20} height={20} />;
    }
  };

  const orderStatusIcon = () => {
    switch (orderStatus) {
      case OrderStatus.PaymentReceived:
        return <Check2Icon size={28} />;
      case OrderStatus.OrderShipped:
        return <ShippingIcon size={28} />;
      case OrderStatus.OrderInspected:
        return <Check3Icon size={28} />;
      default:
        return <MoneyBagIcon size={28} />;
    }
  };

  return (
    <YStack gap={12}>
      <Card
        backgroundColor="#fff"
        borderColor="#E5E5E5"
        borderWidth={1}
        borderRadius={12}
        padding={16}>
        <XStack alignItems="center" justifyContent="space-between">
          <XStack alignItems="center" gap={8}>
            <Image source={{ uri: factoryImage }} style={styles.image} resizeMode="contain" />
            <Text fontSize={11} color="#262626">
              {translations.order} #{orderId}
            </Text>
          </XStack>
          <View
            backgroundColor={getStatusColor(orderStatus)}
            paddingHorizontal={8}
            paddingVertical={4}
            borderRadius={4}>
            <Text color="white" fontSize={10} fontWeight="500">
              {orderStatusText[orderStatus as OrderStatus]}
            </Text>
          </View>
        </XStack>

        <XStack marginTop={16} alignItems="center" justifyContent="space-between">
          <YStack gap={4}>
            <Text fontSize={9} color="#6B6B6B">
              {translations.estimatedArrival}
            </Text>
            <Text fontSize={18} fontWeight="500">
              {estimatedArrival}
            </Text>
          </YStack>
          <Circle padding={10} size={49} borderWidth={2} borderColor="#E5E5E5">
            {orderStatusIcon()}
          </Circle>
        </XStack>
      </Card>
      <YStack gap={8}>
        <XStack alignItems="center" gap={4}>
          {getStatusIcon()}
          <Text fontSize={16} fontWeight="600" color="#333">
            {getStatusTitle(orderStatus)}
          </Text>
        </XStack>
        <Text fontSize={14} color="#666" lineHeight={20}>
          {getStatusMessage(orderStatus)}
        </Text>
      </YStack>
    </YStack>
  );
}

export default OrderInfoCard;
