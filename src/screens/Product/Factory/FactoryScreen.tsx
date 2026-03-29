import { observer, use$ } from '@legendapp/state/react';
import { useGetCart } from 'api/cart';
import { useGetProductsByFactory } from 'api/catalogue';
import { FactorySkeleton, StoreCategoriesTabs, StoreInfoCard, StoreProductCard } from 'components';
import { ImageBackground } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'hooks';
import { ArrowLeft2 } from 'iconsax-react-nativejs';
import { useCallback, useState, useEffect } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Routes } from 'routers';
import { factoryStore, userStore } from 'store';
import { YStack, Button, View, XStack, Text } from 'tamagui';
import { SwellFactory, SwellProduct } from 'types';

import { formatCurrency } from '../../../helpers/currencyFormatter';

function FactoryScreen() {
  const insets = useSafeAreaInsets();
  const { translations } = useTranslation();
  const { data: cartData } = useGetCart();
  const { id } = useLocalSearchParams();
  const { account } = use$(userStore);
  const { isPending, data, isFetching } = useGetProductsByFactory(id as string, account?.id);
  const { selectedSubCategory, setSelectedSubCategory } = use$(factoryStore);
  const [products, setProducts] = useState<SwellProduct[]>([]);

  useEffect(() => {
    if (data) {
      if (selectedSubCategory) {
        setProducts(data?.groupedProducts[selectedSubCategory] || []);
      } else {
        setProducts(Object.values(data?.groupedProducts).flat());
      }
    }
  }, [data, selectedSubCategory]);

  const handleTabSelect = useCallback(
    (category: string) => {
      setSelectedSubCategory(category === translations.all ? undefined : category);
    },
    [setSelectedSubCategory]
  );

  if (isFetching || isPending || !data) {
    return <FactorySkeleton />;
  }

  const cartItemsCount: number =
    cartData?.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;
  return (
    <YStack flex={1} backgroundColor="#fff">
      <ImageBackground
        source={{
          uri: data.factory?.content?.store_front_cover_photo?.url,
        }}
        style={{ width: '100%', height: 220 }}
        contentFit="cover">
        <Button
          width={40}
          height={40}
          icon={<ArrowLeft2 color="#000" size={24} variant="Linear" />}
          position="absolute"
          top={insets.top}
          left={20}
          zIndex={2}
          onPress={() => {
            router.back();
          }}
        />
        <View zIndex={1} flex={1} justifyContent="center" paddingHorizontal={16}>
          <StoreInfoCard factory={data.factory as SwellFactory} />
        </View>
      </ImageBackground>

      {Object.keys(data.groupedProducts).length > 0 ? (
        <YStack marginTop={100} flex={1} backgroundColor="#fff">
          <StoreCategoriesTabs
            onSelectCategory={handleTabSelect}
            categories={[translations.all, ...Object.keys(data?.groupedProducts || {})]}
            selectedCategory={selectedSubCategory || translations.all}
          />

          <ScrollView
            style={{ backgroundColor: '#F4F5F9' }}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}>
            {selectedSubCategory !== translations.all ? (
              <YStack gap={8} flex={1}>
                <Text fontSize={18} fontWeight="600" marginTop={20} paddingHorizontal={16}>
                  {selectedSubCategory}
                </Text>
                <XStack flexWrap="wrap" gap={16} padding={16}>
                  {products.map((product, index) => (
                    <StoreProductCard product={product} width="47.5%" key={index} />
                  ))}
                </XStack>
              </YStack>
            ) : (
              <XStack flexWrap="wrap" gap={16} padding={16} paddingTop={24}>
                {products.map((product, index) => (
                  <StoreProductCard product={product} width="47.5%" key={index} />
                ))}
              </XStack>
            )}
          </ScrollView>
        </YStack>
      ) : (
        <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="#fff">
          <Text>No products found for this factory.</Text>
        </YStack>
      )}

      {cartItemsCount > 0 && (
        <Button
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          borderRadius={27}
          position="absolute"
          bottom={insets.bottom + 6}
          left={16}
          right={16}
          backgroundColor="#108910"
          height={54}
          width={Dimensions.get('window').width - 32}
          onPress={() => router.navigate(Routes.Cart)}>
          <XStack alignItems="center" gap={10}>
            <View
              height={22}
              width={22}
              backgroundColor="#fff"
              borderRadius={12}
              justifyContent="center"
              alignItems="center">
              <Text color="#000" fontSize={12} fontWeight="400" textAlign="center" lineHeight={16}>
                {cartItemsCount}
              </Text>
            </View>
            <Text color="#fff" fontSize={17} fontWeight="500">
              View Cart
            </Text>
          </XStack>
          <Text color="#fff" fontSize={17} fontWeight="500">
            ({formatCurrency(cartData?.grandTotal || 0, cartData?.currency)})
          </Text>
        </Button>
      )}
    </YStack>
  );
}

export default observer(FactoryScreen);
