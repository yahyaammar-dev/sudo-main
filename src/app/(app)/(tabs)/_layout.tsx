import { Tabs } from 'expo-router/tabs';
import { useTranslation } from 'hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BagIcon, HomeIcon, ProfileIcon } from '../../../../assets/icons';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { translations } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00A83E',
        tabBarInactiveTintColor: '#888888',
        tabBarShowLabel: true,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#EEEEEE',
          paddingBottom: insets.bottom > 0 ? 5 : 10,
          paddingTop: 10,
          height: insets.bottom > 0 ? 60 + insets.bottom : 60,
        },
        headerShown: false,
      }}
      initialRouteName="home">
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: translations.home,
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: translations.orders,
          tabBarIcon: ({ color }) => <BagIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: translations.account,
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
