import { use$ } from '@legendapp/state/react';
import { useMemo } from 'react';
import { localizationStore } from 'store';

export const useTranslation = () => {
  const { language, isInitialized } = use$(localizationStore);

  const translations = useMemo(() => {
    return localizationStore.getTranslations();
  }, [language]);

  return {
    language,
    isInitialized,
    translations,
  };
};
