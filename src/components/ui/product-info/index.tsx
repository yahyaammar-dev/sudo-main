import { use$ } from '@legendapp/state/react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { formatCurrency } from 'helpers';
import { useTranslation } from 'hooks';
import { Dimensions, TouchableOpacity } from 'react-native';
import { RenderHTML } from 'react-native-render-html';
import { Routes } from 'routers';
import { factoryStore } from 'store';
import { Text, View, XStack, YStack } from 'tamagui';
import { SwellSearchProduct } from 'types';

type ProductInfoProps = {
  product: SwellSearchProduct;
  selectedSizeIndex: number;
  isDescriptionExpanded: boolean;
  toggleDescription: () => void;
};

const ProductInfo = ({
  product,
  selectedSizeIndex,
  isDescriptionExpanded,
  toggleDescription,
}: ProductInfoProps) => {
  const { translations } = useTranslation();
  const { selectedFactory } = use$(factoryStore);
  const router = useRouter();

  const descriptionHtml = isDescriptionExpanded
    ? product?.description || ''
    : (product?.description || '').split(' ').slice(0, 200).join(' ') + '...';

  const handleFactoryPress = () => {
    router.push({
      pathname: Routes.Factory,
      params: { id: selectedFactory?.id },
    });
  };

  return (
    <YStack
      backgroundColor="#fff"
      py={26}
      gap={5}
      borderTopLeftRadius={10}
      borderTopRightRadius={10}>
      {Object.values(product.options)?.length > 0 && (
        <XStack gap={2} alignItems="center">
          {(product?.price || product?.content?.price) && (
            <View>
              {formatCurrency(
                product?.price ?? product?.content?.price ?? 0,
                product?.currency ?? 'USD',
                18
              )}
            </View>
          )}
          {product.content?.unitQuantity && (
            <Text color="#858585" fontSize={16}>
              {' / '}
              {product?.content?.unitQuantity ?? 0}
            </Text>
          )}
        </XStack>
      )}

      <Text fontSize={20} fontWeight="600" color="#000">
        {product?.name}
      </Text>

      {!Object.values(product.options)?.length && (
        <Text fontSize={12} color="#858585">
          {translations.moq}
          {' : '}
          {product.content?.moq ??
            product.content?.minimumQuantity ??
            product.content?.minimum_quantity ??
            product?.moq ??
            0}{' '}
          {translations.packs}
        </Text>
      )}

      <XStack alignItems="center">
        <Text fontSize={12} color="#525252" fontWeight="700">
          {translations.soldBy}
          {' : '}
        </Text>
        <TouchableOpacity onPress={handleFactoryPress}>
          <XStack alignItems="center" gap={6}>
            {product?.factory?.content?.store_front_logo?.url && (
              <Image
                source={{
                  uri: product?.factory?.content?.store_front_logo?.url,
                }}
                style={{
                  width: 27,
                  height: 27,
                  borderRadius: 100,
                  borderWidth: 0.5,
                  borderColor: '#C5C5C5',
                }}
                contentFit="contain"
              />
            )}
            <Text fontSize={12} color="#525252" fontWeight="400">
              {product?.factory?.content?.factory_name || translations.unknown}
            </Text>
          </XStack>
        </TouchableOpacity>
      </XStack>

      <YStack>
        <View>
          <RenderHTML
            contentWidth={Dimensions.get('window').width - 32}
            source={{ html: `<div>${descriptionHtml}</div>` }}
            baseStyle={{ fontSize: 12, color: '#868889' }}
          />
          {(isDescriptionExpanded ||
            (product?.description && product?.description.length > 50)) && (
            <TouchableOpacity onPress={toggleDescription}>
              <Text color="#000" fontSize={12} fontWeight="600">
                {isDescriptionExpanded ? translations.showLess : `... ${translations.showMore}`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </YStack>
    </YStack>
  );
};

export default ProductInfo;
