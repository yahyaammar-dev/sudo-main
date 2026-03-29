import * as Localization from 'expo-localization';
import { SupportedLanguage } from 'types';

export const getDeviceLanguage = (): SupportedLanguage => {
  const locales = Localization.getLocales();
  const primaryLocale = locales[0];

  if (primaryLocale?.languageCode === 'fr') {
    return 'fr';
  }

  return 'en';
};
