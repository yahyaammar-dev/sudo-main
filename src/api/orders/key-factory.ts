export const ordersKeyFactory = {
  getOrder: (id: string) => ['order', id],
  getAllOrders: (userId: string) => `orders-${userId}`,
  cancelOrder: (id: string) => `cancel-order-${id}`,
  updateOrderStatus: (id: string) => `update-order-status-${id}`,
  updateTransferId: (id: string) => `update-transfer-id-${id}`,
};
