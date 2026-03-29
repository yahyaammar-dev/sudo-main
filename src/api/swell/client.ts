import AsyncStorage from '@react-native-async-storage/async-storage';
import { env } from 'config';
import { localizationStore } from 'store';
import swell from 'swell-js';

const cookieCache: Record<string, string> = {};

const loadCachedCookies = async () => {
  try {
    const cached = await AsyncStorage.getItem('__swellCookies');
    if (cached) {
      Object.assign(cookieCache, JSON.parse(cached));
    }
  } catch (error) {
    console.warn('Failed to load cached cookies:', error);
  }
};

let saveTimeout: NodeJS.Timeout;
const saveCookies = () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    AsyncStorage.setItem('__swellCookies', JSON.stringify(cookieCache));
  }, 100);
};

export const initSwell = () => {
  swell.init(env.swellStoreId, env.swellPublicKey, {
    useCamelCase: true,
    setCookie(key, value) {
      cookieCache[key] = value;
      saveCookies();
    },
    getCookie(key) {
      return cookieCache[key];
    },
    locale: localizationStore.language.get(),
  });
};

export const clearCookies = async () => {
  try {
    Object.keys(cookieCache).forEach((key) => {
      delete cookieCache[key];
    });
    await AsyncStorage.removeItem('__swellCookies');
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    initSwell();
  } catch (error) {
    console.warn('Failed to clear cookies:', error);
  }
};

initSwell();
loadCachedCookies();

export default swell;
