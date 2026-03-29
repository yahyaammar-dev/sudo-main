import { api } from '../axios.instance';
import { OtpResponse, RegisterPayload, SendOtpPayload } from './types';

export default {
  sendOtp: async (payload: SendOtpPayload) => {
    try {
      const response = await api.post<OtpResponse>('/api/users/send-otp-via-whatsapp', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  register: async (payload: RegisterPayload) => {
    const response = await api.post<any>('/api/auth/register-user', payload);
    return response.data;
  },
};
