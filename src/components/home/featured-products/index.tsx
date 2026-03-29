import { use$ } from '@legendapp/state/react';
import { ProductCardSkeleton } from 'components/ui';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { formatCurrency } from 'helpers';
import { useTranslation } from 'hooks';
import { ArrowRight2 } from 'iconsax-react-nativejs';
import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  Dispatch,
  SetStateAction,
} from 'react';
import { TouchableWithoutFeedback, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Routes } from 'routers';
import { factoryStore } from 'store';
import { Card, Text, View, XStack, YStack } from 'tamagui';
import { SwellProduct } from 'types';

const ProductCard = ({ product }: { product: SwellProduct }) => {
  const { setSelectedFactory } = use$(factoryStore);
  const { translations } = useTranslation();
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setSelectedFactory(product.content.factory);
        router.push({
          pathname: Routes.ProductDetails,
          params: { id: product.id },
        });
      }}>
      <Card backgroundColor="#fff" width="48%" marginBottom={5} borderRadius={0}>
        <YStack gap={6}>
          <View height={120} position="relative">
            {product?.images?.[0]?.file?.url ? (
              <Image
                source={{ uri: product.images[0].file.url }}
                style={{ width: '100%', height: 120 }}
                contentFit="cover"
              />
            ) : null}

            {product.content?.is_new && (
              <View backgroundColor="#FDEFD5" px={8} py={2} position="absolute" top={0} left={0}>
                <Text color="#E8AD41" fontWeight="500" fontSize={10}>
                  NEW
                </Text>
              </View>
            )}
          </View>

          <YStack padding={5}>
            <Text fontWeight="600" fontSize={15} numberOfLines={2}>
              {product?.name}
            </Text>
            <XStack alignItems="baseline" gap={2}>
              <Text color="#6CC51D" fontWeight="500" fontSize={12}>
                {formatCurrency(product.price, product.currency ?? 'USD')}
              </Text>
              <Text fontSize={10} color="#858585">
                /{product?.content?.unit_quantity}
              </Text>
            </XStack>

            <Text fontSize={10} color="#858585">
              <Text fontWeight="700" color="#858585">
                {translations.moq} :
              </Text>
              {product?.content?.minimum_quantity} {translations.packs}
            </Text>
          </YStack>
          <Text
            borderTopWidth={1}
            borderTopColor="#EBEBEB"
            fontSize={10}
            color="#858585"
            px={10}
            py={10}>
            <Text fontWeight="700" color="#858585">
              {translations.soldBy} :
            </Text>
            {product?.content?.factory?.name}
          </Text>
        </YStack>
      </Card>
    </TouchableWithoutFeedback>
  );
};

const FeaturedProducts = forwardRef<
  any,
  {
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    isPending: boolean;
    isFetching: boolean;
    error: Error | null;
    products: SwellProduct[];
  }
>(({ page, setPage, isPending, isFetching, error, products }, ref) => {
  const { translations } = useTranslation();
  const [allProducts, setAllProducts] = useState<SwellProduct[]>([]);

  useEffect(() => {
    if (products?.length) {
      if (page === 1) {
        setAllProducts(products);
      } else {
        setAllProducts((prev) => [...prev, ...products]);
      }
    }
  }, [products, page]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const paddingToBottom = 100;
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

      if (isCloseToBottom && !isPending && products?.length === 8) {
        setPage((prev) => prev + 1);
      }
    },
    [isPending, products?.length]
  );

  useImperativeHandle(
    ref,
    () => ({
      handleScroll,
      resetPage: () => setPage(1),
    }),
    [handleScroll]
  );
  return (
    <YStack gap={20}>
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={18} fontWeight="600" color="#000">
          {translations.featuredProducts}
        </Text>
        <ArrowRight2 size={20} color="#000" />
      </XStack>

      <XStack gap={12} flexWrap="wrap">
        {allProducts.map((product, Index) => (
          <ProductCard key={Index} product={product} />
        ))}

        {isFetching &&
          page > 1 &&
          [...Array(8)].map((_, index) => <ProductCardSkeleton key={`loading-${index}`} />)}
      </XStack>

      {(isPending || isFetching) && page === 1 && (
        <XStack gap={12} flexWrap="wrap">
          {[...Array(8)].map((_, index) => (
            <ProductCardSkeleton key={`initial-loading-${index}`} />
          ))}
        </XStack>
      )}

      {error && (
        <YStack alignItems="center" justifyContent="center" height={200}>
          <Text color="#858585" fontSize={16} fontWeight="500" textAlign="center">
            {translations.errorLoadingFeaturedProducts}
          </Text>
        </YStack>
      )}
    </YStack>
  );
});

FeaturedProducts.displayName = 'FeaturedProducts';

export default FeaturedProducts;
