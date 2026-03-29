import { Image } from 'expo-image';
import { useState, useRef, useCallback, useMemo } from 'react';
import { Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { View } from 'tamagui';

import { styles } from './styles';

const { width } = Dimensions.get('window');

type ProductImageCarouselProps = {
  images: string[];
  loop?: boolean;
};

const ProductImageCarousel = ({ images, loop = false }: ProductImageCarouselProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [, setCurrentIndex] = useState(0);

  // For infinite loop, we duplicate images: [last, ...original, first]
  const displayImages = useMemo(() => {
    if (!loop || images.length <= 1) {
      return images;
    }
    return [images[images.length - 1], ...images, images[0]];
  }, [images, loop]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollPosition / width);

      if (loop && images.length > 1) {
        // Adjust index for looped images (offset by 1 because we prepended last image)
        const actualIndex = index - 1;

        if (actualIndex >= 0 && actualIndex < images.length) {
          setCurrentIndex(actualIndex);
        }
      } else {
        setCurrentIndex(index);
      }
    },
    [loop, images.length]
  );

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!loop || images.length <= 1) return;

      const scrollPosition = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollPosition / width);

      // If we're at the cloned first image (end of scroll), jump to real first
      if (index === displayImages.length - 1) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            x: width, // Jump to first real image
            animated: false,
          });
        }, 50);
      }
      // If we're at the cloned last image (start of scroll), jump to real last
      else if (index === 0) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            x: width * images.length, // Jump to last real image
            animated: false,
          });
        }, 50);
      }
    },
    [loop, images.length, displayImages.length]
  );


  // Set initial scroll position for looped carousel
  const handleLayout = useCallback(() => {
    if (loop && images.length > 1) {
      // Start at the first real image (index 1 in displayImages)
      scrollViewRef.current?.scrollTo({
        x: width,
        animated: false,
      });
    }
  }, [loop, images.length]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <View style={styles.imageContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onLayout={handleLayout}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={width}
        snapToAlignment="start"
        scrollEnabled={images.length > 1}
        style={styles.scrollView}>
        {displayImages.map((imageUrl, index) => (
          <View key={`${imageUrl}-${index}`} style={styles.carouselItem}>
            <Image source={{ uri: imageUrl }} style={styles.productImage} contentFit="contain" />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ProductImageCarousel;
