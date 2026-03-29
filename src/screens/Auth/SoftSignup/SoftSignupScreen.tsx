import { zodResolver } from '@hookform/resolvers/zod';
import { use$ } from '@legendapp/state/react';
import { useRegister } from 'api/auth';
import { AnimatedInput, CountryPickerInput } from 'components/ui';
import { getCountryByCallingCode } from 'constants/countries';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useTranslation } from 'hooks';
import { ArrowLeft2 } from 'iconsax-react-nativejs';
import { useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { userStore } from 'store';
import { Button, ButtonText, Text, XStack, YStack } from 'tamagui';
import { Country } from 'types';
import { z } from 'zod';

import Logo from '../../../../assets/logo.png';

const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  fullName: z.string().min(1, { message: 'Full name is required' }),
  companyName: z.string().min(1, { message: 'Company name is required' }),
  country: z.custom<Country>((val) => !!val, { message: 'Country is required' }),
});

type SoftSignupFormData = {
  email: string;
  fullName: string;
  companyName: string;
  country: Country;
};

export default function SoftSignupScreen() {
  const { userInfo } = use$(userStore);
  const { mutate: register, isPending } = useRegister();

  const fullNameRef = useRef<TextInput>(null);
  const companyNameRef = useRef<TextInput>(null);

  const country = useMemo(() => {
    if (!userInfo?.country) return undefined;
    return getCountryByCallingCode(userInfo?.country);
  }, [userInfo?.country]);

  const {
    control,
    setValue,
    handleSubmit,
    trigger,
    formState: { isValid },
  } = useForm<SoftSignupFormData>({
    defaultValues: {
      email: '',
      fullName: '',
      companyName: '',
      country: undefined,
    },
    resolver: zodResolver(signupSchema),
    mode: 'all',
    reValidateMode: 'onBlur',
  });
  const insets = useSafeAreaInsets();
  const { translations } = useTranslation();

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    setValue('country', country as Country);
  }, [country]);

  const onSubmit = (data: SoftSignupFormData) => {
    if (!userInfo?.toPhoneNumber) return;
    register({
      email: data.email,
      fullName: data.fullName,
      companyName: data.companyName,
      country: data.country.cca2,
      phone: userInfo?.toPhoneNumber.toString(),
    });
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <YStack
          flex={1}
          px={20}
          justifyContent="space-between"
          pb={insets.bottom - 10}
          backgroundColor="#fff">
          <YStack>
            <XStack alignItems="center" justifyContent="space-between" mt={20}>
              <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <ArrowLeft2 size={20} color="#000" />
              </TouchableOpacity>
              <Image source={Logo} alt="Logo" style={styles.logo} />
            </XStack>

            <YStack py={16} gap={13}>
              <Text fontSize={30} fontWeight="700" color="#000">
                {translations.createYourAccount}
              </Text>
              <Text fontSize={16} color="#000000B2">
                {translations.welcomeSignupMessage}
              </Text>
            </YStack>

            <YStack gap={17}>
              <AnimatedInput
                control={control}
                onChangeText={(text) => setValue('email', text.toLowerCase())}
                name="email"
                label={translations.email}
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => {
                  fullNameRef.current?.focus();
                  trigger('email');
                }}
                required
              />
              <AnimatedInput
                ref={fullNameRef}
                control={control}
                name="fullName"
                label={translations.fullLegalName}
                returnKeyType="next"
                onSubmitEditing={() => companyNameRef.current?.focus()}
                required
              />
              <AnimatedInput
                ref={companyNameRef}
                control={control}
                name="companyName"
                label={translations.companyName}
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
                required
              />
              <CountryPickerInput
                wrapperProps={{
                  backgroundColor: '#EBEBEB',
                  gap: 2,
                }}
                control={control}
                name="country"
                label={translations.country}
                required
                disabled
                hideArrow
              />
            </YStack>
          </YStack>

          <Button
            bg={isValid ? '#108910' : '#A0A0A0'}
            width="full"
            height={54}
            borderRadius={30}
            justifyContent="center"
            alignItems="center"
            mt={30}
            disabled={!isValid || isPending}
            onPress={handleSubmit(onSubmit)}>
            {isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ButtonText color="#fff" fontWeight={600} size={17}>
                {translations.signup}
              </ButtonText>
            )}
          </Button>
        </YStack>
      </SafeAreaView>
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
  logo: {
    width: 52,
    height: 52,
  },
});
