import { useQuery, useQueries, UseQueryOptions } from '@tanstack/react-query';
import { Product, ProductQuery, ResultsResponse } from 'swell-js';
import { SwellPaginatedResponse, SwellProduct, SwellProductContent, SwellQuery } from 'types';

import productsApi from './api';
import { productsKeyFactory } from './key-factory';
import swell from '../swell/client';

export function useGetProductsByCategory(
  categoryId: string,
  query?: ProductQuery,
  options?: UseQueryOptions<ResultsResponse<Product>, Error>
) {
  return useQuery<ResultsResponse<Product>, Error>({
    queryKey: [productsKeyFactory.productsByCategory(categoryId)],
    queryFn: () =>
      swell.products.list({
        categories: [categoryId],
        limit: query?.limit || 25,
        page: query?.page || 1,
        sort: query?.sort,
        ...query,
      }),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

export function useGetProducts(
  query?: ProductQuery,
  options?: UseQueryOptions<ResultsResponse<Product>, Error>
) {
  return useQuery<ResultsResponse<Product>, Error>({
    queryKey: [productsKeyFactory.products, query],
    queryFn: () => swell.products.list(query),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

export function useGetFeaturedProducts(options?: UseQueryOptions<ResultsResponse<Product>, Error>) {
  const result = useQuery<ResultsResponse<Product>, Error>({
    queryKey: [productsKeyFactory.featuredProducts],
    queryFn: () =>
      swell.products.list({
        where: {
          'content.featured': true,
        },
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });

  return {
    ...result,
    data: {
      ...result.data,
      products: result.data?.results || [],
    },
  };
}

export function useGetProduct(
  id: string,
  query?: ProductQuery,
  options?: UseQueryOptions<Product & { content: SwellProductContent }, Error>
) {
  return useQuery<Product & { content: SwellProductContent }, Error>({
    queryKey: [productsKeyFactory.product(id)],
    queryFn: () =>
      swell.products.get(id, query) as Promise<Product & { content: SwellProductContent }>,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

export function useGetProductsByFactory(
  factoryId: string,
  query?: ProductQuery,
  options?: UseQueryOptions<ResultsResponse<Product>, Error>
) {
  return useQuery<ResultsResponse<Product>, Error>({
    queryKey: [productsKeyFactory.productsByFactory(factoryId)],
    queryFn: () =>
      swell.products.list({
        where: {
          ...query?.where,
          'content.factory_id': factoryId,
        },
        limit: query?.limit || 25,
        page: query?.page || 1,
        sort: query?.sort,
        ...query,
      }),
    enabled: !!factoryId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

export const useGetProductBySubCategory = (
  query?: SwellQuery,
  options?: UseQueryOptions<SwellPaginatedResponse<SwellProduct>, Error>
) => {
  const result = useQuery<SwellPaginatedResponse<SwellProduct>, Error>({
    queryKey: productsKeyFactory.productsBySubcategory(query),
    queryFn: () => productsApi.getBySubcategory(query),
    enabled: !!query?.subcategory_id && !!query?.limit && !!query?.page,
    staleTime: 5 * 60 * 1000,
    gcTime: 0,
    ...options,
  });

  return {
    ...result,
    data: result.data?.results || [],
  };
};

export const useGetProductByCategory = (
  query?: SwellQuery,
  options?: Omit<
    UseQueryOptions<
      {
        data: {
          products: SwellProduct[];
          page: number;
          total: number;
        };
      },
      Error
    >,
    'queryKey'
  >
) => {
  const result = useQuery<
    { data: { products: SwellProduct[]; page: number; total: number } },
    Error
  >({
    queryKey: ['products', 'category', query?.category_id, query?.limit, query?.page, query?.sort],
    queryFn: () => productsApi.getByCategory(query),
    enabled: !!query?.category_id && !!query?.limit && !!query?.page,
    staleTime: 5 * 60 * 1000,
    gcTime: 0,
    ...options,
  });

  return {
    ...result,
    data: result.data?.data.products || [],
  };
};

export const useGetProductsByCategories = (
  categoryIds: string[],
  query?: Omit<SwellQuery, 'category_id'>,
  enabled: boolean = true
) => {
  const results = useQueries({
    queries: categoryIds.map((categoryId) => ({
      queryKey: ['products', 'category', categoryId, query?.limit, query?.page, query?.sort],
      queryFn: () => productsApi.getByCategory({ ...query, category_id: categoryId }),
      enabled: enabled && !!categoryId && !!query?.limit && !!query?.page,
      staleTime: 5 * 60 * 1000,
      gcTime: 0,
    })),
  });

  const isLoading = results.some((q) => q.isLoading);
  const isFetching = results.some((q) => q.isFetching);
  const isError = results.some((q) => q.isError);
  const data = results.flatMap((q) => q.data?.data.products || []);

  return {
    data,
    isLoading,
    isFetching,
    isError,
    isRefetching: results.some((q) => q.isRefetching),
    queries: results,
  };
};
