import { countries, searchCountries } from 'constants/countries';
import { SearchNormal1, CloseCircle } from 'iconsax-react-nativejs';
import React, { useState, useMemo } from 'react';
import {
  FlatList,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import CountryFlag from 'react-native-country-flag';
import { YStack, XStack, Text, Input, Separator } from 'tamagui';
import { Country } from 'types';

interface CountryPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: Country) => void;
  selectedCountry?: Country | null;
}

const CountryPicker: React.FC<CountryPickerProps> = ({
  visible,
  onClose,
  onSelect,
  selectedCountry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return countries;
    }
    return searchCountries(searchQuery);
  }, [searchQuery]);

  const handleSelectCountry = (country: Country) => {
    onSelect(country);
    onClose();
    setSearchQuery('');
  };

  const handleModalPress = () => {
    Keyboard.dismiss();
  };

  const renderCountryItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      onPress={() => handleSelectCountry(item)}
      style={{
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: selectedCountry?.cca2 === item.cca2 ? '#F8F9FA' : 'transparent',
      }}>
      <XStack alignItems="center" gap={12}>
        <CountryFlag
          isoCode={item.cca2.toLowerCase()}
          size={24}
          style={{
            borderRadius: 4,
            borderWidth: 0.5,
            borderColor: '#E5E5E5',
          }}
        />
        <YStack flex={1}>
          <Text fontSize={15} fontWeight="500" color="#000">
            {item.name}
          </Text>
          <Text fontSize={13} color="#6B7280" marginTop={1}>
            +{item.callingCode[0]}
          </Text>
        </YStack>
        {selectedCountry?.cca2 === item.cca2 && (
          <XStack
            width={20}
            height={20}
            borderRadius={10}
            backgroundColor="#108910"
            alignItems="center"
            justifyContent="center">
            <Text fontSize={12} color="#fff" fontWeight="600">
              ✓
            </Text>
          </XStack>
        )}
      </XStack>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={handleModalPress}>
        <YStack flex={1} backgroundColor="#fff">
          <XStack
            alignItems="center"
            justifyContent="space-between"
            paddingHorizontal={16}
            paddingVertical={16}
            borderBottomWidth={1}
            borderBottomColor="#F3F4F6"
            backgroundColor="#fff">
            <Text fontSize={18} fontWeight="600" color="#000">
              Select Country
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                padding: 6,
                borderRadius: 6,
                backgroundColor: '#F8F9FA',
              }}>
              <CloseCircle size={20} color="#6B7280" />
            </TouchableOpacity>
          </XStack>

          <YStack paddingHorizontal={16} paddingVertical={12}>
            <XStack
              alignItems="center"
              backgroundColor="#F8F9FA"
              borderRadius={8}
              paddingHorizontal={10}
              paddingVertical={8}
              gap={8}
              borderWidth={1}
              borderColor="#E5E5E5">
              <SearchNormal1 size={16} color="#6B7280" />
              <Input
                flex={1}
                placeholder="Search countries..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                borderWidth={0}
                backgroundColor="transparent"
                fontSize={14}
                padding={0}
                color="#000"
              />
            </XStack>
          </YStack>

          <FlatList
            data={filteredCountries}
            renderItem={renderCountryItem}
            keyExtractor={(item) => item.cca2}
            ItemSeparatorComponent={() => (
              <Separator marginHorizontal={16} borderColor="#F3F4F6" borderWidth={0.5} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={() => (
              <YStack
                alignItems="center"
                justifyContent="center"
                paddingVertical={32}
                paddingHorizontal={16}>
                <Text fontSize={15} color="#6B7280" textAlign="center">
                  No countries found matching "{searchQuery}"
                </Text>
                <Text fontSize={13} color="#9CA3AF" textAlign="center" marginTop={6}>
                  Try searching with a different term
                </Text>
              </YStack>
            )}
          />
        </YStack>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CountryPicker;
