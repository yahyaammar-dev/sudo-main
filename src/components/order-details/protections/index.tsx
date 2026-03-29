import { useGetProtection } from 'api/queries';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useTranslation } from 'hooks';
import { ArrowRight2 } from 'iconsax-react-nativejs';
import { Routes } from 'routers';
import { Text, XStack, YStack } from 'tamagui';

function Protections() {
  const { translations } = useTranslation();
  const { data: protectionData } = useGetProtection();
  const handlePress = (item: any) => {
    router.navigate({
      pathname: Routes.OrderProtections,
      params: {
        title: item.content.title,
        description: item.content.longDescription,
      },
    });
  };
  return (
    <YStack pr={20} gap={16}>
      <Text fontSize={16} fontWeight="600" color="#333">
        {translations.protections}
      </Text>

      {protectionData?.results?.map((item: any, index: number) => (
        <XStack key={item.id || index} alignItems="center" justifyContent="space-between">
          <XStack alignItems="flex-start" gap={12} flex={1}>
            <Image style={{ width: 16, height: 16 }} source={{ uri: item.content.icon.url }} />
            <YStack onPress={() => handlePress(item)} gap={4} flex={1}>
              <Text fontSize={11} color="#030303">
                {item.content.title}
              </Text>
              <Text fontSize={11} color="#090909" lineHeight={18}>
                {item.content.shortDescription}
              </Text>
            </YStack>
          </XStack>
          <ArrowRight2 size={16} color="#090909" />
        </XStack>
      ))}
    </YStack>
  );
}

export default Protections;
