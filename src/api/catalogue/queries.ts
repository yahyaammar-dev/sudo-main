import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { SwellProduct, ApiResponse, SwellQuery } from 'types';
import { ProductSearchResponse, SwellFactory, SwellSearchProduct } from 'types/swell';

import catalogueApi from './api';
import { catalogueKeyFactory } from './key-factory';

export function useSearchProducts(
  query?: SwellQuery,
  options?: UseQueryOptions<ProductSearchResponse, Error>
) {
  return useQuery<ProductSearchResponse, Error>({
    queryKey: [catalogueKeyFactory.searchProducts, query],
    queryFn: () => catalogueApi.searchProducts(query),
    enabled: !!query?.search,
    staleTime: 0,
    gcTime: 0,
    ...options,
  });
}

export function useGetFeaturedProducts(
  payload: {
    account: string;
    page: number;
    limit: number;
  },
  options?: UseQueryOptions<{ products: SwellProduct[] }, Error>
) {
  const { data, ...rest } = useQuery<{ products: SwellProduct[] }, Error>({
    queryKey: catalogueKeyFactory.featuredProducts(payload),
    queryFn: () => catalogueApi.featuredProducts(payload),
    enabled: !!payload.account && payload.page > 0,
    staleTime: 0,
    gcTime: 0,
    placeholderData: { products: [] },
    refetchOnWindowFocus: true,
    ...options,
  });
  return { data: data?.products || [], ...rest };
}

export function useGetFactories(options?: UseQueryOptions<ApiResponse<SwellFactory[]>, Error>) {
  const { data, ...rest } = useQuery<ApiResponse<SwellFactory[]>, Error>({
    queryKey: [catalogueKeyFactory.factories],
    queryFn: () => catalogueApi.getFactories(),
    staleTime: 0,
    gcTime: 0,
    ...options,
  });
  return { data: data?.data, ...rest };
}

export function useGetProductsByFactory(
  factoryId: string,
  accountId?: string,
  options?: UseQueryOptions<
    {
      groupedProducts: {
        [key: string]: SwellProduct[];
      };
      factory: SwellFactory | null;
    },
    Error
  >
) {
  return useQuery<
    {
      groupedProducts: {
        [key: string]: SwellProduct[];
      };
      factory: SwellFactory | null;
    },
    Error
  >({
    queryKey: [catalogueKeyFactory.byFactory(factoryId), accountId],
    queryFn: () => catalogueApi.getByFactory(factoryId, accountId),
    enabled: !!factoryId,
    staleTime: 0,
    gcTime: 0,
    placeholderData: {
      groupedProducts: {},
      factory: null as unknown as SwellFactory,
    },
    ...options,
  });
}

export function useGetProductDetails(
  productId: string,
  account: string,
  options?: UseQueryOptions<{ product: SwellSearchProduct }, Error>
) {
  const result = useQuery<{ product: SwellSearchProduct }, Error>({
    queryKey: [catalogueKeyFactory.productDetails(productId), account],
    queryFn: () => catalogueApi.getProductDetails(productId, account),
    enabled: !!productId && !!account,
    staleTime: 5 * 60 * 1000,
    gcTime: 0,
    ...options,
  });
  return {
    ...result,
    data: result.data?.product,
  };
}
