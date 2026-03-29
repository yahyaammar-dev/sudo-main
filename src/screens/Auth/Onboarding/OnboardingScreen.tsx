import { use$ } from '@legendapp/state/react';
import { OnboardingSlide, OnboardingSlideProps, ThemedSafeAreaView } from 'components';
import { router } from 'expo-router';
import { useTranslation } from 'hooks';
import { useRef, useState } from 'react';
import { useWindowDimensions, FlatList, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Routes } from 'routers';
import { userStore } from 'store';
import { Button, ButtonText, View, XStack, YStack } from 'tamagui';

import onboarding1 from '../../../../assets/onboarding-1.png';
import onboarding2 from '../../../../assets/onboarding-2.png';
import onboarding3 from '../../../../assets/onboarding-3.png';
import onboarding4 from '../../../../assets/onboarding-4.png';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Helper function to render text with line breaks
const renderTextWithLineBreaks = (text: string, style: any) => {
  const lines = text.split('\n');
  return lines.map((line, index) => (
    <Text key={index} style={style}>
      {line}
    </Text>
  ));
};

function OnboardingScreen() {
  const user = use$(userStore);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { translations } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef<FlatList<OnboardingSlideProps>>(null);
  const scrollX = useSharedValue(0);

  const localizedSlides = [
    {
      id: '1',
      image: onboarding1,
      title: translations.welcomeToSodu,
      subtitle: translations.trustedPlatform,
    },
    {
      id: '2',
      image: onboarding2,
      title: translations.vettedProducts,
      subtitle: translations.trustedFactories,
    },
    {
      id: '3',
      image: onboarding3,
      title: translations.inspectedGuaranteed,
      subtitle: translations.expertsInspection,
    },
    {
      id: '4',
      image: onboarding4,
      title: translations.fasterLogistics,
      subtitle: translations.simplifiedLogistics,
    },
  ];

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 10 }).current;

  const handleNext = () => {
    if (currentIndex < localizedSlides.length - 1) {
      try {
        slideRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      } catch (e) {
        console.warn('scrollToIndex failed', e);
      }
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = () => {
    user.setIsOnboardingComplete(true);
    router.navigate(Routes.Login);
  };

  const maskStyle = useAnimatedStyle(() => {
    return {
      borderTopLeftRadius: width,
      borderTopRightRadius: width,
      width: width * 2,
      height: height * 0.48,
      alignSelf: 'center',
      position: 'absolute',
      bottom: insets.bottom,
      overflow: 'hidden',
      backgroundColor: '#fff',
    };
  });

  return (
    <ThemedSafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: '#fff' }}>
      <View flex={1} bg="#fff">
        <FlatList
          data={localizedSlides}
          renderItem={({ item }) => <OnboardingSlide item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onScroll={(event) => {
            scrollX.value = event.nativeEvent.contentOffset.x;
          }}
          scrollEventThrottle={16}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slideRef}
        />

        <Animated.View style={maskStyle} pointerEvents="box-none">
          <View style={{ flex: 1 }}>
            <YStack pt={65} pb={53} px={20} justifyContent="space-between" flex={1}>
              <YStack gap={11} height={200}>
                {renderTextWithLineBreaks(localizedSlides[currentIndex].title, styles.title)}
                {renderTextWithLineBreaks(localizedSlides[currentIndex].subtitle, styles.subtitle)}
              </YStack>

              <YStack gap={29} alignItems="center">
                <XStack gap={4} justifyContent="center" alignItems="center" height={20}>
                  {localizedSlides.map((_, index) => (
                    <View
                      key={index}
                      width={8}
                      height={8}
                      borderRadius={4}
                      style={{
                        backgroundColor: index === currentIndex ? '#108910' : '#DCDCDC',
                      }}
                    />
                  ))}
                </XStack>

                <Button
                  bg="#108910"
                  width={width - 50}
                  height={54}
                  borderRadius={30}
                  justifyContent="center"
                  alignItems="center"
                  onPress={handleNext}>
                  <ButtonText color="#fff" fontWeight={600} size={17}>
                    {translations.getStarted}
                  </ButtonText>
                </Button>
              </YStack>
            </YStack>
          </View>
        </Animated.View>
      </View>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
    fontSize: 28,
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 47,
  },
});

export default OnboardingScreen;
