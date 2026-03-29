import { useQueryClient } from '@tanstack/react-query';
import { catalogueKeyFactory } from 'api/catalogue/key-factory';
import { categoriesKeyFactory } from 'api/categories';
import { ShopByCategory, ShopByManufacturer, ThemedSafeAreaView, ProductSearch } from 'components';
import { router } from 'expo-router';
import { useTranslation } from 'hooks';
import { ArrowLeft2 } from 'iconsax-react-nativejs';
import { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, ImageBackground, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, View, XStack, YStack } from 'tamagui';

function Categories() {
  const { translations } = useTranslation();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.resetQueries({ queryKey: [categoriesKeyFactory.categories] });
    await queryClient.resetQueries({ queryKey: [catalogueKeyFactory.factories] });
    await queryClient.invalidateQueries({ queryKey: [categoriesKeyFactory.categories] });
    await queryClient.invalidateQueries({ queryKey: [catalogueKeyFactory.factories] });
    setRefreshing(false);
  }, [queryClient]);

  return (
    <ThemedSafeAreaView edges={['top']} style={styles.container}>
      <YStack paddingBottom={insets.bottom + 16} flex={1} backgroundColor="#fff">
        <YStack p={16} backgroundColor="white">
          <XStack alignItems="center">
            <Button
              borderRadius={8}
              backgroundColor="white"
              borderColor="#e0e0e0"
              borderWidth={1}
              padding={8}
              width={40}
              height={40}
              pressStyle={{ opacity: 0.7 }}
              onPress={() => router.back()}>
              <ArrowLeft2 size={20} color="#000" />
            </Button>
            <Text fontSize={18} fontWeight="600" flex={1} textAlign="center">
              {translations.categories}
            </Text>
            <View width={40} />
          </XStack>
        </YStack>

        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <YStack gap={24}>
            <ProductSearch dropdownPosition={45} />

            <XStack flex={1} justifyContent="center" gap={32}>
              <ImageBackground
                source={require('../../../../assets/images/ready-to-ship.png')}
                style={{ width: 160, height: 160, paddingTop: 16, alignItems: 'center' }}
                resizeMode="contain">
                <Text fontSize={16} fontWeight="800" color="#000">
                  {translations.readyToShip}
                </Text>
              </ImageBackground>

              <ImageBackground
                source={require('../../../../assets/images/request-for-qoutation.png')}
                style={{ width: 160, height: 160, paddingTop: 16, alignItems: 'center' }}
                resizeMode="contain">
                <Text fontSize={16} fontWeight="800" color="#000" textAlign="center">
                  {translations.requestForQuotation}
                </Text>
              </ImageBackground>
            </XStack>

            <YStack flex={1} gap={80}>
              <ShopByCategory enabled={false} />
              <ShopByManufacturer />
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
});

export default Categories;
