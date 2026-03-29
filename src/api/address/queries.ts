import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ApiResponse } from 'types';

import addressApi, { Address } from './api';
import { addressKeyFactory } from './key-factory';

export function useGetAddress(
  accountId: string,
  addressId: string,
  options?: UseQueryOptions<ApiResponse<Address>, Error>
) {
  return useQuery<ApiResponse<Address>, Error>({
    queryKey: [addressKeyFactory.address(addressId)],
    queryFn: () => addressApi.getAddress(accountId, addressId),
    enabled: !!accountId && !!addressId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
}

export function useGetAllAddresses(
  accountId: string,
  options?: UseQueryOptions<{ addresses: Address[] }, Error>
) {
  const query = useQuery<{ addresses: Address[] }, Error>({
    queryKey: [addressKeyFactory.addresses(accountId)],
    queryFn: () => addressApi.getAllAddresses(accountId),
    enabled: !!accountId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
  return {
    ...query,
    data: query.data?.addresses ?? [],
  };
}
