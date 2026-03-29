import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

const COLUMN_COUNT = 3;
const ITEM_WIDTH = (width - 48) / COLUMN_COUNT;

export const styles = StyleSheet.create({
  gridItem: {
    width: ITEM_WIDTH,
    marginBottom: 14,
    backgroundColor: '#FFFBFB',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
});
