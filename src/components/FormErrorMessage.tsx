import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FormErrorMessageProps {
  message: string;
}

export function FormErrorMessage({ message }: FormErrorMessageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    paddingHorizontal: 4,
  },
  text: {
    color: '#ee4444',
    fontSize: 12,
    fontFamily: 'Inter',
  },
});
