import { observable } from '@legendapp/state';
import { Cart } from 'swell-js';

type CartStoreState = {
  cart: Cart | undefined;
  factoryId: string | undefined;
};

type CartStoreActions = {
  setCart: (cart: Cart) => void;
  resetCart: () => void;
  setFactoryId: (id: string) => void;
};

const store = observable<CartStoreState & CartStoreActions>({
  cart: undefined,
  factoryId: undefined,
  setCart: (cart) => {
    store.cart.set(cart);
  },
  resetCart: () => {
    store.factoryId.set(undefined);
    store.cart.set(undefined);
  },
  setFactoryId: (id) => {
    store.factoryId.set(id);
  },
});

export default store;
