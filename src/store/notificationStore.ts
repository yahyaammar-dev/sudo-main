import { observable } from '@legendapp/state';

type NotificationStoreState = {
  token: string | null;
};

type NotificationStoreActions = {
  setToken: (token: string) => void;
};

const notificationStore = observable<NotificationStoreState & NotificationStoreActions>({
  token: null,
  setToken: (token) => {
    notificationStore.token.set(token);
  },
});

export default notificationStore;
