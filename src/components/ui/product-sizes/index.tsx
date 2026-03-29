import { formatCurrency } from 'helpers/currencyFormatter';
import { useTranslation } from 'hooks';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Text, View, YStack } from 'tamagui';

import { styles } from './styles';
import ProductSpecifications from '../product-specifications';

type ProductSizesProps = {
  title: string;
  sizes: any[];
  selectedSizeIndex: number;
  setSelectedSizeIndex: (index: number) => void;
  currency: string;
};

const ProductSizes = ({
  sizes,
  selectedSizeIndex,
  setSelectedSizeIndex,
  currency,
  title,
}: ProductSizesProps) => {
  const { translations } = useTranslation();
  return (
    <YStack mt={16} mb={12} gap={10}>
      <Text fontSize={15} fontWeight="600" color="#000">
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 5 }}>
        {sizes.map((cardData, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={() => {
              setSelectedSizeIndex(index);
            }}>
            <YStack
              backgroundColor="#fff"
              borderRadius={16}
              borderWidth={1}
              borderColor={selectedSizeIndex === index ? '#000' : '#ebebeb'}
              p={10}
              gap={4}
              style={[
                styles.orderInfoCard,
                selectedSizeIndex === index && {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 2,
                },
              ]}>
              <View
                style={[
                  styles.dotIndicatorContainer,
                  {
                    borderColor: selectedSizeIndex === index ? '#000' : '#ebebeb',
                  },
                ]}>
                <View
                  style={[
                    styles.dotIndicator,
                    {
                      backgroundColor: selectedSizeIndex === index ? '#000' : '#fff',
                    },
                  ]}
                />
              </View>
              <YStack>
                <Text fontSize={12} color="#000" fontWeight="500">
                  {cardData.name}
                </Text>
                <Text fontSize={10} color="#858585" fontWeight="300">
                  {translations.moq}: {cardData.minimum_quantity ?? cardData.moq ?? 0}{' '}
                  {translations.packs}
                </Text>
                <Text fontSize={10} color="#858585" fontWeight="300">
                  {translations.leadTime}:{' '}
                  {cardData.lead_time?.[0].min_days ??
                    cardData?.product_details?.['Lead Time Min Days'] ??
                    0}{' '}
                  -{' '}
                  {cardData?.lead_time?.[0].max_days ??
                    cardData?.product_details?.['Lead Time Max Days'] ??
                    0}{' '}
                  {translations.days}
                </Text>

                <Text fontSize={10} color="#858585" fontWeight="300" />
                <Text fontSize={13} color="#28B446" fontWeight="600" mt={4}>
                  {formatCurrency(cardData.price, currency ?? 'USD')}
                </Text>
              </YStack>
            </YStack>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {sizes[selectedSizeIndex]?.product_details &&
        Object.keys(sizes[selectedSizeIndex]?.product_details).length > 0 && (
          <ProductSpecifications
            product_details={sizes[selectedSizeIndex]?.product_details || {}}
          />
        )}
    </YStack>
  );
};

export default ProductSizes;
