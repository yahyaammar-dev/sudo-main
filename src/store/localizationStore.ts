import { observable } from '@legendapp/state';
import { getDeviceLanguage } from 'helpers';
import { AppState } from 'react-native';
import { SupportedLanguage } from 'types';

import { Translations } from '../lib/i18n';
import { en } from '../lib/i18n/translations/en';
import { fr } from '../lib/i18n/translations/fr';

const translations: Record<SupportedLanguage, Translations> = {
  en,
  fr,
};

type LocalizationStoreState = {
  language: SupportedLanguage;
  isInitialized: boolean;
};

type LocalizationStoreActions = {
  setLanguage: (language: SupportedLanguage) => void;
  setIsInitialized: (isInitialized: boolean) => void;
  getTranslations: () => Translations;
  updateFromDeviceLanguage: () => void;
};

const store = observable<LocalizationStoreState & LocalizationStoreActions>({
  language: 'en',
  isInitialized: false,

  setLanguage: (language) => {
    store.language.set(language);
  },

  setIsInitialized: (isInitialized) => {
    store.isInitialized.set(isInitialized);
  },

  getTranslations: (): Translations => {
    return translations[store.language.get() as SupportedLanguage];
  },

  updateFromDeviceLanguage: () => {
    const deviceLanguage = getDeviceLanguage();
    store.setLanguage(deviceLanguage);
  },
});

const initializeStore = async () => {
  store.updateFromDeviceLanguage();
  store.setIsInitialized(true);
};

AppState.addEventListener('change', (nextAppState) => {
  if (nextAppState === 'active') {
    store.updateFromDeviceLanguage();
  }
});

initializeStore();

export default store;
