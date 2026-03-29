import { zodResolver } from '@hookform/resolvers/zod';
import { use$ } from '@legendapp/state/react';
import { Address, useCreateAddress, useUpdateAddress } from 'api';
import { useGetShippingRates } from 'api/cart';
import { useUpdateCart } from 'api/mutations';
import { ThemedSafeAreaView } from 'components';
import { AnimatedInput, CountryPickerInput } from 'components/ui';
import { getCountryByCode } from 'constants/countries';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'hooks';
import { ArrowLeft2 } from 'iconsax-react-nativejs';
import { useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, ActivityIndicator } from 'react-native';
import { Routes } from 'routers';
import { userStore } from 'store';
import { Button, Text, View, XStack, YStack } from 'tamagui';
import { Country } from 'types';
import { z } from 'zod';

const addressSchema = z.object({
  country: z.custom<Country>((val) => !!val, { message: 'Country is required' }),
  phone: z.string().min(1, { message: 'Phone number is required' }),
  address1: z.string().min(1, { message: 'Street address is required' }),
  address2: z.string().optional(),
  state: z.string().min(1, { message: 'State is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  zip: z.string().min(1, { message: 'Postal code is required' }),
});

type FormData = z.infer<typeof addressSchema>;

function ShippingAddressScreen() {
  const { translations } = useTranslation();
  const { account } = use$(userStore);
  const param = useLocalSearchParams<{ address: string; from: string }>();
  const addressParam = param.address ? (JSON.parse(param.address) as Address) : null;
  const { mutate, status, reset: createAddressReset, data: createAddressData } = useCreateAddress();
  const { mutateAsync: updateCart, status: updateCartStatus } = useUpdateCart();
  const { serviceId } = useGetShippingRates();
  const {
    mutate: updateAddress,
    status: updateAddressStatus,
    reset: updateAddressReset,
  } = useUpdateAddress();
  const isLoading = status === 'pending' || updateAddressStatus === 'pending';
  const addressLoaded = useRef(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(addressSchema),
    mode: 'onChange',
    defaultValues: {
      country: undefined,
      phone: '',
      address1: '',
      address2: '',
      state: '',
      city: '',
      zip: '',
    },
  });

  useFocusEffect(
    useCallback(() => {
      if (!addressParam?.country || addressLoaded.current) return;

      const loadAddress = async () => {
        try {
          const country = getCountryByCode(addressParam.country!);
          if (country) {
            reset(
              {
                country,
                phone: addressParam.phone || '',
                address1: addressParam.address1 || '',
                address2: addressParam.address2 || '',
                state: addressParam.state || '',
                city: addressParam.city || '',
                zip: addressParam.zip || '',
              },
              { keepDirty: false }
            );

            addressLoaded.current = true;
          }
        } catch (error) {
          console.error('Error loading address:', error);
        }
      };

      loadAddress();
    }, [])
  );

  useEffect(() => {
    if (updateAddressStatus === 'success' || status === 'success') {
      if (updateAddressStatus === 'success') {
        updateAddressReset();
      } else if (status === 'success') {
        createAddressReset();
      }
      if (param.from === 'cart') {
        updateCart({
          shipping: {
            service: serviceId,
            name: account?.name,
            address1: createAddressData?.address?.address1,
            address2: createAddressData?.address?.address2,
            city: createAddressData?.address?.city,
            state: createAddressData?.address?.state,
            zip: createAddressData?.address?.zip,
            country: createAddressData?.address?.country,
            phone: createAddressData?.address?.phone,
          },
        }).then(() => {
          router.replace(Routes.Checkout);
        });
      } else {
        router.back();
        reset();
      }
    }
  }, [updateAddressStatus, status, updateAddressReset, createAddressReset, reset, router]);

  const onSubmit = handleSubmit((data) => {
    if (account?.id) {
      const action = addressParam ? updateAddress : mutate;
      action({
        addressId: addressParam?.id as string,
        accountId: account.id,
        addressData: {
          parent_id: account.id,
          country: data.country.cca2,
          phone: data.phone,
          address1: data.address1,
          address2: data.address2 || '',
          state: data.state,
          city: data.city,
          zip: data.zip,
        },
      });
    }
  });

  const isButtonEnabled = isValid && isDirty && !isLoading;

  return (
    <ThemedSafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <YStack flex={1}>
        <XStack py={16} px={16} alignItems="center" justifyContent="space-between">
          <Button
            height={40}
            width={40}
            backgroundColor="transparent"
            borderWidth={1}
            borderColor="#D8DADC"
            borderRadius={10}
            onPress={() => router.back()}>
            <ArrowLeft2 />
          </Button>
          <YStack alignItems="center">
            <Text fontSize={18} fontWeight="500">
              Add Shipping Address
            </Text>
            <Text fontSize={8} color="#076D05">
              Your information is encrypted and secure
            </Text>
          </YStack>
          <View />
        </XStack>
        <ScrollView
          contentContainerStyle={{ flex: 1, padding: 16 }}
          showsVerticalScrollIndicator={false}>
          <YStack flex={1} justifyContent="space-between">
            <YStack gap={17}>
              <CountryPickerInput
                control={control}
                name="country"
                label={translations.countryOrRegion}
                required
                error={errors.country?.message}
              />
              <AnimatedInput
                control={control}
                name="phone"
                label={translations.phoneNumber}
                required
                error={errors.phone?.message}
              />
              <AnimatedInput
                control={control}
                name="address1"
                label={translations.streetAddress}
                required
                placeholder="Type full address"
                error={errors.address1?.message}
              />
              <AnimatedInput
                control={control}
                name="address2"
                label="Address Details"
                placeholder="Apt, floor, suit, etc"
              />
              <AnimatedInput
                control={control}
                name="state"
                label="State / Province"
                required
                placeholder="Type state"
                error={errors.state?.message}
              />
              <AnimatedInput
                control={control}
                name="city"
                label="City"
                required
                placeholder="Type city"
                error={errors.city?.message}
              />
              <AnimatedInput
                control={control}
                name="zip"
                label="Postal Code"
                required
                placeholder="Type postal code"
                error={errors.zip?.message}
              />
            </YStack>

            <Button
              backgroundColor={
                isButtonEnabled && updateCartStatus !== 'pending' ? '#108910' : '#A0A0A0'
              }
              height={54}
              justifyContent="center"
              alignItems="center"
              borderRadius={27}
              disabled={!isButtonEnabled || updateCartStatus === 'pending'}
              onPress={onSubmit}>
              {isLoading || updateCartStatus === 'pending' ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text color="#fff" fontSize={17} fontWeight="500">
                  Save Address
                </Text>
              )}
            </Button>
          </YStack>
        </ScrollView>
      </YStack>
    </ThemedSafeAreaView>
  );
}

export default ShippingAddressScreen;
