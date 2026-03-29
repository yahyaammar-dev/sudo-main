import { use$ } from '@legendapp/state/react';
import { useGetCategories } from 'api/queries';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useTranslation } from 'hooks';
import { Image as ImageIcon } from 'iconsax-react-nativejs';
import { useRef, useState, useEffect, useCallback } from 'react';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableWithoutFeedback,
} from 'react-native';
import { Routes } from 'routers';
import { categoriesStore } from 'store';
import { Category } from 'swell-js';
import { Text, View, XStack, YStack } from 'tamagui';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { width, height: 300 },
  scrollContainer: { gap: 0 },
  dotStyle: {
    backgroundColor: '#D1D1D1',
    width: 6,
    height: 6,
    borderRadius: 10,
  },
  activeDotStyle: {
    backgroundColor: '#6CC51D',
    width: 20,
    height: 6,
    borderRadius: 10,
  },
  containerStyle: {
    gap: 5,
    zIndex: 1000,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});

interface ShopByCategoryProps {
  enabled: boolean;
}

function ShopByCategory({ enabled }: ShopByCategoryProps) {
  const { translations } = useTranslation();
  const [categoryPages, setCategoryPages] = useState<Category[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { setCategory } = use$(categoriesStore);
  const { data: categories, isLoading, error, isFetching, isPending } = useGetCategories();
  const ITEM_COLUMN_GAP = 30;
  const ITEM_ROW_GAP = 12;
  const ITEM_PER_ROW = 3;

  const ITEM_WIDTH = (width - 40 - ITEM_COLUMN_GAP * (ITEM_PER_ROW - 1)) / ITEM_PER_ROW;

  useEffect(() => {
    if (categories?.length) {
      const pages = categories.reduce((acc: any[], category, index) => {
        const pageIndex = Math.floor(index / 6);
        if (!acc[pageIndex]) {
          acc[pageIndex] = [];
        }
        acc[pageIndex].push(category);
        return acc;
      }, []);

      setCategoryPages(pages);
    }
  }, [categories]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  }, []);

  const getVisiblePaginationData = () => {
    const totalPages = categoryPages.length;
    if (totalPages <= 4) {
      return categoryPages.map((_, index) => index);
    }

    let startPage = Math.max(0, currentIndex - 1);
    if (startPage + 4 > totalPages) {
      startPage = totalPages - 4;
    }

    return Array.from({ length: 4 }, (_, i) => startPage + i);
  };

  if (isLoading || isFetching || isPending) {
    return (
      <YStack w="100%" gap={16}>
        <Text fontSize={18} fontWeight="600" color="#000">
          {translations.shopByCategory}
        </Text>
        <XStack w="100%" gap={12} flexWrap="wrap" justifyContent="space-between">
          {[...Array(6)].map((_, index) => (
            <YStack key={index} borderRadius={12} gap={6} overflow="hidden" width={98}>
              <View width={98} height={98} backgroundColor="#f0f0f0" borderRadius={12} />
              <View
                width={60}
                height={12}
                backgroundColor="#f0f0f0"
                borderRadius={6}
                alignSelf="center"
              />
            </YStack>
          ))}
        </XStack>
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack w="100%" px={20} gap={16}>
        <Text fontSize={18} fontWeight="600" color="#000">
          {translations.shopByCategory}
        </Text>
        <Text>Error loading categories</Text>
      </YStack>
    );
  }

  if (!categoryPages.length) {
    return (
      <YStack w="100%" px={20} gap={16}>
        <Text fontSize={18} fontWeight="600" color="#000">
          {translations.shopByCategory}
        </Text>
        <Text>No categories available</Text>
      </YStack>
    );
  }

  return (
    <YStack w="100%" gap={16}>
      <Text fontSize={18} fontWeight="600" color="#000">
        {translations.shopByCategory}
      </Text>

      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={width}
          snapToAlignment="start"
          contentContainerStyle={styles.scrollContainer}
          scrollEnabled={enabled && categoryPages.length > 1}
          style={styles.container}>
          {categoryPages.map((pageCategories, pageIndex) => (
            <XStack
              key={pageIndex}
              w={width}
              px={2.5}
              flexWrap="wrap"
              columnGap={ITEM_COLUMN_GAP}
              rowGap={ITEM_ROW_GAP}>
              {pageCategories.map((category: Category, index) => (
                <YStack
                  key={index}
                  onPress={() => {
                    setCategory(category);
                    router.navigate({
                      pathname: Routes.ProductListing,
                      params: { id: category.slug },
                    });
                  }}
                  pressStyle={{ opacity: 0.5 }}
                  borderRadius={12}
                  gap={6}
                  overflow="hidden"
                  width={ITEM_WIDTH}>
                  {category?.images?.[0]?.file?.url ? (
                    <Image
                      source={{ uri: category.images[0].file.url }}
                      style={{ width: '100%', height: 98, borderRadius: 12 }}
                      contentFit="cover"
                    />
                  ) : (
                    <View
                      width={98}
                      height={98}
                      backgroundColor="#f0f0f0"
                      borderRadius={12}
                      justifyContent="center"
                      alignItems="center">
                      <ImageIcon size={32} color="#999" />
                    </View>
                  )}
                  <Text fontSize={12} color="#000" fontWeight="500" textAlign="center">
                    {category.name}
                  </Text>
                </YStack>
              ))}
            </XStack>
          ))}
        </ScrollView>

        {categoryPages.length > 1 && (
          <XStack gap={5} justifyContent="center" alignItems="center" zIndex={1000}>
            {getVisiblePaginationData().map((pageIndex) => (
              <TouchableWithoutFeedback key={pageIndex} onPress={() => scrollToIndex(pageIndex)}>
                <View
                  style={[styles.dotStyle, currentIndex === pageIndex && styles.activeDotStyle]}
                />
              </TouchableWithoutFeedback>
            ))}
          </XStack>
        )}
      </View>
    </YStack>
  );
}

export default ShopByCategory;
