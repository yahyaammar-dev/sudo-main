import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useWindowDimensions, View } from 'react-native';
import { styles } from './styles';

export default function Splash() {
  const { width, height } = useWindowDimensions();
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require('../../../assets/splash.png')}
        style={{
          width,
          height,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        contentFit="cover"
      />
    </View>
  );
}
