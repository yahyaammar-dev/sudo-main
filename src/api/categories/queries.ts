import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Category, ResultsResponse } from 'swell-js';
import { SwellCategory, SwellPaginatedResponse } from 'types';

import categoriesApi from './api';
import { categoriesKeyFactory } from './key-factory';
import swell from '../swell/client';

export function useGetCategories(
  query?: object,
  options?: UseQueryOptions<ResultsResponse<Category>, Error>
) {
  const result = useQuery<ResultsResponse<Category>, Error>({
    queryKey: [categoriesKeyFactory.categories, query],
    queryFn: () =>
      swell.categories.list({
        where: {
          active: true,
        },
        parent_id: null,
        ...query,
      }),
    staleTime: 0,
    gcTime: 0,
    ...options,
  });

  return {
    ...result,
    data: result.data?.results ?? [],
    isLoading: result.isLoading,
    error: result.error,
  };
}

export function useGetCategory(id: string, options?: UseQueryOptions<Category | null, Error>) {
  return useQuery<Category | null, Error>({
    queryKey: [categoriesKeyFactory.category(id)],
    queryFn: () => swell.categories.get(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

export function useGetSubcategories(
  parentId: string,
  options?: UseQueryOptions<SwellPaginatedResponse<SwellCategory>, Error>
) {
  const result = useQuery<SwellPaginatedResponse<SwellCategory>, Error>({
    queryKey: [categoriesKeyFactory.subcategories(parentId)],
    queryFn: () => categoriesApi.getSubcategories(parentId),
    enabled: !!parentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });

  return {
    ...result,
    data: result.data?.results ?? [],
    isLoading: result.isLoading,
    error: result.error,
  };
}
