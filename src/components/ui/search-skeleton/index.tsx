import { YStack } from 'tamagui';

import Skeleton from '../skeleton';

function SearchSkeleton() {
  return (
    <YStack gap={12} paddingVertical={4}>
      <Skeleton width="90%" height={17} />
      <Skeleton width="70%" height={17} />
      <Skeleton width="80%" height={17} />
      <Skeleton width="65%" height={17} />
    </YStack>
  );
}

export default SearchSkeleton;
