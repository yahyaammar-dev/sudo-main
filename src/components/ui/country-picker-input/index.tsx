import { ArrowDown2 } from 'iconsax-react-nativejs';
import React, { useState, useRef } from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { Animated } from 'react-native';
import CountryFlag from 'react-native-country-flag';
import { YStack, XStack, Text, XStackProps, TextProps } from 'tamagui';
import { Country } from 'types';

import CountryPicker from '../country-picker';

type CountryPickerInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
  required?: boolean;
  onSelect?: (country: Country) => void;
  wrapperProps?: XStackProps;
  labelProps?: TextProps;
  disabled?: boolean;
  hideArrow?: boolean;
  showSelectedCountry?: boolean;
};

const CountryPickerInput = <T extends FieldValues>({
  control,
  name,
  label,
  error,
  required = false,
  onSelect,
  wrapperProps,
  labelProps,
  disabled = false,
  hideArrow = false,
  showSelectedCountry = false,
}: CountryPickerInputProps<T>) => {
  const [visible, setVisible] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const handleAnimation = (toValue: number) => {
    Animated.timing(animatedValue, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const labelContainerStyle = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [12, 10],
    }),
  };

  return (
    <YStack gap={4}>
      <Controller
        control={control}
        name={name}
        rules={{ required: required ? 'This field is required' : false }}
        render={({ field: { onChange, value } }) => (
          <>
            <XStack
              {...wrapperProps}
              height={wrapperProps?.height || 52}
              borderWidth={wrapperProps?.borderWidth || 1}
              borderColor={error ? '#FF3B30' : wrapperProps?.borderColor || '#D8DADC'}
              borderRadius={wrapperProps?.borderRadius || 8}
              backgroundColor={wrapperProps?.backgroundColor || 'white'}
              paddingHorizontal={wrapperProps?.paddingHorizontal || 12}
              alignItems="center"
              justifyContent="space-between"
              disabled={disabled}
              pressStyle={{
                opacity: wrapperProps?.pressStyle?.opacity || 0.8,
                backgroundColor: '#F8F9FA',
              }}
              onPress={() => {
                setVisible(true);
                handleAnimation(1);
              }}>
              <XStack alignItems="flex-end" gap={6} flex={1}>
                <Animated.View style={labelContainerStyle}>
                  <YStack gap={4}>
                    <XStack gap={2}>
                      <Text
                        {...labelProps}
                        color="#6B7280"
                        fontSize={value ? 10 : 14}
                        fontWeight={value ? '400' : '500'}>
                        {label}
                      </Text>
                      {required && (
                        <Text
                          {...labelProps}
                          color={disabled ? '#72767E' : '#FF3B30'}
                          fontSize={value ? 10 : 14}
                          fontWeight="400">
                          *
                        </Text>
                      )}
                    </XStack>
                    {value?.cca2 && (
                      <CountryFlag isoCode={value?.cca2.toLowerCase() || ''} size={18} />
                    )}
                  </YStack>
                </Animated.View>

                {value?.cca2 && (
                  <Text fontSize={15} fontWeight="500" color="#72767E">
                    {value.name}
                  </Text>
                )}
              </XStack>

              {!hideArrow && <ArrowDown2 size={18} color="#6B7280" />}
            </XStack>

            <CountryPicker
              visible={visible}
              onClose={() => {
                setVisible(false);
                if (!value) handleAnimation(0);
              }}
              onSelect={(country: Country) => {
                onChange(country);
                if (onSelect) onSelect(country);
                setVisible(false);
                handleAnimation(1);
              }}
              selectedCountry={value}
            />
          </>
        )}
      />
      {error && (
        <Text color="#FF3B30" fontSize={12} marginTop={4} marginLeft={4}>
          {error}
        </Text>
      )}
    </YStack>
  );
};

export default CountryPickerInput;
