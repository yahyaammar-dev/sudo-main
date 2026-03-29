import {
  TextInput,
  StyleSheet,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  interpolateColor,
} from 'react-native-reanimated';

const AnimatedInput = Animated.createAnimatedComponent(TextInput);

interface InputProps extends TextInputProps {
  hasError?: boolean;
}

export function Input({ hasError, style, ...props }: InputProps) {
  const isFocused = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      isFocused.value,
      [0, 1],
      hasError ? ['#ee4444', '#ee4444'] : ['#e0e0e0', '#11823b']
    );

    return {
      borderColor,
    };
  });

  const onFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    isFocused.value = withTiming(1, { duration: 150 });
    props.onFocus?.(event);
  };

  const onBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    isFocused.value = withTiming(0, { duration: 150 });
    props.onBlur?.(event);
  };

  return (
    <AnimatedInput
      {...props}
      style={[styles.input, animatedStyles, style]}
      placeholderTextColor="#888"
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter',
  },
});
