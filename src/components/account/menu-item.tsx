import { ArrowRight2 } from 'iconsax-react-nativejs';
import { TouchableOpacity } from 'react-native';
import { XStack, Text } from 'tamagui';
type MenuItemProps = {
  title: string;
  onPress: () => void;
  color?: string;
};

function MenuItem({ title, onPress, color = '#000' }: MenuItemProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <XStack
        paddingHorizontal={25}
        paddingVertical={16}
        justifyContent="space-between"
        alignItems="center">
        <Text fontSize={16} fontWeight="500" color={color}>
          {title}
        </Text>
        <ArrowRight2 size={24} color="#9CA3AF" />
      </XStack>
    </TouchableOpacity>
  );
}

export default MenuItem;
