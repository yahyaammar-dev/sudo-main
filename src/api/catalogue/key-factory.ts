export const catalogueKeyFactory = {
  searchProducts: 'catalogue-search-products',
  featuredProducts: (payload: { account: string; page: number; limit: number }) => [
    'catalogue-featured-products',
    payload.account,
    payload.page,
    payload.limit,
  ],
  factories: 'catalogue-factories',
  byFactory: (factoryId: string) => `catalogue-by-factory-${factoryId}`,
  productDetails: (productId: string, account?: string) => [
    'catalogue-product-details',
    productId,
    account,
  ],
} as const;
