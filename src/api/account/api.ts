import { api } from '../axios.instance';
import { AccountVerificationResponse } from './types';

export default {
  checkAccountVerification: async (accountId: string): Promise<AccountVerificationResponse> => {
    const response = await api.get(`/api/auth/check-verification/${accountId}`);
    return response.data;
  },
};
