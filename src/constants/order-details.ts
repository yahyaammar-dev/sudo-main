import { translate } from 'helpers';
import { OrderStatus } from 'types';

export const getStatusMessage = (orderStatus: OrderStatus) => {
  switch (orderStatus) {
    case OrderStatus.OrderPlaced:
      return translate('orderPlacedDescription');
    case OrderStatus.PaymentRequired:
      return translate('waitingForPaymentDescription');
    case OrderStatus.PendingPayment:
    case OrderStatus.PaymentPending:
      return translate('pendingPaymentDescription');
    case OrderStatus.PaymentReceived:
    case OrderStatus.PaymentRecieved:
      return translate('paymentReceivedDescription');
    case OrderStatus.OrderInspected:
      return translate('orderInspectedDescription');
    case OrderStatus.OrderShipped:
      return translate('orderShippedDescription');
    case OrderStatus.OrderCancelled:
      return translate('orderCancelledDescription');
    case OrderStatus.OrderReturned:
      return translate('orderReturnedDescription');
    case OrderStatus.OrderDelivered:
      return translate('orderDeliveredDescription');
    default:
      return translate('processingOrderDescription');
  }
};

export const getStatusTitle = (orderStatus: OrderStatus) => {
  switch (orderStatus) {
    case OrderStatus.PaymentRequired:
      return translate('waitingForPayment');
    case OrderStatus.PendingPayment:
    case OrderStatus.PaymentPending:
      return translate('awaitingBankConfirmation');
    case OrderStatus.PaymentReceived:
    case OrderStatus.PaymentRecieved:
      return translate('productionInProgress');
    case OrderStatus.OrderInspected:
      return translate('inspectionApproved');
    case OrderStatus.OrderShipped:
      return translate('orderShipped');
    case OrderStatus.OrderCancelled:
      return translate('orderCancelled');
    case OrderStatus.OrderReturned:
      return translate('orderReturned');
    default:
      return translate('processingOrder');
  }
};

export const getStatusColor = (orderStatus: OrderStatus) => {
  switch (orderStatus) {
    case OrderStatus.PaymentRequired:
    case OrderStatus.OrderCancelled:
    case OrderStatus.Canceled:
      return '#FF0505';
    case OrderStatus.PendingPayment:
    case OrderStatus.Pending:
    case OrderStatus.PaymentPending:
      return '#FF7816';
    default:
      return '#000';
  }
};

export const orderStatusText: Record<OrderStatus, string> = {
  [OrderStatus.OrderPlaced]: translate('orderPlaced'),
  [OrderStatus.PaymentRequired]: translate('paymentRequired'),
  [OrderStatus.PendingPayment]: translate('pendingPayment'),
  [OrderStatus.PaymentPending]: translate('pendingPayment'),
  [OrderStatus.PaymentReceived]: translate('paymentReceived'),
  [OrderStatus.PaymentRecieved]: translate('paymentReceived'),
  [OrderStatus.OrderInspected]: translate('orderInspected'),
  [OrderStatus.OrderShipped]: translate('orderShipped'),
  [OrderStatus.OrderCancelled]: translate('orderCancelled'),
  [OrderStatus.OrderReturned]: translate('orderReturned'),
  [OrderStatus.OrderDelivered]: translate('orderDelivered'),
  [OrderStatus.Pending]: translate('pendingPayment'),
  [OrderStatus.Canceled]: translate('orderCancelled'),
};

export const canCancel = { [OrderStatus.PaymentRequired]: true, [OrderStatus.OrderPlaced]: true };
export const viewDocuments = {
  [OrderStatus.OrderShipped]: true,
  [OrderStatus.PaymentReceived]: true,
  [OrderStatus.PaymentRecieved]: true,
  [OrderStatus.OrderDelivered]: true,
};
