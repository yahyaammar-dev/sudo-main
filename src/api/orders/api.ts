import { ApiResponse, SwellOrder } from 'types';

import { api } from '../axios.instance';

export default {
  getOrder: async (orderId: string): Promise<{ order: SwellOrder }> => {
    const response = await api.get(`/api/checkout/get-order-details`, {
      params: { orderId },
    });
    return response.data;
  },

  getAllOrders: async (userId: string): Promise<ApiResponse<SwellOrder[]>> => {
    const response = await api.get(`/api/account/get-all-orders/${userId}`);
    return response.data;
  },

  cancelOrder: async (orderId: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/api/catalogue/cancelorder/${orderId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/api/checkout/update-order-status/${orderId}`, {
      status,
    });
    return response.data;
  },

  updateTransferId: async (orderId: string, transferId: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/api/checkout/update-transfer-id/${orderId}`, {
      transfer_id: transferId,
    });
    return response.data;
  },
};
