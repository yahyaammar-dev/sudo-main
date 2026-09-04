import { use$ } from '@legendapp/state/react';
import { useQueryClient } from '@tanstack/react-query';
import { useDeleteAccount, useLogout } from 'api/account';
import { clearCookies } from 'api/swell/client';
import { MenuItem } from 'components';
import { openURL } from 'expo-linking';
import { router } from 'expo-router';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { useTranslation } from 'hooks';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import React from 'react';
import { Alert, ScrollView } from 'react-native';
import CountryFlag from 'react-native-country-flag';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Routes } from 'routers';
import { userStore } from 'store';
import { Text, YStack, XStack, Card, Avatar, Separator } from 'tamagui';

import { styles } from '../styles';

countries.registerLocale(enLocale);
const phoneUtil = PhoneNumberUtil.getInstance();

function AccountScreen() {
  const { translations } = useTranslation();
  const insets = useSafeAreaInsets();
  const { account, logout } = use$(userStore);
  const { mutate: swellLogout } = useLogout();
  const { mutate: deleteAccount, isPending: isDeletingAccount } = useDeleteAccount();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    swellLogout();
    clearCookies();
    queryClient.clear();
    logout();
    router.replace(Routes.Login);
  };

  const handleDeleteAccount = () => {
    if (!account?.id || isDeletingAccount) return;

    deleteAccount(account.id, {
      onSuccess: () => {
        clearCookies();
        queryClient.clear();
        logout();
        router.replace(Routes.Login);
      },
      onError: () => {
        Alert.alert(
          translations.deleteAccount,
          'Failed to delete your account. Please try again or contact support.'
        );
      },
    });
  };

  const menuItems = [
    {
      title: translations.myOrders,
      onPress: () => router.push(Routes.Orders),
    },
    // {
    //   title: translations.myFavorites,
    //   onPress: () => console.log('My Favorites pressed'),
    // },
    {
      title: translations.myAddress,
      onPress: () => router.push(Routes.MyAddresses),
    },
    // {
    //   title: translations.notifications,
    //   onPress: () => console.log('Notifications pressed'),
    // },
  ];

  const supportItems = [
    {
      title: translations.termsOfUse,
      onPress: () => openURL('https://www.gosodu.com/articles/terms-of-use'),
    },
    {
      title: translations.privacyPolicy,
      onPress: () => openURL('https://www.gosodu.com/articles/privacy-policy'),
    },
    {
      title: translations.reportAnIssue,
      onPress: () => console.log('Report an Issue pressed'),
    },
    {
      title: translations.contactUs,
      onPress: () => console.log('Contact Us pressed'),
    },
  ];

  const dangerItems = [
    {
      title: translations.logOut,
      onPress: handleLogout,
      color: '#ef4444',
    },
    {
      title: translations.deleteAccount,
      onPress: () => {
        Alert.alert(
          translations.deleteAccount,
          'Are you sure you want to delete your account? This action cannot be undone.',
          [
            { text: translations.cancel, style: 'cancel' },
            {
              text: translations.delete,
              style: 'destructive',
              onPress: handleDeleteAccount,
            },
          ]
        );
      },
      color: '#ef4444',
    },
  ];

  function getCountryIsoFromPhone() {
    if (!account?.phone) return '';
    const normalizedPhone = account?.phone.startsWith('+') ? account?.phone : `+${account?.phone}`;

    try {
      const number = phoneUtil.parse(normalizedPhone);

      if (phoneUtil.isValidNumber(number)) {
        return phoneUtil.getRegionCodeForNumber(number);
      }
    } catch {}
    return '';
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding={17} gap={40} pb={insets.bottom}>
          <XStack gap={12} alignItems="center">
            <Avatar circular size="$6" backgroundColor="#fce7d6">
              <Avatar.Image accessibilityLabel={account?.name} />
              <Avatar.Fallback
                justifyContent="center"
                alignItems="center"
                backgroundColor="#fce7d6"
                delayMs={600}>
                <Text color="#000" fontSize={14} fontWeight="700">
                  {account?.name?.charAt(0).toUpperCase()}
                </Text>
              </Avatar.Fallback>
            </Avatar>
            <YStack gap={4}>
              <Text fontSize={12} fontWeight="400">
                {account?.name ? account.name.replace(/\b\w/g, (c) => c.toUpperCase()) : ''}
              </Text>
              <XStack gap={4} alignItems="center">
                <CountryFlag
                  isoCode={getCountryIsoFromPhone()?.toLowerCase() as string}
                  size={14}
                  style={{ borderRadius: 50 }}
                />
                <Text fontSize={12} fontWeight="400" color="#6B7280">
                  {countries.getName(getCountryIsoFromPhone()?.toLowerCase() as string, 'en') ||
                    'Unknown'}
                </Text>
              </XStack>
            </YStack>
          </XStack>

          <Card bordered backgroundColor="white" borderRadius={17}>
            <YStack>
              {menuItems.map((item, index) => (
                <React.Fragment key={item.title}>
                  <MenuItem title={item.title} onPress={item.onPress} color="#000" />
                  {index < menuItems.length - 1 && <Separator y={1} borderColor="#F3F4F6" />}
                </React.Fragment>
              ))}
            </YStack>
          </Card>

          <Card bordered backgroundColor="white" borderRadius={17}>
            <YStack>
              {supportItems.map((item, index) => (
                <React.Fragment key={item.title}>
                  <MenuItem title={item.title} onPress={item.onPress} color="#000" />
                  {index < supportItems.length - 1 && <Separator y={1} borderColor="#F3F4F6" />}
                </React.Fragment>
              ))}
              {dangerItems.map((item, index) => (
                <React.Fragment key={item.title}>
                  <Separator />
                  <MenuItem title={item.title} onPress={item.onPress} color={item.color} />
                </React.Fragment>
              ))}
            </YStack>
          </Card>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

export default AccountScreen;
