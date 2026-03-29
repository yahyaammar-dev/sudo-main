import { Translations } from 'lib';
import { en } from 'lib/i18n/translations/en';
import { fr } from 'lib/i18n/translations/fr';

import localizationStore from '../store/localizationStore';

const translationMap = {
  en,
  fr,
};
export const translate = (key: keyof Translations): string => {
  const currentLanguage = localizationStore.language.get();
  const translations = translationMap[currentLanguage as keyof typeof translationMap] || en;
  return translations[key];
};
