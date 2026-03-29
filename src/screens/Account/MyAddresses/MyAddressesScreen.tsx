import { use$ } from '@legendapp/state/react';
import { StackActions } from '@react-navigation/native';
import { useGetAllAddresses, Address as TAddress } from 'api';
import { useGetShippingRates } from 'api/cart';
import { useUpdateCart } from 'api/mutations';
import { ThemedSafeAreaView, MyAddressesSkeleton } from 'components';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { usePreviousRoute, useTranslation } from 'hooks';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react-nativejs';
import { memo, useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';
import { Routes } from 'routers';
import { userStore } from 'store';
import { XStack, YStack, Text, Button } from 'tamagui';

function MyAddressesScreen() {
  const { translations } = useTranslation();
  const { account } = use$(userStore);
  const param = useLocalSearchParams<{ address: string }>();
  const { data: addresses, isLoading } = useGetAllAddresses(account?.id as string);
  const { mutate, status, error, reset } = useUpdateCart();
  const { serviceId } = useGetShippingRates();
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<TAddress | null>(null);
  const navigation = useNavigation();
  const prevRoute = usePreviousRoute();

  const matchedAddressIndex = useMemo<number>(() => {
    if (!param.address || !addresses) return -1;
    let parsedAddress: TAddress | null = null;
    try {
      parsedAddress = JSON.parse(param.address) as TAddress;
    } catch (e) {
      return -1;
    }
    return addresses.findIndex(
      (addr) =>
        addr.address1 === parsedAddress?.address1 &&
        addr.address2 === parsedAddress.address2 &&
        addr.city === parsedAddress.city &&
        addr.country === parsedAddress.country &&
        addr.phone === parsedAddress.phone &&
        addr.state === parsedAddress.state &&
        addr.zip === parsedAddress.zip
    );
  }, [param.address, addresses]);

  useEffect(() => {
    if (status === 'success' && isUpdatingCart) {
      setIsUpdatingCart(false);
      setSelectedAddress(null);
      navigation.dispatch(StackActions.pop(2));

      router.navigate(Routes.Checkout);
      reset();
    } else if (status === 'error' && isUpdatingCart) {
      setIsUpdatingCart(false);
      setSelectedAddress(null);
    }
  }, [status, error, isUpdatingCart]);

  const handleAddressSelect = (address: TAddress) => {
    if ('/' + prevRoute === Routes.Checkout) {
      setIsUpdatingCart(true);
      setSelectedAddress(address);
      mutate({
        shipping: {
          name: account?.name,
          address1: address.address1,
          address2: address.address2,
          city: address.city,
          state: address.state,
          zip: address.zip,
          country: address.country,
          phone: address.phone,
          service: serviceId,
        },
      });
    } else {
      router.push({
        pathname: Routes.ModifyAddress,
        params: {
          address: JSON.stringify(address),
        },
      });
    }
  };

  const handleAddAddress = () => {
    router.push(Routes.ModifyAddress);
  };

  return (
    <ThemedSafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#fff' }}>
      <YStack gap={40} flex={1} backgroundColor="#fff">
        <XStack px={16} pt={16} alignItems="center" justifyContent="space-between">
          <Button
            height={40}
            width={40}
            borderRadius={10}
            backgroundColor="white"
            borderColor="#e0e0e0"
            borderWidth={1}
            padding={8}
            pressStyle={{ opacity: 0.7 }}
            onPress={() => router.back()}>
            <ArrowLeft2 size={20} color="#000" />
          </Button>
          <Text fontSize={18} fontWeight="600">
            {translations.myAddresses}
          </Text>
          <Button
            backgroundColor="transparent"
            paddingHorizontal={0}
            onPress={handleAddAddress}
            focusStyle={{ backgroundColor: 'transparent' }}
            pressStyle={{ backgroundColor: 'transparent', opacity: 0.7 }}
            hoverStyle={{ backgroundColor: 'transparent' }}>
            <Text fontSize={18} fontWeight="600" color="#108910">
              {translations.add}
            </Text>
          </Button>
        </XStack>

        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack px={40}>
            {isLoading ? (
              <MyAddressesSkeleton />
            ) : (
              <>
                {(addresses || [])?.map((address, index) => (
                  <YStack key={index}>
                    <TouchableWithoutFeedback onPress={() => handleAddressSelect(address)}>
                      <XStack
                        borderColor="#108910"
                        borderWidth={matchedAddressIndex === index ? 2 : 0}
                        borderRadius={10}
                        padding={10}
                        backgroundColor={matchedAddressIndex === index ? '#F3F4F6' : 'white'}
                        width="100%"
                        justifyContent="space-between"
                        alignItems="center">
                        <YStack
                          flex={1}
                          gap={6}
                          py={10}
                          borderBottomWidth={1}
                          borderBottomColor="#F3F4F6">
                          <Text fontSize={16} fontWeight="500" color="#000">
                            {address.country}
                          </Text>
                          <Text fontSize={13} fontWeight="500" color="#858585">
                            {address.address1}
                          </Text>
                          <Text fontSize={13} fontWeight="500" color="#858585">
                            {translations.phoneNumber}: {address.phone}
                          </Text>
                        </YStack>
                        <ArrowRight2 size={24} color="#9CA3AF" />
                      </XStack>
                    </TouchableWithoutFeedback>
                  </YStack>
                ))}
              </>
            )}
          </YStack>
        </ScrollView>
      </YStack>

      {isUpdatingCart && selectedAddress && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#108910" />
          <YStack alignItems="center" paddingHorizontal={20}>
            <Text marginTop={16} color="white" fontWeight="600" textAlign="center">
              Updating shipping information...
            </Text>
            <Text marginTop={8} color="white" textAlign="center">
              {selectedAddress.address1}, {selectedAddress.city}, {selectedAddress.country}
            </Text>
          </YStack>
        </View>
      )}
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default memo(MyAddressesScreen);
