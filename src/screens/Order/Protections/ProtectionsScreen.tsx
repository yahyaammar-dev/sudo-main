import { ThemedSafeAreaView } from 'components';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft2 } from 'iconsax-react-nativejs';
import { ScrollView } from 'react-native';
import { Button, Text, XStack, YStack } from 'tamagui';

export default function ProtectionsScreen() {
  const { title, description } = useLocalSearchParams();
  return (
    <ThemedSafeAreaView edges={['top']}>
      <YStack paddingHorizontal={26}>
        <XStack paddingVertical={18} alignItems="center">
          <Button
            backgroundColor="transparent"
            borderWidth={1}
            borderColor="#D8DADC"
            borderRadius={8}
            width={40}
            height={40}
            icon={<ArrowLeft2 size={20} color="#000000" />}
            onPress={() => router.back()}
          />
          <Text fontSize={18} color="#000000" fontWeight="600" flex={1} textAlign="center">
            Protections
          </Text>
        </XStack>
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack gap={5}>
            <Text color="#000000" fontSize={18} fontWeight="600">
              {title}
            </Text>
            <Text color="#858585" fontSize={13} fontWeight="400">
              {description}
            </Text>
          </YStack>
        </ScrollView>
      </YStack>
    </ThemedSafeAreaView>
  );
}
