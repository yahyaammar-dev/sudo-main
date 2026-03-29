import { api } from 'api/axios.instance';
import { env } from 'config';
import { TrackingResponse, UserCountryResponse } from 'types';

export default {
  getTracking: async (trackingNumber: string): Promise<TrackingResponse> => {
    const response = await api.get(`/tracking`, {
      params: {
        api_key: env.trackingApiKey,
        number: trackingNumber,
      },
      baseURL: 'https://tracking.searates.com',
    });
    return response.data.data;
  },

  storeToken: async (fcm_token: string, account_id: string, lang: string): Promise<void> => {
    await api.post(`/api/notifications/store-token/${account_id}`, {
      fcm_token,
      lang,
    });
  },
  getEstimatedShipping: async (userId: string): Promise<UserCountryResponse> => {
    const response = await api.get(`/api/users/get-user-country/${userId}`);

    return response.data;
  },

  addSudoManagementFee: async (cartId: string, userId: string): Promise<void> => {
     const response = await api.post(`/api/checkout/add-custom-price-to-cart/${cartId}/${userId}`);
      return response.data;

  }

};
