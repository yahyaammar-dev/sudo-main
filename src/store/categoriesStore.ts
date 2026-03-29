import { observable } from '@legendapp/state';
import { Category } from 'swell-js';

type CategoryStoreState = {
  category: Category;
  categoriesById: {
    [key: string]: Category;
  };
};

type CategoryStoreActions = {
  setCategory: (category: Category) => void;
  setCategoriesById: (categoriesById: { [key: string]: Category }) => void;
};

const store = observable<CategoryStoreState & CategoryStoreActions>({
  category: {} as Category,
  categoriesById: {},
  setCategory: (category: Category) => {
    store.category.set(category);
  },
  setCategoriesById: (categoriesById: { [key: string]: Category }) => {
    store.categoriesById.set(categoriesById);
  },
});

export default store;
