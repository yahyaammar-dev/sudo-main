import { useGetCart } from 'api/cart';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Routes } from 'routers';
import { Text, View } from 'tamagui';

import { styles } from './styles';

interface CartIconProps {
  backgroundColor?: string;
}

export default function CartIcon({ backgroundColor }: CartIconProps) {
  const { data: cartData } = useGetCart();

  return cartData?.itemQuantity && cartData?.itemQuantity > 0 ? (
    <TouchableOpacity
      onPress={() => router.push(Routes.Cart)}
      style={[styles.container, { backgroundColor: backgroundColor || 'white' }]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      activeOpacity={0.5}>
      <View>
        <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <Path
            d="M1.88671 14.4552C1.02876 11.0234 0.599789 9.3075 1.50062 8.1538C2.40145 7 4.17016 7 7.70757 7H12.3382C15.8756 7 17.6443 7 18.5451 8.1538C19.446 9.3075 19.017 11.0234 18.1591 14.4552C17.6134 16.6379 17.3405 17.7292 16.5268 18.3646C15.713 19 14.5881 19 12.3382 19H7.70757C5.45771 19 4.33278 19 3.519 18.3646C2.70522 17.7292 2.43238 16.6379 1.88671 14.4552Z"
            stroke="#858585"
            strokeWidth="1.5"
          />
          <Path
            d="M17.5234 7.5L16.813 4.89465C16.5391 3.89005 16.4021 3.38775 16.1212 3.00946C15.8414 2.63273 15.4612 2.34234 15.0242 2.17152C14.5853 2 14.0647 2 13.0234 2M2.52344 7.5L3.23384 4.89465C3.50776 3.89005 3.64472 3.38775 3.92565 3.00946C4.20543 2.63273 4.5856 2.34234 5.02266 2.17152C5.46152 2 5.98216 2 7.02344 2"
            stroke="#858585"
            strokeWidth="1.5"
          />
          <Path
            d="M7.02344 2C7.02344 1.44772 7.47116 1 8.02344 1H12.0234C12.5757 1 13.0234 1.44772 13.0234 2C13.0234 2.55228 12.5757 3 12.0234 3H8.02344C7.47116 3 7.02344 2.55228 7.02344 2Z"
            stroke="#858585"
            strokeWidth="1.5"
          />
          <Path
            d="M6.02344 11V15"
            stroke="#858585"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M14.0234 11V15"
            stroke="#858585"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <Path
            d="M10.0234 11V15"
            stroke="#858585"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <View
          position="absolute"
          bottom={-8}
          right={-8}
          width={16}
          height={16}
          backgroundColor="#6CC51D"
          borderRadius={10}
          justifyContent="center"
          alignItems="center">
          <Text color="white" fontSize={8} fontWeight="600" lineHeight={10}>
            {cartData?.itemQuantity || 0}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  ) : null;
}
