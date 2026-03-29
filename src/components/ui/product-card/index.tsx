import { use$ } from '@legendapp/state/react';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { formatCurrency } from 'helpers';
import { useTranslation } from 'hooks';
import { Whatsapp } from 'iconsax-react-nativejs';
import { Alert, Linking } from 'react-native';
import { Routes } from 'routers';
import { factoryStore, userStore } from 'store';
import { Card, Text, View, XStack, YStack } from 'tamagui';
import { SwellProduct, SwellSearchProduct } from 'types';

const ProductCard = <
  T extends (SwellProduct & { moq: number }) | (SwellSearchProduct & { moq: number }),
>({
  product,
}: {
  product: T;
}) => {
  const { translations } = useTranslation();
  const { account } = use$(userStore);
  const { setSelectedFactory } = use$(factoryStore);
  const getFactoryName = (): string => {
    const name = product?.content?.factory?.name;
    if (name && name.length > 0) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    const factoryName = product?.content?.factory?.factory_name;
    if (factoryName && factoryName.length > 0) {
      return factoryName.charAt(0).toUpperCase() + factoryName.slice(1);
    }
    return '';
  };

  return (
    <Card
      onPress={() => {
        setSelectedFactory(product?.content?.factory);
        router.push({
          pathname: Routes.ProductDetails,
          params: {
            id: product.id,
          },
        });
      }}
      backgroundColor="#fff"
      width="48%"
      marginBottom={5}
      borderRadius={0}>
      <YStack gap={6}>
        <View height={120} position="relative">
          {product.images ? (
            <Image
              source={{
                uri:
                  typeof product.images[0] === 'string'
                    ? product.images[0]
                    : product.images[0]?.file?.url,
              }}
              style={{ width: '100%', height: 120 }}
              contentFit="contain"
            />
          ) : (
            <View
              width={120}
              height={120}
              backgroundColor="#F5F5F5"
              alignItems="center"
              justifyContent="center"
              alignSelf="center">
              <Text color="#B0B0B0" fontSize={14} fontWeight="500">
                No Image
              </Text>
            </View>
          )}

          {product.content.is_new && (
            <View backgroundColor="#FDEFD5" px={8} py={2} position="absolute" top={0} left={0}>
              <Text color="#E8AD41" fontWeight="500" fontSize={10}>
                NEW
              </Text>
            </View>
          )}
        </View>

        <YStack gap={5} padding={5}>
          <Text fontWeight="600" fontSize={15} numberOfLines={2}>
            {product.name}
          </Text>

          {typeof product.price === 'number' && (
            <XStack alignItems={account?.isVerified ? 'baseline' : 'center'} gap={2}>
              <Text color="#6CC51D" fontWeight="500" fontSize={12}>
                {formatCurrency(product.price, product.currency ?? 'USD')}
              </Text>
              <Text fontSize={10} color="#858585">
                /{product.content.unit_quantity}
              </Text>
            </XStack>
          )}
          <Text fontSize={10} color="#858585">
            <Text fontWeight="700" color="#858585">
              {translations.moq} :{' '}
            </Text>
            {product.moq} {translations.packs}
          </Text>
        </YStack>
        {getFactoryName() && account?.isVerified ? (
          <Text
            borderTopWidth={1}
            borderTopColor="#EBEBEB"
            fontSize={10}
            color="#858585"
            px={10}
            py={10}>
            <Text fontWeight="700" color="#858585">
              {translations.soldBy} :{' '}
            </Text>
            {getFactoryName()}
          </Text>
        ) : (
          <XStack
            onPress={() =>
              Linking.openURL(
                `whatsapp://send?phone=+15557796106&text= I want to buy this product: ${product.name} - ${product.id}`
              ).catch((_) => {
                Alert.alert('WhatsApp not installed');
              })
            }
            alignItems="center"
            gap={4}
            borderTopWidth={1}
            padding={10}
            borderTopColor="#EBEBEB">
            <Text fontSize={14} fontWeight="700" color="#6CC51D">
              {translations.getQuote}
            </Text>
            <Whatsapp size={18} strokeWidth={2} color="#6CC51D" />
          </XStack>
        )}
      </YStack>
    </Card>
  );
};

export default ProductCard;
