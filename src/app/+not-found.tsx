import { Link, Stack } from 'expo-router';
import { useTranslation } from 'hooks';
import { Text, View, YStack } from 'tamagui';
export default function NotFoundScreen() {
  const { translations } = useTranslation();

  return (
    <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
      <Stack.Screen options={{ title: translations.oops }} />
      <View flex={1}>
        <YStack>
          <Text>{translations.thisScreenDoesNotExist}</Text>
          <Link href="/">
            <Text>{translations.goToHomeScreen}</Text>
          </Link>
        </YStack>
      </View>
    </View>
  );
}
