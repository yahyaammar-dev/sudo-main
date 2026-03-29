import { SwellQuery } from 'types';

export const productsKeyFactory = {
  product: (id: string) => ['product', id],
  productsByCategory: (categoryId: string) => ['products', 'category', categoryId],
  productsByFactory: (factoryId: string) => ['products', 'factory', factoryId],
  productsBySubcategory: (query?: SwellQuery) => [
    'products',
    'subcategory',
    query?.subcategory_id,
    query?.limit,
    query?.page,
  ],
  products: 'products',
  featuredProducts: 'featured-products',
} as const;
