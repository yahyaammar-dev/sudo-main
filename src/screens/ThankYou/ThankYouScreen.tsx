import { Octicons } from '@expo/vector-icons';
import ThemedSafeAreaView from 'components/safe-area-view';
import { router } from 'expo-router';
import { useTranslation } from 'hooks';
import { Routes } from 'routers';
import { YStack, View, Text, Button, ButtonText } from 'tamagui';

export default function ThankYouScreen() {
  const { translations } = useTranslation();

  const handleNavigateHome = () => {
    router.replace(Routes.Home);
  };

  return (
    <ThemedSafeAreaView>
      <YStack pt={120} paddingHorizontal={33} alignItems="center" gap={40}>
        <View
          bg="#108910"
          width={122.5}
          height={122.5}
          borderRadius={100}
          alignItems="center"
          justifyContent="center">
          <Octicons name="check" size={80} color="#fff" />
        </View>

        <YStack alignItems="center" gap={10}>
          <Text fontSize={30} fontWeight="700" color="#0B0B0B">
            {translations.thankYouForYourSubmission}
          </Text>
          <Text fontSize={16} color="#000000B2">
            {translations.yourApplicationIsUnderReview}
          </Text>
        </YStack>

        <Button
          bg="#108910"
          width="100%"
          height={56}
          borderRadius={28}
          pressStyle={{ opacity: 0.8, backgroundColor: '#108910' }}
          onPress={handleNavigateHome}>
          <ButtonText color="#fff" fontWeight={600} size={16}>
            View Products
          </ButtonText>
        </Button>
      </YStack>
    </ThemedSafeAreaView>
  );
}
