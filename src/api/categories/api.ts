import { SwellPaginatedResponse, SwellQuery } from 'types';
import { SwellCategory } from 'types/swell';

import swell from '../swell/client';

export default {
  get: async (id: string): Promise<SwellCategory> => {
    if (!id) {
      throw new Error('Category ID is required');
    }
    return await swell.categories.get(id);
  },

  list: async (query?: SwellQuery): Promise<SwellPaginatedResponse<SwellCategory>> => {
    const defaultQuery = {
      limit: 25,
      page: 1,
      ...query,
    };
    return await swell.categories.list(defaultQuery);
  },

  getSubcategories: async (parentId: string): Promise<SwellPaginatedResponse<SwellCategory>> => {
    if (!parentId) {
      throw new Error('Parent category ID is required');
    }

    return await swell.get('/categories', {
      where: { parent_id: parentId },
      limit: 100,
      page: 1,
    });
  },
};
