import { use$ } from '@legendapp/state/react';
import { getCountryByCode } from 'constants/countries';
import * as Localization from 'expo-localization';
import { useState, useEffect, useCallback } from 'react';
import { userStore } from 'store';
import { Country } from 'types';

export const useCountrySelection = () => {
  const [country, setCountry] = useState<Country | null>(null);
  const [visible, setVisible] = useState(false);
  const { setUserInfo, userInfo } = use$(userStore);
  useEffect(() => {
    const setCountryInfo = async () => {
      try {
        const regionCode = Localization.getLocales()[0]?.regionCode;
        if (!regionCode) return;

        const countryData = getCountryByCode(regionCode);
        if (countryData) {
          setCountry(countryData);
          setUserInfo({ ...userInfo, country: countryData.callingCode[0] });
        }
      } catch (error) {
        console.error('Error setting country info:', error);
        // Fallback to a default country (US)
        const defaultCountry = getCountryByCode('US');
        if (defaultCountry) {
          setCountry(defaultCountry);
          setUserInfo({ ...userInfo, country: defaultCountry.callingCode[0] });
        }
      }
    };

    setCountryInfo();
  }, []);

  const onSelect = useCallback((selectedCountry: Country) => {
    setCountry(selectedCountry);
    setUserInfo({ ...userInfo, country: selectedCountry.callingCode[0] });
  }, []);

  const toggleCountryPicker = useCallback((isVisible: boolean) => {
    setVisible(isVisible);
  }, []);

  return {
    country,
    visible,
    onSelect,
    toggleCountryPicker,
  };
};
