import { BannerSkeleton } from 'components/ui';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo, useRef, useCallback, useState } from 'react';
import {
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Routes } from 'routers';
import { View, XStack } from 'tamagui';

import { styles } from './styles';
const { width } = Dimensions.get('window');

type BannerItem = {
  content?: {
    dataId: string;
    linkType: 'product' | 'category' | 'factory';
    image?: {
      id?: string;
      url?: string;
    };
  };
};

type BannerCardsProps = {
  isPending: boolean;
  isFetching: boolean;
  bannerData?: BannerItem[];
  enabled: boolean;
};

const BannerCards = memo(({ isPending, isFetching, bannerData, enabled }: BannerCardsProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePress = useCallback((item: BannerItem) => {
    switch (item.content?.linkType) {
      case 'product':
        router.push({
          pathname: Routes.ProductDetails,
          params: {
            id: item.content?.dataId as string,
          },
        });
        break;
      case 'category':
        router.push({
          pathname: Routes.ProductListing,
          params: {
            id: item.content?.dataId as string,
          },
        });
        break;
      case 'factory':
        router.push({
          pathname: Routes.Factory,
          params: {
            id: item.content?.dataId as string,
          },
        });
        break;
      default:
        break;
    }
  }, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (width - 32));
    setCurrentIndex(index);
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * (width - 32),
      animated: true,
    });
  }, []);

  if (isPending || isFetching) {
    return <BannerSkeleton />;
  }

  if (!bannerData?.length) {
    return null;
  }

  return (
    <View gap={10}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={width - 32}
        snapToAlignment="start"
        contentContainerStyle={styles.scrollContainer}
        scrollEnabled={enabled && bannerData.length > 1}
        style={styles.container}>
        {bannerData.map((item, index) => (
          <TouchableWithoutFeedback key={index} onPress={() => handlePress(item)}>
            <Image
              source={{ uri: item?.content?.image?.url }}
              style={styles.child}
              contentFit="fill"
            />
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>

      {bannerData.length > 1 && (
        <XStack gap={6} justifyContent="center" alignItems="center">
          {bannerData.map((_, index) => (
            <TouchableWithoutFeedback key={index} onPress={() => scrollToIndex(index)}>
              <View style={[styles.dotStyle, currentIndex === index && styles.activeDotStyle]} />
            </TouchableWithoutFeedback>
          ))}
        </XStack>
      )}
    </View>
  );
});

BannerCards.displayName = 'BannerCards';

export default BannerCards;
