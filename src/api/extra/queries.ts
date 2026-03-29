import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import swell from 'api/swell/client';
import { useCallback } from 'react';
import { TrackingResponse, UserCountryResponse } from 'types';

import extraApi from './api';
import { extraKeyFactory } from './key-factory';
import { use$ } from '@legendapp/state/react';
import { userStore } from 'store';

export function useGetBanners(options?: UseQueryOptions<{ results: swell.Content[] }, Error>) {
  return useQuery<{ results: swell.Content[] } | any, Error>({
    queryFn: async () =>
      await swell.content.get('banners', {
        where: {
          active: true,
        },
        limit: 1,
        ...options,
      } as any),
    queryKey: [extraKeyFactory.banners],
    select: useCallback((data: any) => {
      return {
        results: data?.results || [],
      };
    }, []),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useGetBanking(options?: UseQueryOptions<{ results: swell.Content[] }, Error>) {
  return useQuery<{ results: swell.Content[] } | any, Error>({
    queryFn: async () =>
      await swell.content.get('banking', {
        ...options,
        limit: 1,
      } as any),
    queryKey: [extraKeyFactory.banking],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useGetProtection(options?: UseQueryOptions<{ results: swell.Content[] }, Error>) {
  return useQuery<{ results: swell.Content[] } | any, Error>({
    queryFn: async () =>
      await swell.content.get('protection', {
        ...options,
        limit: 1,
      } as any),
    queryKey: [extraKeyFactory.protection],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export const useGetTracking = (
  tracking_number: string,
  options?: UseQueryOptions<TrackingResponse, Error>
) => {
  const query = useQuery<TrackingResponse, Error>({
    queryFn: async () => await extraApi.getTracking(tracking_number),
    queryKey: [extraKeyFactory.tracking(tracking_number)],
    staleTime: 0,
    gcTime: 0,
    enabled: !!tracking_number,
    ...options,
  });
  return {
    ...query,
    data: query.data,
  };
};

export const useGetEstimatedShipping = (
  options?: UseQueryOptions<UserCountryResponse, Error>
) => {
  const userId = use$(userStore).account?.id;
  return useQuery<UserCountryResponse, Error>({
    queryKey: [extraKeyFactory.estimatedShipping(userId!)],
    queryFn: () => extraApi.getEstimatedShipping(userId!),
    enabled: !!userId,
    ...options,
  });
};
