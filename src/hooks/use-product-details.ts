import { use$ } from '@legendapp/state/react';
import { useQueryClient } from '@tanstack/react-query';
import { useAddCartItem, useClearCart, useGetCart } from 'api/cart';
import { useGetFactories, useGetProductDetails } from 'api/catalogue';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { userStore } from 'store';
import { CartItem } from 'swell-js';

export const useProductDetails = () => {
  const { id: productId } = useLocalSearchParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const { account } = use$(userStore);
  const queryClient = useQueryClient();

  const { data: factories } = useGetFactories();
  const {
    data: product,
    isLoading,
    refetch: refetchProduct,
  } = useGetProductDetails(productId, account?.id as string);

  const { data: cartData, refetch: refetchCart } = useGetCart();

  const {
    mutateAsync: addCartItem,
    isPending: isAddingToCart,
    isSuccess: isAddedToCart,
    reset: resetAddToCartStatus,
  } = useAddCartItem({});

  const { mutateAsync: clearCart, isPending: isClearingCart } = useClearCart();

  const cartFactoryId = useMemo(
    () => cartData?.items?.[0]?.product?.content?.factoryId as string,
    [cartData?.items]
  );

  const cartFactory = useMemo(
    () => factories?.find((factory) => factory.id === cartFactoryId),
    [factories, cartFactoryId]
  );

  const isProductValid = useMemo(() => product?.id, [product]);

  const productPayload: Partial<CartItem> = useMemo(
    () => ({
      product_id: product?.id,
      options: [
        ...Object.entries(product?.options || {}).map(([key, value]) => ({
          id: key,
          value: value[selectedSizeIndex]?.name || '',
        })),
      ],
      quantity,
    }),
    [product?.id, product?.options, selectedSizeIndex, quantity]
  );

  return {
    isDescriptionExpanded,
    setIsDescriptionExpanded,
    selectedSizeIndex,
    setSelectedSizeIndex,

    product,
    cartData,
    isLoading,

    cartFactory,
    cartFactoryId,
    isProductValid,
    productPayload,
    quantity,
    setQuantity,

    addCartItem,
    isAddingToCart,
    isAddedToCart,
    resetAddToCartStatus,
    clearCart,
    isClearingCart,

    refetchProduct,
    refetchCart,
    queryClient,
  };
};
