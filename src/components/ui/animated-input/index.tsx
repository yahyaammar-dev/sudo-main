import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { TextInput, TextInputProps, Animated, ViewStyle } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';

import { styles } from './styles';

type AnimatedInputProps<T extends FieldValues> = TextInputProps & {
  control: Control<T>;
  name: Path<T>;
  label: string;
  required?: boolean;
  placeholder?: string;
};

const AnimatedInput = forwardRef<TextInput, AnimatedInputProps<any>>(
  <T extends FieldValues>(
    {
      control,
      name,
      label,
      required = false,
      placeholder,
      onFocus,
      onSubmitEditing,
      ...props
    }: AnimatedInputProps<T>,
    ref: React.ForwardedRef<TextInput>
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const valueRef = useRef<any>(null);
    const inputRef = useRef<TextInput>(null);

    const handleAnimation = (toValue: number) => {
      Animated.timing(animatedValue, {
        toValue,
        duration: 200,
        useNativeDriver: false,
      }).start();
    };

    const labelTop = animatedValue.interpolate({
      inputRange: [0, 0.95],
      outputRange: [16, 4],
    });

    const animatedFontSize = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 9],
    });

    const labelStyle: Animated.WithAnimatedObject<ViewStyle> = {
      top: labelTop,
      left: 12,
      position: 'absolute',
      zIndex: 1,
      backgroundColor: 'white',
    };

    useEffect(() => {
      if (placeholder) handleAnimation(1);
    }, [placeholder]);

    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
          if (value !== valueRef.current) {
            valueRef.current = value;
            if (value) handleAnimation(1);
          }

          return (
            <YStack gap={4}>
              <YStack
                position="relative"
                height={52}
                borderWidth={1}
                borderColor={error ? '#FF0404' : isFocused ? '#108910' : '#C7C8CD'}
                borderRadius={8}
                backgroundColor="white"
                paddingHorizontal={12}
                justifyContent="center"
                overflow="hidden">
                <Animated.View style={[styles.labelContainer, labelStyle]}>
                  <XStack
                    onPress={() => {
                      handleAnimation(1);
                      setIsFocused(true);
                      inputRef.current?.focus();
                      onFocus?.(value);
                    }}
                    gap={2}
                    alignItems="center">
                    <Animated.Text
                      style={{
                        fontSize: animatedFontSize,
                        fontWeight: isFocused || value ? '300' : '500',
                        color: isFocused && !error ? '#108910' : error ? '#FF0404' : '#72767E',
                      }}>
                      {label}
                    </Animated.Text>
                    {required && (!value || error) && (
                      <Text
                        fontSize={isFocused ? 9 : 14}
                        fontWeight={isFocused ? '300' : '500'}
                        color="#FF0404">
                        *
                      </Text>
                    )}
                  </XStack>
                </Animated.View>

                <TextInput
                  ref={(instance) => {
                    inputRef.current = instance;
                    if (typeof ref === 'function') {
                      ref(instance);
                    } else if (ref) {
                      ref.current = instance;
                    }
                  }}
                  style={{
                    fontSize: 14,
                    color: '#72767E',
                    fontWeight: '500',
                    height: '100%',
                  }}
                  onFocus={() => {
                    setIsFocused(true);
                    handleAnimation(1);
                  }}
                  onBlur={() => {
                    setIsFocused(false);
                    if (!value && !placeholder) handleAnimation(0);
                    onBlur();
                  }}
                  onChangeText={onChange}
                  value={value}
                  placeholderTextColor="#72767E"
                  placeholder={placeholder}
                  onSubmitEditing={onSubmitEditing}
                  {...props}
                />
              </YStack>
              {error && (
                <Text color="#FF0404" fontSize={12} fontWeight="400">
                  {error?.message}
                </Text>
              )}
            </YStack>
          );
        }}
      />
    );
  }
);

AnimatedInput.displayName = 'AnimatedInput';

export default AnimatedInput;
