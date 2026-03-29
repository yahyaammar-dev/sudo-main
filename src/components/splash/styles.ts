import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    backgroundColor: '#0C373C',
    justifyContent: 'center',
    alignItems: 'center',
  },
});