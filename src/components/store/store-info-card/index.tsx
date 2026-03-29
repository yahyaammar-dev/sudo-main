import { Image } from 'expo-image';
import { useTranslation } from 'hooks';
import { Text, XStack, YStack, Card } from 'tamagui';
import { SwellFactory } from 'types';

function StoreInfoCard({ factory }: { factory: SwellFactory }) {
  const { translations } = useTranslation();
  return (
    <Card
      backgroundColor="white"
      borderRadius={16}
      padding={16}
      width="100%"
      borderColor="#f0f0f0"
      borderWidth={1}
      top={100}>
      <YStack gap={42}>
        <XStack alignItems="center" gap={10}>
          <Card
            width={60}
            height={60}
            borderRadius={8}
            backgroundColor="#fff"
            borderColor="#E5E5E5"
            borderWidth={1}
            padding={8}
            overflow="hidden"
            alignItems="center"
            justifyContent="center">
            {factory?.content?.store_front_logo?.url ? (
              <Image
                source={{ uri: factory?.content?.store_front_logo?.url }}
                style={{ width: 64, height: 64 }}
                contentFit="contain"
              />
            ) : null}
          </Card>
          <YStack gap={4} flex={1}>
            <Text fontSize={15} fontWeight="600" color="#000">
              {factory?.content?.factory_name}
            </Text>
            <Text fontSize={12} color="#868889">
              {factory?.content?.complain}
            </Text>
          </YStack>
        </XStack>

        <XStack paddingHorizontal={30} justifyContent="space-between">
          {(factory?.content?.lead_time?.[0]?.min_days ||
            factory?.content?.lead_time?.[0]?.max_days) && (
            <YStack alignItems="center">
              <Text fontSize={10} color="#6B6B6B">
                {translations.leadTime}
              </Text>
              <Text fontSize={12} fontWeight="500" color="#000">
                {factory?.content?.lead_time?.[0]?.min_days}{' '}
                {factory?.content?.lead_time?.[0]?.min_days &&
                factory?.content?.lead_time?.[0]?.max_days
                  ? '-'
                  : ''}
                {factory?.content?.lead_time?.[0]?.max_days} Days
              </Text>
            </YStack>
          )}
          {factory?.content?.minimum_quantity && (
            <YStack alignItems="center">
              <Text fontSize={10} color="#6B6B6B">
                {translations.minimumQuantity}
              </Text>
              <Text fontSize={12} fontWeight="500" color="#000">
                {factory?.content?.minimum_quantity} Packs
              </Text>
            </YStack>
          )}
        </XStack>
      </YStack>
    </Card>
  );
}

export default StoreInfoCard;
