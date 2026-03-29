import { useWindowDimensions, ImageBackground, View } from 'react-native';

import { styles } from './styles';

export type OnboardingSlideProps = {
  id: string;
  image: any;
  title: string;
  subtitle: string;
};

export default function OnboardingSlide({ item }: { item: OnboardingSlideProps }) {
  const { width, height } = useWindowDimensions();
  return (
    <View style={{ width, height: height / 1.65 }}>
      <ImageBackground source={item.image} style={styles.image} resizeMode="cover" />
    </View>
  );
}
