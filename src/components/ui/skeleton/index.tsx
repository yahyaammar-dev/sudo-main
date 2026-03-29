import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { styles } from './styles';

type SkeletonProps = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
};

function Skeleton({ width = '100%', height = 20, borderRadius = 4 }: SkeletonProps) {
  const opacity = useSharedValue(0.3);
  const screenWidth = Dimensions.get('window').width;

  const getWidth = (): number => {
    if (typeof width === 'string' && width.endsWith('%')) {
      const percentage = parseFloat(width) / 100;
      return screenWidth * percentage;
    }
    return Number(width);
  };

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.6, { duration: 1000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[styles.skeleton, { width: getWidth(), height, borderRadius }, animatedStyle]}
    />
  );
}

export default Skeleton;
