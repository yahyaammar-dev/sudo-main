import { Feather } from '@expo/vector-icons';
import { ThemedSafeAreaView } from 'components';
import {
  AddToCartButton,
  AddToCartSkeleton,
  ProductImageSkeleton,
  ProductInfoSkeleton,
  ProductSizes,
  ProductInfo,
  ProductImageCarousel,
  ProductSpecifications,
} from 'components/ui';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { withTimeout } from 'helpers';
import { useProductDetails, useTranslation } from 'hooks';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Routes } from 'routers';
import { Button, Dialog, Text, View, XStack, YStack } from 'tamagui';

function ProductDetails() {
  const { translations } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();

  const {
    isDescriptionExpanded,
    setIsDescriptionExpanded,
    selectedSizeIndex,
    setSelectedSizeIndex,
    product,
    isLoading,
    cartFactoryId,
    cartFactory,
    isProductValid,
    productPayload,
    addCartItem,
    isAddingToCart,
    isAddedToCart,
    resetAddToCartStatus,
    clearCart,
    isClearingCart,
    refetchCart,
    queryClient,
    quantity,
    setQuantity,
  } = useProductDetails();

  const hasFactoryConflict = useMemo(
    () => cartFactoryId && cartFactoryId !== product?.factory?.id,
    [cartFactoryId, product?.factory?.id]
  );

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const toggleDescription = useCallback(() => {
    setIsDescriptionExpanded((prev) => !prev);
  }, []);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const addToCart = useCallback(async () => {
    if (!isProductValid) {
      return;
    }

    if (isAddingToCart) return;

    try {
      if (hasFactoryConflict) {
        setIsDialogOpen(true);
        return;
      }

      await withTimeout(addCartItem(productPayload), 5000);
    } catch (error) {}
  }, [isProductValid, isAddingToCart, hasFactoryConflict, addCartItem, productPayload]);

  const handleClearCartAndAdd = useCallback(async () => {
    if (!isProductValid) {
      return;
    }

    try {
      setIsDialogOpen(false);

      await withTimeout(clearCart(), 8000);

      await withTimeout(addCartItem(productPayload), 5000);

      refetchCart().catch(console.error);
      queryClient.invalidateQueries({ queryKey: ['cart'] }).catch(console.error);
    } catch (error) {
      setIsDialogOpen(true);
    }
  }, [isProductValid, clearCart, addCartItem, productPayload, refetchCart, queryClient]);

  useEffect(() => {
    if (isAddedToCart) {
      resetAddToCartStatus();
      setQuantity(1);
      router.push(Routes.Cart);
    }
  }, [isAddedToCart, resetAddToCartStatus, router, setQuantity]);

  const effectiveMoq = useMemo(() => {
    if (product?.options && Object.values(product.options).length > 0) {
      const selectedOption = Object.values(product.options)[0]?.[selectedSizeIndex];
      return selectedOption?.minimum_quantity ?? selectedOption?.moq ?? 1;
    }
    return (
      product?.content?.moq ??
      product?.content?.minimumQuantity ??
      product?.content?.minimum_quantity ??
      product?.moq ??
      1
    );
  }, [product, selectedSizeIndex]);

  useEffect(() => {
    if (quantity < effectiveMoq || quantity % effectiveMoq !== 0) {
      setQuantity(effectiveMoq);
    }
  }, [effectiveMoq, quantity, setQuantity]);

  if (isLoading) {
    return (
      <ThemedSafeAreaView edges={['top']} style={styles.container}>
        <StatusBar style="dark" />
        <YStack flex={1} backgroundColor="#fff">
          <XStack alignItems="center" py={16} px={16} backgroundColor="#fff">
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <Feather name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
          </XStack>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: 220 }]}>
            <ProductImageSkeleton />
            <ProductInfoSkeleton />
          </ScrollView>
          <AddToCartSkeleton bottom={bottom} />
        </YStack>
      </ThemedSafeAreaView>
    );
  }

  if (!product && !isLoading) {
    return (
      <ThemedSafeAreaView edges={['top']} style={styles.container}>
        <StatusBar style="dark" />
        <YStack flex={1} backgroundColor="#fff" justifyContent="center" alignItems="center">
          <YStack alignItems="center" gap={16} px={32}>
            <Feather name="alert-circle" size={48} color="#ff6b6b" />
            <Text fontSize={18} fontWeight="600" textAlign="center">
              Product Not Found
            </Text>
            <Text fontSize={14} color="#666" textAlign="center">
              The product you're looking for doesn't exist or has been removed.
            </Text>
            <Button
              onPress={handleGoBack}
              bg="#108910"
              color="#fff"
              fontSize={14}
              fontWeight="600"
              borderRadius={8}
              px={24}
              py={12}>
              Go Back
            </Button>
          </YStack>
        </YStack>
      </ThemedSafeAreaView>
    );
  }

  return (
    <ThemedSafeAreaView edges={['top']} style={styles.container}>
      <StatusBar style="dark" />
      <YStack flex={1} backgroundColor="#fff">
        <Dialog open={isDialogOpen} modal>
          <Dialog.Portal>
            <Dialog.Overlay
              key="overlay"
              backgroundColor="$shadow6"
              animateOnly={['transform', 'opacity']}
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
            <View width="100%" padding={16}>
              <Dialog.Content
                bordered
                w="100%"
                elevate
                borderRadius={15}
                key="content"
                animateOnly={['transform', 'opacity']}
                enterStyle={{ x: 0, y: 20, opacity: 0 }}
                exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                gap="$4">
                <YStack gap={16} alignItems="center">
                  <YStack alignItems="center" gap={4}>
                    <Text fontSize={16} fontWeight="600" color="#262626">
                      {translations.startNewCart}
                    </Text>
                    <Text fontSize={12} fontWeight="500" color="#72767E">
                      {`${translations.startNewCartDescription} "${cartFactory?.name}"`}
                    </Text>
                  </YStack>
                  <XStack gap={16} px={14}>
                    <Button
                      h={40}
                      w="50%"
                      bg="transparent"
                      color="#000"
                      fontSize={12}
                      fontWeight="600"
                      br={28}
                      borderWidth={1}
                      borderColor="#E5E5E5"
                      focusStyle={{
                        b: 'transparent',
                      }}
                      outlineStyle="none"
                      onPress={handleDialogClose}>
                      {translations.cancel}
                    </Button>
                    <Button
                      h={40}
                      w="50%"
                      bg="#108910"
                      color="#fff"
                      fontSize={12}
                      fontWeight="600"
                      br={28}
                      borderWidth={1}
                      borderColor="#108910"
                      pressStyle={{ backgroundColor: '#0d7d0d' }}
                      onPress={handleClearCartAndAdd}>
                      {translations.start}
                    </Button>
                  </XStack>
                </YStack>
              </Dialog.Content>
            </View>
          </Dialog.Portal>
        </Dialog>

        <XStack alignItems="center" py={16} px={16} backgroundColor="#fff">
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Feather name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
        </XStack>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 220 }]}>
          {isLoading ? (
            <>
              <ProductImageSkeleton />
              <ProductInfoSkeleton />
            </>
          ) : (
            <>
              <ProductImageCarousel images={product?.images || []} />

              <YStack backgroundColor="#fff" px={16} gap={5}>
                {product && (
                  <ProductInfo
                    product={product}
                    selectedSizeIndex={selectedSizeIndex}
                    isDescriptionExpanded={isDescriptionExpanded}
                    toggleDescription={toggleDescription}
                  />
                )}
                {product?.options && Object.keys(product?.options).length > 0 ? (
                  Object.entries(product?.options).map(([key, value], index) => (
                    <ProductSizes
                      key={index}
                      title={key}
                      sizes={value || ([] as any[])}
                      selectedSizeIndex={selectedSizeIndex}
                      setSelectedSizeIndex={setSelectedSizeIndex}
                      currency={product?.currency || ''}
                    />
                  ))
                ) : (
                  <ProductSpecifications product_details={product?.product_details || {}} />
                )}
              </YStack>
            </>
          )}
        </ScrollView>

        {!isLoading ? (
          <AddToCartButton
            addToCart={addToCart}
            isLoading={isAddingToCart || isClearingCart}
            setQuantity={setQuantity}
            quantity={quantity}
            product={product}
            moq={effectiveMoq}
          />
        ) : (
          <AddToCartSkeleton bottom={bottom} />
        )}
      </YStack>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  scrollContent: {
    paddingBottom: 220,
  },
});

export default ProductDetails;
