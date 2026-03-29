import { router } from 'expo-router';
import { ArrowLeft2 } from 'iconsax-react-nativejs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, View, Button, XStack } from 'tamagui';

import Skeleton from '../skeleton';

export default function FactorySkeleton() {
  const insets = useSafeAreaInsets();

  return (
    <YStack flex={1} backgroundColor="#fff">
      <View height={220} backgroundColor="#fff">
        <Button
          width={40}
          height={40}
          icon={<ArrowLeft2 color="#000" size={24} variant="Linear" />}
          position="absolute"
          top={insets.top}
          left={20}
          zIndex={2}
          onPress={() => router.back()}
        />
        <View position="absolute" bottom={0} left={16} right={16} gap={10}>
          <XStack gap={10}>
            <Skeleton width={60} height={60} borderRadius={12} />
            <YStack gap={10}>
              <Skeleton width="50%" height={16} borderRadius={12} />
              <Skeleton width="30%" height={16} borderRadius={12} />
            </YStack>
          </XStack>
          <XStack gap={10}>
            <YStack gap={10}>
              <Skeleton width="50%" height={16} borderRadius={12} />
              <Skeleton width="30%" height={16} borderRadius={12} />
            </YStack>
            <YStack gap={10}>
              <Skeleton width="50%" height={16} borderRadius={12} />
              <Skeleton width="30%" height={16} borderRadius={12} />
            </YStack>
          </XStack>
        </View>
      </View>

      <XStack
        paddingHorizontal={16}
        paddingVertical={12}
        gap={12}
        backgroundColor="#fff"
        borderBottomWidth={1}
        borderColor="#E1E9EE">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} width={100} height={20} borderRadius={4} />
        ))}
      </XStack>

      <YStack padding={16} gap={16}>
        <Skeleton width="45%" height={25} borderRadius={8} />

        <XStack flexWrap="wrap" justifyContent="flex-start" gap={24}>
          {[1, 2, 3, 4].map((item) => (
            <YStack width="45%" gap={10} key={item}>
              <Skeleton width="45%" height={160} borderRadius={16} />
              <Skeleton height={18} width="45%" borderRadius={16} />
              <Skeleton height={16} width="35%" borderRadius={16} />
              <Skeleton height={24} width="30%" borderRadius={16} />
            </YStack>
          ))}
        </XStack>
      </YStack>
    </YStack>
  );
}
