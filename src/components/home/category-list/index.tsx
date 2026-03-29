import { use$ } from '@legendapp/state/react';
import { useGetCategories } from 'api/categories';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ArrowRight2 } from 'iconsax-react-nativejs';
import { useState, useCallback, useEffect, Dispatch, SetStateAction } from 'react';
import {
  ScrollView,
  TouchableWithoutFeedback,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Routes } from 'routers';
import { categoriesStore } from 'store';
import { Category } from 'swell-js';
import { Text, View, XStack, YStack } from 'tamagui';

interface CategoryListProps {
  categories: Category[];
  isPending: boolean;
  isFetching: boolean;
  error: Error | null;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}

function CategoryList({
  categories,
  isPending,
  isFetching,
  error,
  page,
  setPage,
}: CategoryListProps) {
  const { setCategory } = use$(categoriesStore);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (categories?.length) {
      setAllCategories((prev) => [...prev, ...categories]);
    }
  }, [categories]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const paddingRight = 20;
      const isCloseToRight =
        layoutMeasurement.width + contentOffset.x >= contentSize.width - paddingRight;

      if (isCloseToRight && !isPending && !isFetching) {
        setPage((prev) => prev + 1);
      }
    },
    [isPending, isFetching]
  );

  if (isPending && page === 1) {
    return (
      <YStack gap={20}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={18} fontWeight="600" color="#000">
            Categories
          </Text>
          <ArrowRight2 size={20} color="#000" />
        </XStack>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack gap={22}>
            {[...Array(6)].map((_, index) => (
              <YStack key={index} alignItems="center" gap={8}>
                <View
                  aspectRatio={1}
                  width={60}
                  height={60}
                  borderRadius={10}
                  backgroundColor="#f0f0f0"
                />
                <View width={50} height={10} backgroundColor="#f0f0f0" borderRadius={5} />
              </YStack>
            ))}
          </XStack>
        </ScrollView>
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack gap={20}>
        <Text>Error loading categories</Text>
      </YStack>
    );
  }

  return (
    <YStack gap={20}>
      <XStack
        onPress={() => {
          router.navigate(Routes.Categories);
        }}
        justifyContent="space-between"
        alignItems="center">
        <Text fontSize={18} fontWeight="600" color="#000">
          Categories
        </Text>
        <ArrowRight2 size={20} color="#000" />
      </XStack>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        <XStack gap={22}>
          {allCategories.map((category, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => {
                setCategory(category);
                router.push({
                  pathname: Routes.ProductListing,
                  params: {
                    id: category.slug as string,
                  },
                });
              }}>
              <YStack alignItems="center" gap={8}>
                <View aspectRatio={1} width={60} height={60} borderRadius={10}>
                  {category?.images?.[0]?.file?.url ? (
                    <Image
                      source={{ uri: category.images[0].file.url }}
                      style={{ width: '100%', height: '100%', borderRadius: 10 }}
                      contentFit="cover"
                    />
                  ) : null}
                </View>
                <Text fontSize={10} textAlign="center" numberOfLines={2} color="#000">
                  {category.name}
                </Text>
              </YStack>
            </TouchableWithoutFeedback>
          ))}
          {(isPending || isFetching) && page > 1 && (
            <YStack alignItems="center" gap={8}>
              <View
                aspectRatio={1}
                width={60}
                height={60}
                borderRadius={10}
                backgroundColor="#f0f0f0"
              />
              <View width={50} height={10} backgroundColor="#f0f0f0" borderRadius={5} />
            </YStack>
          )}
        </XStack>
      </ScrollView>
    </YStack>
  );
}

export default CategoryList;
