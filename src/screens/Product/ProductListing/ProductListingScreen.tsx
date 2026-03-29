import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { use$ } from '@legendapp/state/react';
import { useGetCategory, useGetSubcategories } from 'api/categories';
import { useGetProductByCategory, useGetProductsByCategories } from 'api/products';
import { CartIcon, ThemedSafeAreaView } from 'components';
import { ProductCard, ProductCardSkeleton } from 'components/ui';
import SortOptionsBottomSheet from 'components/ui/sort-options-bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft2 } from 'iconsax-react-nativejs';
import { useEffect, useState, useCallback, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Routes } from 'routers';
import { categoriesStore } from 'store';
import { XStack, YStack, Text, Button, View, Separator } from 'tamagui';

function ProductListingScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { category } = use$(categoriesStore);
  const [selectedSortOption, setSelectedSortOption] = useState('a-z');
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const { data: categoryData, isRefetching: isRefetchingCategory } = useGetCategory(id as string);
  const {
    data: subCategories,
    isRefetching: isLoadingSubCategories,
    refetch: refetchSubCategories,
  } = useGetSubcategories((category.id || id) as string);
  const [selectSubCategory, setSelectSubCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<any[]>([]);

  useEffect(() => {
    if (subCategories.length === 1) {
      setSelectSubCategory(subCategories[0].id);
    } else if (subCategories.length > 1 && selectSubCategory !== 'all') {
      setSelectSubCategory('all');
    }
  }, [subCategories.length]);

  const {
    data: products,
    isRefetching: isRefetchingProducts,
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
    refetch: refetchProducts,
  } = useGetProductByCategory(
    {
      category_id: selectSubCategory,
      limit: 10,
      page,
      sort: selectedSortOption,
    },
    {
      enabled: selectSubCategory !== 'all',
    }
  );

  const subcategoryIds = subCategories.map((sub) => sub.id);
  const {
    data: allSubcategoryProducts,
    isLoading: isLoadingAllCategories,
    isFetching: isFetchingAllCategories,
  } = useGetProductsByCategories(
    subcategoryIds,
    { limit: 10, page: 1, sort: selectedSortOption },
    selectSubCategory === 'all'
  );

  const selectedSubCategory =
    selectSubCategory === 'all'
      ? { id: 'all', name: 'All' }
      : subCategories.find((subCategory) => subCategory.id === selectSubCategory);

  const handleSortButtonPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSortOptionSelect = useCallback((option: any) => {
    setSelectedSortOption(option.value);
    setAllProducts([]);
    setPage(1);
  }, []);

  // Reset when switching subcategory — clears products and marks as not loaded
  useEffect(() => {
    setAllProducts([]);
    setPage(1);
    setProductsLoaded(false);
    setIsSwitching(true);

    return () => {
      setProductsLoaded(false);
      setAllProducts([]);
      setPage(1);
    };
  }, [selectSubCategory]);

  useEffect(() => {
    if (selectSubCategory === 'all') {
      setAllProducts(allSubcategoryProducts);
    }
  }, [selectSubCategory, allSubcategoryProducts.length]);

  useEffect(() => {
    if (selectSubCategory !== 'all' && products) {
      if (products.length) {
        if (page === 1) {
          setAllProducts(products);
        } else {
          setAllProducts((prev) => [...prev, ...products]);
        }
      }
    }
  }, [products, selectSubCategory, page]);

  // Mark as loaded only when all fetching is done and data is relevant to current selection
  useEffect(() => {
    const isFetchingRelevant =
      selectSubCategory === 'all'
        ? isLoadingAllCategories || isFetchingAllCategories
        : isLoadingProducts || isFetchingProducts;

    // Once a relevant fetch has started, we're no longer in switching limbo
    if (isFetchingRelevant) {
      setIsSwitching(false);
    }

    if (!isSwitching && !isFetchingRelevant && !isRefetchingCategory) {
      setProductsLoaded(true);
    } else {
      setProductsLoaded(false);
    }
  }, [
    isSwitching,
    selectSubCategory,
    isLoadingProducts,
    isLoadingAllCategories,
    isFetchingAllCategories,
    isRefetchingCategory,
    isFetchingProducts,
  ]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const paddingToBottom = 20;
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

      if (
        isCloseToBottom &&
        !isRefetchingProducts &&
        selectSubCategory !== 'all' &&
        products?.length > 0
      ) {
        setPage((prev) => prev + 1);
      }
    },
    [isRefetchingProducts, products?.length, selectSubCategory]
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);

    await refetchProducts();
    await refetchSubCategories();

    setRefreshing(false);
  }, [refetchSubCategories, refetchProducts]);

  return (
    <ThemedSafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#fff' }}>
      <YStack flex={1} backgroundColor="#fff">
        <YStack paddingHorizontal={16} paddingVertical={12}>
          <XStack alignItems="center">
            <Button
              width={40}
              height={40}
              borderRadius={8}
              backgroundColor="white"
              borderColor="#e0e0e0"
              borderWidth={1}
              pressStyle={{ opacity: 0.7 }}
              onPress={() => router.back()}>
              <ArrowLeft2 size={20} color="#000" />
            </Button>
            <Text fontSize={18} fontWeight="500" flex={1} textAlign="center">
              {category.name || categoryData?.name}
            </Text>
            <CartIcon />
          </XStack>
        </YStack>

        <LinearGradient
          colors={['#FFFFFF', '#F4F5F9']}
          start={{ x: 0.5, y: 0.1719 }}
          end={{ x: 0.5, y: 0.3125 }}
          style={styles.container}>
          <YStack>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}>
              <XStack gap={16}>
                {isLoadingSubCategories ? (
                  [...Array(5)].map((_, index) => (
                    <YStack key={`skeleton-${index}`} width={80}>
                      <YStack height={35} justifyContent="center" alignItems="center">
                        <View backgroundColor="#EEEEEE" width={70} height={16} borderRadius={8} />
                      </YStack>
                    </YStack>
                  ))
                ) : (
                  <>
                    {subCategories.length > 1 && (
                      <YStack
                        key="all"
                        borderBottomWidth={selectSubCategory === 'all' ? 3 : 0}
                        borderBottomColor="#000">
                        <Button
                          backgroundColor="transparent"
                          paddingHorizontal={0}
                          paddingVertical={8}
                          onPress={() => setSelectSubCategory('all')}
                          focusStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                          pressStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                          hoverStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}>
                          <Text
                            color={selectSubCategory === 'all' ? '#000' : '#6B6B6B'}
                            fontWeight="500"
                            fontSize={12}
                            numberOfLines={2}>
                            All
                          </Text>
                        </Button>
                      </YStack>
                    )}
                    {subCategories.map((tab) => (
                      <YStack
                        key={tab.id}
                        borderBottomWidth={selectSubCategory === tab.id ? 3 : 0}
                        borderBottomColor="#000">
                        <Button
                          backgroundColor="transparent"
                          paddingHorizontal={0}
                          paddingVertical={8}
                          onPress={() => setSelectSubCategory(tab.id)}
                          focusStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                          pressStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
                          hoverStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}>
                          <Text
                            color={selectSubCategory === tab.id ? '#000' : '#6B6B6B'}
                            fontWeight="500"
                            fontSize={12}
                            numberOfLines={2}>
                            {tab.name}
                          </Text>
                        </Button>
                      </YStack>
                    ))}
                  </>
                )}
              </XStack>
            </ScrollView>
            <Separator height={0.1} width="100%" mb={16} backgroundColor="#D8D5D5" />
          </YStack>

          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#000"
                colors={['#000']}
              />
            }>
            {productsLoaded && allProducts.length > 0 && (
              <XStack justifyContent="space-between" alignItems="center" mb={10}>
                <Text fontSize={18} fontWeight="600">
                  {selectedSubCategory?.name}
                </Text>
                <Button
                  backgroundColor="transparent"
                  alignItems="center"
                  gap={4}
                  onPress={handleSortButtonPress}>
                  <Text textDecorationLine="underline" fontSize={13} fontWeight="600" color="#000">
                    Sort by
                  </Text>
                </Button>
              </XStack>
            )}

            {!productsLoaded && allProducts.length === 0 ? (
              <XStack gap={12} flexWrap="wrap">
                {[...Array(4)].map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </XStack>
            ) : allProducts.length > 0 ? (
              <XStack gap={12} flexWrap="wrap">
                {allProducts.map((product) => (
                  <TouchableWithoutFeedback
                    key={product.id || product._id}
                    onPress={() => router.navigate(Routes.ProductDetails)}>
                    <ProductCard
                      product={{
                        ...product,
                        moq: product.content.minimum_quantity,
                        content: {
                          ...product.content,
                          unit_quantity: product.content.unit_quantity,
                        },
                      }}
                    />
                  </TouchableWithoutFeedback>
                ))}
              </XStack>
            ) : productsLoaded && allProducts.length === 0 ? (
              <YStack alignItems="center" justifyContent="center" height={400} gap={12}>
                <MaterialCommunityIcons name="circle-off-outline" size={80} color="#AAAAAA" />
                <Text color="#858585" fontSize={16} fontWeight="500" textAlign="center">
                  No products found
                </Text>
                <Text color="#AAAAAA" fontSize={14} textAlign="center" px={20}>
                  There are no products available in this category at the moment.
                </Text>
              </YStack>
            ) : null}

            {!productsLoaded && page > 1 && selectSubCategory !== 'all' && (
              <XStack gap={12} flexWrap="wrap" marginTop={10}>
                {[...Array(2)].map((_, index) => (
                  <ProductCardSkeleton key={`loading-${index}`} />
                ))}
              </XStack>
            )}
          </ScrollView>
        </LinearGradient>

        <SortOptionsBottomSheet
          bottomSheetModalRef={bottomSheetModalRef}
          selectedSortOption={selectedSortOption}
          onSortOptionSelect={handleSortOptionSelect}
        />
      </YStack>
    </ThemedSafeAreaView>
  );
}

export default ProductListingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 17, paddingVertical: 16 },
});
