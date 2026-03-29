import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    width: '100%',
    height: 300,
  },
  carouselItem: {
    width,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  dotStyle: {
    backgroundColor: '#D1D1D1',
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
});
