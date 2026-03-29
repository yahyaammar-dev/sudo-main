import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Text, View, YStack } from 'tamagui';
import { Category } from 'types';

import { styles } from './styles';

type CategoryItemProps = {
  category: Category;
  navigateToProductDetails: () => void;
};
export default function CategoryItem({ category, navigateToProductDetails }: CategoryItemProps) {
  return (
    <TouchableOpacity
      key={category.id}
      style={styles.gridItem}
      onPress={() => {
        if (category.id === '2') {
          navigateToProductDetails();
        } else {
          navigateToProductDetails();
        }
      }}>
      <YStack alignItems="center" gap={8}>
        <View
          width={64}
          height={64}
          borderRadius={32}
          backgroundColor="#F6F7F8"
          justifyContent="center"
          alignItems="center">
          <Feather name={category.icon} size={24} color="#000" />
        </View>
        <Text fontSize={10} fontWeight="500" textAlign="center" color="#868889">
          {category.name}
        </Text>
      </YStack>
    </TouchableOpacity>
  );
}
