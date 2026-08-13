import { Image } from 'expo-image';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_SCALE = 4;

const AnimatedImage = Animated.createAnimatedComponent(Image);

type ZoomableImageProps = {
  uri: string;
  active: boolean;
  onZoomChange?: (zoomed: boolean) => void;
};

const ZoomableImage = ({ uri, active, onZoomChange }: ZoomableImageProps) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const clampTranslation = useCallback((value: number, scaleValue: number, dimension: number) => {
    'worklet';
    const maxTranslate = (dimension * (scaleValue - 1)) / 2;
    return Math.min(Math.max(value, -maxTranslate), maxTranslate);
  }, []);

  const resetZoom = useCallback(() => {
    'worklet';
    scale.value = 1;
    savedScale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  }, []);

  const setZoomedState = useCallback(
    (value: boolean) => {
      setIsZoomed(value);
      onZoomChange?.(value);
    },
    [onZoomChange]
  );

  useEffect(() => {
    if (!active && isZoomed) {
      resetZoom();
      setZoomedState(false);
    }
  }, [active]);

  const pinchGesture = Gesture.Pinch()
    .enabled(active)
    .onUpdate((event) => {
      scale.value = Math.min(Math.max(savedScale.value * event.scale, 1), MAX_SCALE);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      if (scale.value <= 1) {
        resetZoom();
        runOnJS(setZoomedState)(false);
      } else {
        runOnJS(setZoomedState)(true);
      }
    });

  const panGesture = Gesture.Pan()
    .enabled(active && isZoomed)
    .onUpdate((event) => {
      translateX.value = clampTranslation(
        savedTranslateX.value + event.translationX,
        scale.value,
        SCREEN_WIDTH
      );
      translateY.value = clampTranslation(
        savedTranslateY.value + event.translationY,
        scale.value,
        SCREEN_HEIGHT
      );
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTapGesture = Gesture.Tap()
    .enabled(active)
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        resetZoom();
        runOnJS(setZoomedState)(false);
      } else {
        scale.value = 2;
        savedScale.value = 2;
        runOnJS(setZoomedState)(true);
      }
    });

  const composedGesture = Gesture.Race(doubleTapGesture, Gesture.Simultaneous(pinchGesture, panGesture));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={styles.page}>
        <AnimatedImage
          source={{ uri }}
          style={[styles.image, animatedStyle]}
          contentFit="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  page: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});

export default ZoomableImage;
