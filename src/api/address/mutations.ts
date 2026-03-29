import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { ApiResponse } from 'types';

import addressApi, { Address, AddressData } from './api';
import { addressKeyFactory } from './key-factory';

export function useCreateAddress(
  options?: UseMutationOptions<
    ApiResponse<Address>,
    Error,
    { accountId: string; addressData: AddressData }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Address>, Error, { accountId: string; addressData: AddressData }>({
    mutationFn: ({ accountId, addressData }) => addressApi.createAddress(accountId, addressData),
    onSuccess: (_, { accountId }) => {
      queryClient.invalidateQueries({ queryKey: [addressKeyFactory.addresses(accountId)] });
    },
    ...options,
  });
}

export function useUpdateAddress(
  options?: UseMutationOptions<
    ApiResponse<Address>,
    Error,
    { accountId: string; addressId: string; addressData: Partial<AddressData> }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Address>,
    Error,
    { accountId: string; addressId: string; addressData: Partial<AddressData> }
  >({
    mutationFn: ({ accountId, addressId, addressData }) =>
      addressApi.updateAddress(accountId, addressId, addressData),
    onSuccess: (_, { accountId }) => {
      queryClient.invalidateQueries({ queryKey: [addressKeyFactory.addresses(accountId)] });
    },
    ...options,
  });
}

export function useDeleteAddress(
  options?: UseMutationOptions<
    ApiResponse<{ success: boolean }>,
    Error,
    { accountId: string; addressId: string }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<{ success: boolean }>,
    Error,
    { accountId: string; addressId: string }
  >({
    mutationFn: ({ accountId, addressId }) => addressApi.deleteAddress(accountId, addressId),
    onSuccess: (_, { accountId, addressId }) => {
      queryClient.removeQueries({ queryKey: [addressKeyFactory.address(addressId)] });
      queryClient.invalidateQueries({ queryKey: [addressKeyFactory.addresses(accountId)] });
    },
    ...options,
  });
}

export function useSetDefaultAddress(
  options?: UseMutationOptions<
    ApiResponse<Address>,
    Error,
    { accountId: string; addressId: string }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Address>, Error, { accountId: string; addressId: string }>({
    mutationFn: ({ accountId, addressId }) => addressApi.setDefaultAddress(accountId, addressId),
    onSuccess: (_, { accountId, addressId }) => {
      queryClient.invalidateQueries({ queryKey: [addressKeyFactory.address(addressId)] });
      queryClient.invalidateQueries({ queryKey: [addressKeyFactory.addresses(accountId)] });
    },
    ...options,
  });
}
