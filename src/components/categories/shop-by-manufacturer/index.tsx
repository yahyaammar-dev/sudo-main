import { use$ } from '@legendapp/state/react';
import { useGetFactories } from 'api/catalogue';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useTranslation } from 'hooks';
import { Building } from 'iconsax-react-nativejs';
import React from 'react';
import { ScrollView } from 'react-native';
import { Routes } from 'routers';
import { factoryStore } from 'store';
import { Text, View, XStack, YStack } from 'tamagui';

import { ManufacturerCardSkeleton } from '../../ui';

function ShopByManufacturer() {
  const { translations } = useTranslation();
  const { data: factories, isLoading } = useGetFactories();
  const { setSelectedFactory, setSelectedSubCategory } = use$(factoryStore);
  
  return (
    <YStack flex={1} gap={16}>
      <Text fontSize={18} fontWeight="600" color="#000">
        {translations.shopByManufacturer}
      </Text>

      <ScrollView horizontal directionalLockEnabled showsHorizontalScrollIndicator={false}>
        <XStack alignItems="flex-start" flex={1} gap={20}>
          {isLoading
            ? [...Array(5)].map((_, index) => <ManufacturerCardSkeleton key={index} />)
            : factories?.map((manufacturer) => (
                <YStack
                  onPress={() => {
                    setSelectedFactory(manufacturer.content);
                    setSelectedSubCategory(undefined);
                    router.push({
                      pathname: Routes.Factory,
                      params: { id: manufacturer.id },
                    });
                  }}
                  pressStyle={{
                    opacity: 0.5,
                  }}
                  key={manufacturer.id}
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                  width={70}>
                  <View
                    bg="white"
                    borderRadius={60}
                    alignItems="center"
                    justifyContent="center"
                    width={70}
                    height={70}
                    borderWidth={1}
                    borderColor="#EBEBEB">
                    {manufacturer.content?.store_front_cover_photo?.url ? (
                      <Image
                        source={{ uri: manufacturer.content.store_front_logo.url }}
                        style={{ width: 70, height: 70, borderRadius: 60 }}
                        contentFit="contain"
                      />
                    ) : (
                      <Building size={30} color="#858585" />
                    )}
                  </View>
                  <Text fontSize={10} textAlign="center">
                    {manufacturer?.content?.factory_name}
                  </Text>
                </YStack>
              ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
export default ShopByManufacturer;
