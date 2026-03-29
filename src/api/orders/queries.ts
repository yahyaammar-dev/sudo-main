import { useQuery } from '@tanstack/react-query';
import { ApiResponse, SwellOrder } from 'types';

import ordersApi from './api';
import { ordersKeyFactory } from './key-factory';

export function useGetOrder(orderId: string) {
  const query = useQuery<{ order: SwellOrder }>({
    queryKey: [ordersKeyFactory.getOrder(orderId)],
    queryFn: () => ordersApi.getOrder(orderId),
    enabled: !!orderId,
    refetchOnWindowFocus: true,
  });
  return {
    ...query,
    data: query.data?.order,
  };
}

export function useGetAllOrders(userId: string) {
  return useQuery<ApiResponse<SwellOrder[]>>({
    queryKey: [ordersKeyFactory.getAllOrders(userId)],
    queryFn: () => ordersApi.getAllOrders(userId),
    enabled: !!userId,
    refetchOnWindowFocus: true,
  });
}
