import { use$ } from '@legendapp/state/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showErrorToast, showSuccessToast } from 'lib/toast';
import { userStore } from 'store';
import { OrderStatus, SwellOrder } from 'types';

import ordersApi from './api';
import { ordersKeyFactory } from './key-factory';
export function useCancelOrder() {
  const queryClient = useQueryClient();
  const { account } = use$(userStore);
  return useMutation({
    mutationFn: (orderId: string) => ordersApi.cancelOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.setQueryData(
        [ordersKeyFactory.getOrder(orderId)],
        (data: SwellOrder | undefined) => {
          if (!data) {
            return data;
          }
          return {
            ...data,
            order: { ...data.order, status: OrderStatus.OrderCancelled },
          };
        }
      );
      const allOrdersKey = [ordersKeyFactory.getAllOrders(account?.id as string)];
      queryClient.setQueryData(allOrdersKey, (oldData: { orders: SwellOrder[] } | undefined) => {
        if (!oldData || !Array.isArray(oldData.orders)) {
          return oldData;
        }
        return {
          ...oldData,
          orders: oldData.orders.map((order: SwellOrder) =>
            order.id === orderId ? { ...order, status: OrderStatus.OrderCancelled } : order
          ),
        };
      });
      showSuccessToast('Order cancelled successfully');
    },
    onError: () => {
      showErrorToast('Failed to cancel order');
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      ordersApi.updateOrderStatus(orderId, status),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: [ordersKeyFactory.getOrder(orderId)] });
      showSuccessToast('Order status updated successfully');
    },
    onError: () => {
      showErrorToast('Failed to update order status');
    },
  });
}

export function useUpdateTransferId() {
  const queryClient = useQueryClient();
  const { mutate: updateOrderStatus } = useUpdateOrderStatus();

  return useMutation({
    mutationFn: ({ orderId, transferId }: { orderId: string; transferId: string }) =>
      ordersApi.updateTransferId(orderId, transferId),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: [ordersKeyFactory.getOrder(orderId)] });
      showSuccessToast('Transfer ID updated successfully');
      updateOrderStatus({
        orderId,
        status: OrderStatus.PaymentPending,
      });
    },
    onError: () => {
      showErrorToast('Failed to update transfer ID');
    },
  });
}
