import { api } from '../axios.instance';
import { AccountVerificationResponse } from './types';

export default {
  checkAccountVerification: async (accountId: string): Promise<AccountVerificationResponse> => {
    const response = await api.get(`/api/auth/check-verification/${accountId}`);
    return response.data;
  },
  deleteAccount: async (accountId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/api/account/delete-account/${accountId}`);
    return response.data;
  },
};
