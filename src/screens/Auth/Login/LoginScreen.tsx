import { use$ } from '@legendapp/state/react';
import { ThemedSafeAreaView } from 'components';
import CountryPicker from 'components/ui/country-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCountrySelection, useLoginScreen, usePhoneValidation, useTranslation } from 'hooks';
import { ArrowLeft2 } from 'iconsax-react-nativejs';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
  View as RNView,
} from 'react-native';
import CountryFlag from 'react-native-country-flag';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { userStore } from 'store';
import { Button, ButtonText, Image, Text, View, XStack, YStack } from 'tamagui';

import Logo from '../../../../assets/logo.png';

type FormValues = {
  phoneNumber: string;
};

function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { translations } = useTranslation();
  const { setUserInfo, userInfo } = use$(userStore);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<FormValues>({
    defaultValues: {
      phoneNumber: '',
    },
    mode: 'onChange',
  });
  const phoneNumber = watch('phoneNumber');
  const { country, visible, onSelect, toggleCountryPicker } = useCountrySelection();
  const { isValid: validatePhoneNumberHook } = usePhoneValidation(phoneNumber, country, {
    debounceTime: 0,
  });
  const { handleSubmit: onSubmit, status } = useLoginScreen({
    phoneNumber,
  });

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    if (phoneNumber) {
      trigger('phoneNumber');
    }
  }, [phoneNumber, country, validatePhoneNumberHook]);

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ThemedSafeAreaView edges={['top', 'bottom']} style={styles.container}>
        <YStack
          flex={1}
          justifyContent="space-between"
          paddingHorizontal={20}
          backgroundColor="#fff">
          <YStack>
            <XStack alignItems="center" justifyContent="space-between" marginTop={20}>
              <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <ArrowLeft2 size={20} color="#000" />
              </TouchableOpacity>
              <Image source={Logo} alt="Logo" width={52} height={52} />
            </XStack>

            <YStack marginTop={46} gap={10}>
              <Text color="#000" fontSize={30} fontWeight={700}>
                {translations.login}
              </Text>
              <Text color="rgba(0, 0, 0, 0.70)" fontSize={16} fontWeight={400}>
                {translations.confirmCountryCode}
              </Text>
            </YStack>

            <YStack my={35}>
              <CountryPicker
                visible={visible}
                onClose={() => toggleCountryPicker(false)}
                onSelect={(c) => {
                  setUserInfo({ ...userInfo, country: c?.callingCode?.[0] || '' });
                  onSelect(c);
                }}
                selectedCountry={country}
              />

              <TouchableWithoutFeedback onPress={() => toggleCountryPicker(true)}>
                <XStack
                  borderBottomColor="#D8DADC"
                  borderBottomWidth={1}
                  borderTopColor="#D8DADC"
                  borderTopWidth={1}
                  py={18}
                  gap={18}>
                  {country?.cca2 && <CountryFlag isoCode={country?.cca2.toLowerCase()} size={20} />}
                  <Text
                    onPress={() => toggleCountryPicker(true)}
                    color="#000"
                    fontSize={17}
                    fontWeight={400}>
                    {country?.name}
                  </Text>
                </XStack>
              </TouchableWithoutFeedback>

              <Controller
                control={control}
                name="phoneNumber"
                rules={{
                  required: 'Phone number is required',
                  validate: (value) => {
                    if (!value || !country) {
                      return true;
                    }
                    if (!validatePhoneNumberHook) {
                      return `Invalid phone number for ${country?.name || 'this country'}`;
                    }
                  },
                }}
                render={({ field: { onChange, onBlur, value }, fieldState: { invalid } }) => {
                  const onChangeText = (text: string) => {
                    const cleaned = text.replace(/[^\d]/g, '');
                    onChange(cleaned);
                  };

                  return (
                    <XStack
                      borderBottomColor={invalid ? '#FF3B30' : '#D8DADC'}
                      borderBottomWidth={1}
                      py={18}
                      alignItems="center">
                      <Text color="#000" fontSize={17} fontWeight={400}>
                        {`+${country?.callingCode?.[0]}`}
                      </Text>
                      <View mr={10} ml={10} width={1} height="100%" backgroundColor="#D8DADC" />
                      <TextInput
                        style={[styles.phoneInput, invalid && styles.invalidInput]}
                        value={value}
                        onChangeText={onChangeText}
                        onBlur={onBlur}
                        placeholder="0 00 00 00 00"
                        keyboardType="phone-pad"
                        maxLength={20}
                      />
                    </XStack>
                  );
                }}
              />

              {errors.phoneNumber && (
                <Text color="#FF3B30" fontSize={12} marginTop={5}>
                  {errors.phoneNumber.message}
                </Text>
              )}
            </YStack>
          </YStack>

          {/* Button wrapper with explicit white background covering bottom safe area */}
          <RNView style={[styles.buttonWrapper, { paddingBottom: insets.bottom + 10 }]}>
            <Button
              bg={phoneNumber && !errors.phoneNumber ? '#108910' : '#A0A0A0'}
              width="full"
              height={54}
              borderRadius={30}
              justifyContent="center"
              alignItems="center"
              disabled={!phoneNumber || !!errors.phoneNumber || status === 'pending'}
              onPress={handleSubmit(onSubmit)}>
              {status === 'pending' ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <ButtonText color="#fff" fontWeight={600} size={17}>
                  {translations.continue}
                </ButtonText>
              )}
            </Button>
          </RNView>
        </YStack>
      </ThemedSafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D8DADC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneInput: {
    flex: 1,
    fontSize: 17,
    color: '#000',
    fontWeight: '400',
    padding: 0,
  },
  invalidInput: {
    color: '#FF3B30',
  },
  buttonWrapper: {
    backgroundColor: '#fff',
    paddingTop: 10,
  },
});

export default LoginScreen;
