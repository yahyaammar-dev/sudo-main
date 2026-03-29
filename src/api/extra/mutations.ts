import { use$ } from '@legendapp/state/react';
import { useMutation } from '@tanstack/react-query';
import { localizationStore, userStore } from 'store';

import extraApi from './api';

export const useStoreToken = () => {
  const { account } = use$(userStore);
  const { language } = use$(localizationStore);
  return useMutation({
    mutationFn: async (token: string) => {
      return await extraApi.storeToken(token, account?.id ?? '', language ?? 'en');
    },
  });
};

export const useAddSudoManagementFee = () => {
  const { account } = use$(userStore);
  return useMutation({
    mutationFn: async (cartId: string) => {
      if (!cartId) console.log('Cart ID is missing');
      return await extraApi.addSudoManagementFee(cartId, account?.id ?? '');
    },

    onError(error, variables, context) {
      console.log('Error adding Sudo management fee');
    },
    onSuccess(data, variables, context) {
      console.log('Successfully added Sudo management fee', data);
    },
  });
}