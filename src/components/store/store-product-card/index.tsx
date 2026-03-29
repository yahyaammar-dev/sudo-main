import { Image } from 'expo-image';
import { router } from 'expo-router';
import { formatCurrency } from 'helpers';
import { Routes } from 'routers';
import { Text, View, XStack, YStack, Card } from 'tamagui';
import { SwellProduct } from 'types';

function ProductCard({ product, width }: { product: SwellProduct; width: string }) {
  return (
    <Card
      onPress={() => {
        router.push({
          pathname: Routes.ProductDetails,
          params: { id: product.id },
        });
      }}
      backgroundColor="white"
      borderRadius={0}
      // padding={12}
      width={width}>
      <XStack>
        {product.content.is_new && (
          <View
            backgroundColor="#FDEFD5"
            paddingHorizontal={8}
            paddingVertical={4}
            position="absolute"
            top={0}
            left={0}
            zIndex={2}>
            <Text fontSize={10} color="#E8AD41" fontWeight="500">
              NEW
            </Text>
          </View>
        )}
      </XStack>

      <View height={124} width="100%">
        {product?.images?.[0]?.file?.url ? (
          <Image
            source={{
              uri: product.images[0].file.url,
            }}
            style={{ width: '100%', height: '100%' }}
            contentFit="contain"
          />
        ) : (
          <View
            width={100}
            height={100}
            alignItems="center"
            justifyContent="center"
            backgroundColor="transparent"
            borderRadius={8}>
            <Text fontSize={50} color="#aaa">
              📦
            </Text>
          </View>
        )}
      </View>

      <YStack padding={5} marginTop={2} gap={4}>
        <Text fontSize={12} fontWeight="600" numberOfLines={2}>
          {product.name}
        </Text>
        <XStack alignItems="center" gap={4}>
          <Text fontSize={12} fontWeight="500" color="#6CC51D">
            {formatCurrency(product.price, product.currency ?? 'USD')}
          </Text>
          <Text fontSize={10} color="#858585">
            /{product.content.unit_quantity}
          </Text>
        </XStack>
        <Text fontSize={10} fontWeight="700" color="#858585">
          MOQ:
          <Text fontSize={10} fontWeight="400" color="#858585">
            {' '}
            {product?.content?.minimum_quantity} Packs
          </Text>
        </Text>
      </YStack>
    </Card>
  );
}

export default ProductCard;
