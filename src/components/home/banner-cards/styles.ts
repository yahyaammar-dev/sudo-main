import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { width: width - 32, height: 170, borderRadius: 10 },
  scrollContainer: { gap: 0 },
  child: { width: width - 32, height: 170, borderRadius: 10 },
  dotStyle: {
    backgroundColor: '#F5F5F5',
    width: 6,
    height: 6,
    borderRadius: 10,
  },
  activeDotStyle: {
    backgroundColor: '#6CC51D',
    width: 20,
    height: 6,
    borderRadius: 10,
  },
  containerStyle: {
    gap: 6,
  },
});

