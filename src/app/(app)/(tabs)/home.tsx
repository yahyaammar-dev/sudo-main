import { use$ } from '@legendapp/state/react';
import { useQueryClient } from '@tanstack/react-query';
import { catalogueKeyFactory } from 'api/catalogue/key-factory';
import { categoriesKeyFactory } from 'api/categories/key-factory';
import { useGetBanners } from 'api/queries';
import {
  BannerCards,
  ThemedSafeAreaView,
  ProductSearch,
  ShopByCategory,
  ShopByManufacturer,
} from 'components';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, NativeSyntheticEvent, NativeScrollEvent, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { YStack } from 'tamagui';

const HomeScreen = () => {

  const { data, isPending, isFetching, refetch } = useGetBanners();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const featuredProductsRef = useRef<any>(null);
  const queryClient = useQueryClient();

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (featuredProductsRef.current?.handleScroll) {
      featuredProductsRef.current.handleScroll(event);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      if (featuredProductsRef.current?.resetPage) {
        featuredProductsRef.current.resetPage();
      }

      await Promise.all([
        refetch(),
        queryClient.invalidateQueries({ queryKey: [categoriesKeyFactory.categories] }),
        queryClient.invalidateQueries({ queryKey: [catalogueKeyFactory.factories] }),
      ]);
    } catch (error) {
      console.error('Error refetching queries:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch, queryClient]);

  return (
    <ThemedSafeAreaView edges={['top']} style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        waitFor={[]} // Important: allows simultaneous gestures
      >
        <YStack px={16} py={20} gap={20}>
          <ProductSearch />
          <BannerCards
            enabled
            isPending={isPending}
            isFetching={isFetching}
            bannerData={data?.results}
          />
          <YStack gap={30}>
            <ShopByCategory enabled />
            <ShopByManufacturer />
          </YStack>
        </YStack>
      </ScrollView>
    </ThemedSafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1 },
});
