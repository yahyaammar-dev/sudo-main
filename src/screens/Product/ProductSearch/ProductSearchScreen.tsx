import { useSearchProducts } from 'api/catalogue';
import { ProductCard, ProductSearchSkeleton, ThemedSafeAreaView } from 'components';
import { CartIcon } from 'components/cart';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'hooks';
import { ArrowLeft2 } from 'iconsax-react-nativejs';
import { useState } from 'react';
import { ScrollView, TextInput } from 'react-native';
import { Button, Text, View, XStack, YStack } from 'tamagui';

import { styles } from './styles';
import { SearchIcon } from '../../../../assets/icons';

function ProductSearchScreen() {
  const { search_text } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState(search_text as string);
  const { data: searchResults, isLoading } = useSearchProducts({ search: search_text as string });
  const { translations } = useTranslation();

  return (
    <ThemedSafeAreaView edges={['top']} style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F4F5F9']}
        locations={[0.0481, 0.2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}>
        <YStack px={16} gap={40} flex={1}>
          <XStack py={20} gap={14} alignItems="center">
            <XStack gap={20} flex={1} alignItems="center">
              <Button
                borderRadius={8}
                backgroundColor="white"
                borderColor="#e0e0e0"
                borderWidth={1}
                padding={8}
                width={40}
                height={40}
                pressStyle={{ opacity: 0.7 }}
                onPress={() => router.back()}>
                <ArrowLeft2 size={20} color="#000" />
              </Button>
              <XStack
                backgroundColor="#F5F5F7"
                borderRadius={10}
                alignItems="center"
                height={40}
                px={20}
                flex={1}
                gap="$1.5">
                <SearchIcon size={20} color="#868889" />
                <TextInput
                  placeholderTextColor="#868889"
                  style={styles.input}
                  placeholder="Search keywords.."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </XStack>
            </XStack>
            <CartIcon />
          </XStack>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 26 }}
            bounces={false}>
            {isLoading ? (
              <ProductSearchSkeleton />
            ) : (
              searchResults?.groupedByFactory.map((group, index) => (
                <YStack key={index} gap={11}>
                  <XStack gap={8} alignItems="center">
                    <View
                      overflow="hidden"
                      borderColor="#E5E5E5"
                      borderWidth={1}
                      br={8}
                      width={59}
                      height={59}>
                      {group.factory.content.store_front_logo?.url && (
                        <Image
                          source={{
                            uri: group.factory.content.store_front_logo?.url,
                          }}
                          style={{ width: 59, height: 59, borderRadius: 8 }}
                          contentFit="contain"
                        />
                      )}
                    </View>
                    <YStack gap={7}>
                      <Text fontSize={15} fontWeight="600">
                        {group.factory.content.factory_name}
                      </Text>
                      {group.factory.content.lead_time[0] && (
                        <YStack gap={2}>
                          <Text fontSize={10} color="#6B6B6B">
                            {translations.leadTime}
                          </Text>
                          <Text fontSize={12} fontWeight="500" color="#000">
                            {group.factory.content.lead_time[0].min_days} -{' '}
                            {group.factory.content.lead_time[0].max_days} Days
                          </Text>
                        </YStack>
                      )}
                    </YStack>
                  </XStack>
                  <XStack gap={10} flexWrap="wrap">
                    {group.products.map((product, index) => (
                      <ProductCard
                        key={index}
                        product={{
                          ...product,
                          content: {
                            ...product.content,
                            factory: group.factory,
                          },
                        }}
                      />
                    ))}
                  </XStack>
                </YStack>
              ))
            )}
          </ScrollView>
        </YStack>
      </LinearGradient>
    </ThemedSafeAreaView>
  );
}

export default ProductSearchScreen;
