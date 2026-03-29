import { ApiResponse } from 'types';

import { api } from '../axios.instance';

export interface AddressData {
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  parent_id: string;
}

export interface Address extends AddressData {
  id: string;
  account_id: string;
  date_created: string;
  date_updated: string;
}

export default {
  getAddress: async (accountId: string, addressId: string): Promise<ApiResponse<Address>> => {
    if (!accountId || !addressId) {
      throw new Error('Account ID and Address ID are required');
    }
    const response = await api.get<ApiResponse<Address>>(
      `/api/account/${accountId}/addresses/${addressId}`
    );
    return response.data;
  },

  getAllAddresses: async (accountId: string): Promise<{ addresses: Address[] }> => {
    if (!accountId) {
      throw new Error('Account ID is required');
    }
    const response = await api.get<{ addresses: Address[] }>(`/api/account/${accountId}/addresses`);
    return response.data;
  },

  createAddress: async (
    accountId: string,
    addressData: AddressData
  ): Promise<ApiResponse<Address>> => {
    if (!accountId) {
      throw new Error('Account ID is required');
    }
    const response = await api.post<ApiResponse<Address>>(`/api/account/addresses`, addressData);
    return response.data;
  },

  updateAddress: async (
    accountId: string,
    addressId: string,
    addressData: Partial<AddressData>
  ): Promise<ApiResponse<Address>> => {
    if (!accountId || !addressId) {
      throw new Error('Account ID and Address ID are required');
    }
    const response = await api.put<ApiResponse<Address>>(
      `/api/account/addresses/${addressId}`,
      addressData
    );
    return response.data;
  },

  deleteAddress: async (
    accountId: string,
    addressId: string
  ): Promise<ApiResponse<{ success: boolean }>> => {
    if (!accountId || !addressId) {
      throw new Error('Account ID and Address ID are required');
    }
    const response = await api.delete<ApiResponse<{ success: boolean }>>(
      `/api/account/${accountId}/addresses/${addressId}`
    );
    return response.data;
  },

  setDefaultAddress: async (
    accountId: string,
    addressId: string
  ): Promise<ApiResponse<Address>> => {
    if (!accountId || !addressId) {
      throw new Error('Account ID and Address ID are required');
    }
    const response = await api.patch<ApiResponse<Address>>(
      `/api/account/${accountId}/addresses/${addressId}/default`
    );
    return response.data;
  },
};
