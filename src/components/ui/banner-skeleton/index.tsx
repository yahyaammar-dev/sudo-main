import React from 'react';
import { Dimensions } from 'react-native';
import { View } from 'tamagui';

import Skeleton from '../skeleton';

const { width } = Dimensions.get('window');

const BannerSkeleton = () => {
  return (
    <View gap={10}>
      <Skeleton width={width - 32} height={170} borderRadius={10} />

      <View flexDirection="row" justifyContent="center" gap={6} paddingHorizontal={16}>
        {[1, 2, 3, 4].map((index) => (
          <Skeleton key={index} width={6} height={6} borderRadius={10} />
        ))}
      </View>
    </View>
  );
};

export default BannerSkeleton;
