import { observable } from '@legendapp/state';
import { SwellFactory, SwellProduct } from 'types/swell';

type FactoryStoreState = {
  factoryId: string | null;
  selectedFactory: SwellFactory | null;
  selectedSubCategory: string | undefined;
  subCategories: string[];
  products: {
    [key: string]: SwellProduct[];
  };
};

type FactoryStoreActions = {
  setFactoryId: (factoryId: string) => void;
  setSelectedFactory: (factory: SwellFactory) => void;
  setSelectedSubCategory: (subCategory?: string) => void;
  setSubCategories: (subCategories: string[]) => void;
  setProducts: (products: { [key: string]: SwellProduct[] }) => void;
};

const store = observable<FactoryStoreState & FactoryStoreActions>({
  factoryId: null,
  selectedFactory: null,
  selectedSubCategory: undefined,
  subCategories: [],
  products: {},
  setFactoryId: (factoryId: string) => {
    store.factoryId.set(factoryId);
  },
  setSelectedFactory: (factory: SwellFactory) => {
    store.selectedFactory.set(factory);
  },
  setSelectedSubCategory: (subCategory?: string) => {
    store.selectedSubCategory.set(subCategory);
  },
  setSubCategories: (subCategories: string[]) => {
    store.subCategories.set(subCategories);
  },

  setProducts: (products: { [key: string]: SwellProduct[] }) => {
    store.products.set(products);
  },
});

export default store;
