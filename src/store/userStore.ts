import { observable } from '@legendapp/state';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import { configureSynced, syncObservable } from '@legendapp/state/sync';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TUser } from 'api/auth';

type UserStoreState = {
  userInfo: {
    phoneNumber: string;
    country: string;
    email: string;
    toPhoneNumber?: number;
  };
  account: TUser | null;
  isLoggedIn: boolean;
  authToken: string | null;
  isInitialized: boolean;
  isOnboardingComplete: boolean;
};

type UserStoreActions = {
  setUserInfo: (userInfo: UserStoreState['userInfo']) => void;
  setAccount: (account: TUser) => void;
  setAuthToken: (token: string | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  login: (userInfo: UserStoreState['userInfo'], token?: string) => void;
  logout: () => void;
  setIsInitialized: (isInitialized: boolean) => void;
  setIsOnboardingComplete: (isComplete: boolean) => void;
};

const store = observable<UserStoreState & UserStoreActions>({
  userInfo: {
    country: '',
    phoneNumber: '',
    email: '',
    toPhoneNumber: undefined,
  },
  account: null,
  isLoggedIn: false,
  authToken: null,
  isInitialized: false,
  isOnboardingComplete: false,

  setIsOnboardingComplete: (isComplete) => {
    store.isOnboardingComplete.set(isComplete);
  },

  setUserInfo: (userInfo) => {
    store.userInfo.set(userInfo);
  },

  setAccount: (account) => {
    store.account.set(account);
  },

  setAuthToken: (token) => {
    store.authToken.set(token);
  },

  setIsLoggedIn: (isLoggedIn) => {
    store.isLoggedIn.set(isLoggedIn);
  },

  login: (userInfo, token) => {
    store.userInfo.set(userInfo);
    store.isLoggedIn.set(true);
    if (token) {
      store.authToken.set(token);
    }
  },

  logout: () => {
    store.userInfo.set({
      phoneNumber: '',
      country: '',
      email: '',
      toPhoneNumber: undefined,
    });
    store.account.set(null);
    store.isLoggedIn.set(false);
    store.authToken.set(null);
  },

  setIsInitialized: (isInitialized) => {
    store.isInitialized.set(isInitialized);
  },
});

const persistOptions = configureSynced({
  persist: {
    plugin: observablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
});

syncObservable(
  store.account,
  persistOptions({
    persist: {
      name: 'account',
      transform: {
        save: (value) => {
          try {
            return JSON.stringify(value);
          } catch (error) {
            console.error('Error saving account to storage:', error);
            return JSON.stringify(null);
          }
        },
        load: (value) => {
          try {
            if (typeof value === 'object' && value !== null) {
              return value;
            }

            if (typeof value === 'string') {
              const parsed = JSON.parse(value);
              return parsed;
            }

            if (value === null || value === undefined) {
              return null;
            }

            return null;
          } catch (error) {
            console.error('Error loading account from storage:', error);
            return null;
          }
        },
      },
    },
  })
);
syncObservable(
  store.userInfo,
  persistOptions({
    persist: {
      name: 'userInfo',
      transform: {
        save: (value) => {
          try {
            return JSON.stringify({
              phoneNumber: value.phoneNumber,
              country: value.country,
              email: value.email,
            });
          } catch (error) {
            console.error('Error saving userInfo to storage:', error);
            return JSON.stringify({
              phoneNumber: '',
              country: '',
              email: '',
            });
          }
        },
        load: (value) => {
          try {
            if (typeof value === 'object' && value !== null) {
              return value;
            }

            if (typeof value === 'string') {
              return JSON.parse(value);
            }

            return {
              phoneNumber: '',
              country: '',
              email: '',
            };
          } catch (error) {
            console.error('Error loading userInfo from storage:', error);
            return {
              phoneNumber: '',
              country: '',
              email: '',
            };
          }
        },
      },
    },
  })
);

syncObservable(
  store.authToken,
  persistOptions({
    persist: {
      name: 'authToken',
      transform: {
        save: (value) => {
          try {
            return JSON.stringify(value);
          } catch (error) {
            console.error('Error saving authToken to storage:', error);
            return JSON.stringify(null);
          }
        },
        load: (value) => {
          try {
            if (typeof value === 'string' && !value.startsWith('"')) {
              return value;
            }

            if (typeof value === 'string') {
              const parsed = JSON.parse(value);
              return parsed;
            }

            if (value === null || value === undefined) {
              return null;
            }

            return null;
          } catch (error) {
            console.error('Error loading authToken from storage:', error);
            return null;
          }
        },
      },
    },
  })
);

syncObservable(
  store.isLoggedIn,
  persistOptions({
    persist: {
      name: 'isLoggedIn',
      transform: {
        save: (value) => {
          try {
            return JSON.stringify(value);
          } catch (error) {
            console.error('Error saving isLoggedIn to storage:', error);
            return JSON.stringify(false);
          }
        },
        load: (value) => {
          try {
            if (typeof value === 'boolean') {
              return value;
            }

            if (typeof value === 'string') {
              const parsed = JSON.parse(value);
              return parsed;
            }

            return false;
          } catch (error) {
            console.error('Error loading isLoggedIn from storage:', error);
            return false;
          }
        },
      },
    },
  })
);

syncObservable(
  store.isOnboardingComplete,
  persistOptions({
    persist: {
      name: 'isOnboardingComplete',
      transform: {
        save: (value) => {
          try {
            return JSON.stringify(value);
          } catch (error) {
            console.error('Error saving isOnboardingComplete to storage:', error);
            return JSON.stringify(false);
          }
        },
        load: (value) => {
          try {
            if (typeof value === 'boolean') {
              return value;
            }

            if (typeof value === 'string') {
              const parsed = JSON.parse(value);
              return parsed;
            }
            return false;
          } catch (error) {
            console.error('Error loading isOnboardingComplete from storage:', error);
            return false;
          }
        },
      },
    },
  })
);

const initializeStore = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  store.setIsInitialized(true);
};

initializeStore();

export default store;
