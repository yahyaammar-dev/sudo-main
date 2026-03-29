import { SwellQuery } from 'types';
import { SwellPaginatedResponse, SwellProduct } from 'types/swell';

import { api } from '../axios.instance';
import swell from '../swell/client';

export default {
  getBySubcategory: async (query?: SwellQuery): Promise<SwellPaginatedResponse<SwellProduct>> => {
    if (!query?.subcategory_id) {
      throw new Error('Subcategory slug is required');
    }

    return await swell.get('/products', {
      page: query?.page || 1,
      where: {
        categories: query.subcategory_id,
      },
      limit: query?.limit || 50,
    });
  },
  getByCategory: async (
    query?: SwellQuery
  ): Promise<{ data: { products: SwellProduct[]; page: number; total: number } }> => {
    if (!query?.category_id) {
      throw new Error('Category slug is required');
    }

    return await api.get(`api/catalogue/byCategory/${query.category_id}`, {
      params: {
        page: query?.page || 1,
        limit: query?.limit || 50,
        sort: query?.sort || 'a-z',
      },
    });
  },
};
