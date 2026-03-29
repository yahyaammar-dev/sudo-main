import { SwellQuery, ApiResponse, SwellProduct } from 'types';
import { ProductSearchResponse, SwellFactory, SwellSearchProduct } from 'types/swell';

import { api } from '../axios.instance';

export default {
  searchProducts: async (query?: SwellQuery): Promise<ProductSearchResponse> => {
    const params = {
      q: query?.search,
      ...query,
    };

    const response = await api.get('/api/catalogue/search-products', { params });
    return response.data;
  },

  featuredProducts: async (payload: {
    page: number;
    limit: number;
    account: string;
  }): Promise<{ products: SwellProduct[] }> => {
    const response = await api.get('/api/catalogue/featured-products', {
      params: { ...payload },
    });
    return response.data;
  },

  getFactories: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/api/catalogue/factories');
    return response.data;
  },

  getByFactory: async (
    factoryId: string,
    accountId?: string
  ): Promise<{
    groupedProducts: {
      [key: string]: SwellProduct[];
    };
    factory: SwellFactory | null;
  }> => {
    if (!factoryId) {
      throw new Error('Factory ID is required');
    }

    const response = await api.get(`/api/catalogue/by-factory/${factoryId}/${accountId}`, {
      params: { factoryId },
    });
    return response.data;
  },

  cancelOrder: async (orderId: string): Promise<ApiResponse<any>> => {
    if (!orderId) {
      throw new Error('Order ID is required');
    }

    const response = await api.get(`/api/catalogue/cancelorder/${orderId}`);
    return response.data;
  },
  getProductDetails: async (
    productId: string,
    account: string
  ): Promise<{ product: SwellSearchProduct }> => {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    const response = await api.get(`/api/catalogue/productDetails/${productId}`, {
      params: { account },
    });

    return response.data;
  },
};
