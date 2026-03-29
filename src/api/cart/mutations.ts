import { use$ } from '@legendapp/state/react';
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { showErrorToast, showSuccessToast } from 'lib/toast';
import { factoryStore, userStore } from 'store';
import { Cart, CartItem, ErrorResponse, Order } from 'swell-js';
import { OrderStatus } from 'types';

import { env } from 'config';

import { cartKeyFactory } from './key-factory';
import { useUpdateOrderStatus } from '../orders/mutations';
import swell from '../swell/client';

export function useAddCartItem(
  options?: UseMutationOptions<Cart | ErrorResponse, Error, Partial<CartItem>>
) {
  const queryClient = useQueryClient();
  const { account } = use$(userStore);
  const { setFactoryId } = use$(factoryStore);
  const { mutateAsync: updateCart } = useUpdateCart();
  return useMutation<Cart | ErrorResponse, Error, Partial<CartItem>>({
    mutationFn: (item) => swell.cart.addItem(item),
    onSuccess: (data) => {
      const queryKey = [cartKeyFactory.cart, account?.id];
      queryClient.invalidateQueries({
        queryKey,
        exact: true,
      });
      queryClient.setQueryData(queryKey, data);
      const requiredBillingFields = [
        'name',
        'address1',
        'city',
        'state',
        'zip',
        'country',
        'phone',
        'first_name',
        'last_name',
      ];
      const hasCompleteBilling =
        data &&
        'billing' in data &&
        requiredBillingFields.every((field) => data.billing?.[field as keyof typeof data.billing]);

      if (!hasCompleteBilling) {
        updateCart({
          billing: {
            name: account?.billing?.name,
            address1: account?.billing?.address1,
            address2: account?.billing?.address2,
            city: account?.billing?.city,
            state: account?.billing?.state,
            zip: account?.billing?.zip,
            country: account?.billing?.country,
            first_name: account?.billing?.first_name,
            last_name: account?.billing?.last_name,
          },
        });
      }
      if (
        data &&
        'billing' in data &&
        requiredBillingFields.every((field) => data.billing?.[field as keyof typeof data.billing])
      ) {
        updateCart({
          billing: data?.billing,
        });
      }
      if (data && 'items' in data) {
        setFactoryId(data?.items?.[0]?.product?.content?.factoryId as string);
      }
      showSuccessToast('Item added to cart successfully');
    },
    onError: () => {
      showErrorToast('Failed to add item to cart');
    },
    ...options,
  });
}

export function useClearCart(options?: UseMutationOptions<Cart | ErrorResponse, Error>) {
  const queryClient = useQueryClient();
  const { account } = use$(userStore);

  return useMutation<Cart | ErrorResponse, Error>({
    mutationFn: () => swell.cart.setItems([]),
    onSuccess: (data) => {
      const queryKey = [cartKeyFactory.cart, account?.id];
      queryClient.invalidateQueries({
        queryKey,
        exact: true,
      });
      queryClient.setQueryData(queryKey, data);
      showSuccessToast('Cart cleared successfully');
    },
    onError: () => {
      showErrorToast('Failed to clear cart');
    },
    ...options,
  });
}

export function useUpdateCartItem(
  options?: UseMutationOptions<Cart | ErrorResponse, Error, { itemId: string; item: CartItem }>
) {
  const queryClient = useQueryClient();
  const { account } = use$(userStore);

  return useMutation<Cart | ErrorResponse, Error, { itemId: string; item: CartItem }>({
    mutationFn: ({ itemId, item }) => swell.cart.updateItem(itemId, item),
    onSuccess: (data) => {
      const queryKey = [cartKeyFactory.cart, account?.id];
      queryClient.setQueryData(queryKey, data);
      queryClient.invalidateQueries({ queryKey, exact: true });
      showSuccessToast('Cart item updated successfully');
    },
    onError: () => {
      showErrorToast('Failed to update cart item');
    },
    ...options,
  });
}

export function useRemoveCartItem(
  options?: UseMutationOptions<Cart | ErrorResponse, Error, string>
) {
  const queryClient = useQueryClient();
  const { account } = use$(userStore);

  return useMutation<Cart | ErrorResponse, Error, string>({
    mutationFn: (itemId) => swell.cart.removeItem(itemId),
    onSuccess: (data) => {
      const queryKey = [cartKeyFactory.cart, account?.id];
      queryClient.setQueryData(queryKey, data);
      queryClient.invalidateQueries({ queryKey, exact: true });
      showSuccessToast('Item removed from cart successfully');
    },
    onError: () => {
      showErrorToast('Failed to remove item from cart');
    },
    ...options,
  });
}

export function useUpdateCart(options?: UseMutationOptions<Cart | null, Error, object>) {
  const queryClient = useQueryClient();
  return useMutation<Cart | null, Error, object>({
    mutationFn: (payload) => {
      return swell.cart.update(payload);
    },
    onSuccess: (data) => {
      queryClient.setQueryData([cartKeyFactory.cart], data);
    },
    ...options,
  });
}

export function useApplyCoupon(options?: UseMutationOptions<Cart, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, string>({
    mutationFn: (code) => swell.cart.applyCoupon(code),
    onSuccess: (data) => {
      queryClient.setQueryData([cartKeyFactory.cart], data);
    },
    ...options,
  });
}

export function useRemoveCoupon(options?: UseMutationOptions<Cart, Error>) {
  const queryClient = useQueryClient();

  return useMutation<Cart, Error>({
    mutationFn: () => swell.cart.removeCoupon(),
    onSuccess: (data) => {
      queryClient.setQueryData([cartKeyFactory.cart], data);
    },
    ...options,
  });
}

export function useSubmitOrder(options?: UseMutationOptions<Order, Error>) {
  const queryClient = useQueryClient();
  const { mutate: updateOrderStatus } = useUpdateOrderStatus();
  const { account } = use$(userStore);

  return useMutation<Order, Error>({
    mutationFn: async () => {
      // Always re-authenticate Swell session before submitting
      const email = account?.email;
      if (!email) {
        throw new Error('You must be logged in to place an order');
      }

      console.log('[submitOrder] Authenticating Swell session for:', email);
      const loginResult = await swell.account.login(email, env.swellPublicKey);

      if (!loginResult || !('email' in loginResult)) {
        console.error('[submitOrder] Login failed:', loginResult);
        throw new Error('Failed to authenticate. Please log out and log back in.');
      }

      // Ensure billing info is complete — copy from shipping if missing
      const cart = await swell.cart.get() as Cart & { guest?: boolean; accountLoggedIn?: boolean };
      console.log('[submitOrder] After login - guest:', cart?.guest, 'accountLoggedIn:', cart?.accountLoggedIn);

      const billing = cart?.billing;
      const hasBilling = billing && billing.name && billing.address1 && billing.city && billing.country;
      if (!hasBilling && cart?.shipping) {
        console.log('[submitOrder] Billing incomplete, copying from shipping');
        await swell.cart.update({
          billing: {
            name: cart.shipping.name,
            firstName: cart.shipping.firstName,
            lastName: cart.shipping.lastName,
            address1: cart.shipping.address1,
            address2: cart.shipping.address2,
            city: cart.shipping.city,
            state: cart.shipping.state,
            zip: cart.shipping.zip,
            country: cart.shipping.country,
            phone: cart.shipping.phone,
          },
        });
      }

      try {
        return await swell.cart.submitOrder();
      } catch (err: unknown) {
        const e = err as Error & { status?: number; code?: string; param?: string };
        console.error('[submitOrder] Error:', { status: e?.status, code: e?.code, param: e?.param, message: e?.message });
        throw err;
      }
    },
    onSuccess: (data) => {
      updateOrderStatus({
        orderId: data.id as string,
        status: OrderStatus.OrderPlaced,
      });
      queryClient.setQueryData([cartKeyFactory.cart], data);
      showSuccessToast('Order submitted successfully');
    },
    onError: (error: unknown) => {
      // Extract detailed error info for the toast
      const err = error as Error & { code?: string; errors?: Record<string, unknown> };
      console.error('[submitOrder] onError handler:', {
        message: err?.message,
        code: err?.code,
        errors: err?.errors,
        full: err,
      });

      let errorMessage = 'Order submission failed';
      if (err?.errors && typeof err.errors === 'object') {
        // Swell returns field-level errors like { "shipping.phone": { message: "required" } }
        const fieldErrors = Object.entries(err.errors)
          .map(([field, val]) => {
            const msg = typeof val === 'object' && val !== null && 'message' in val
              ? (val as { message: string }).message
              : String(val);
            return `${field}: ${msg}`;
          })
          .join(', ');
        errorMessage = fieldErrors || err?.message || errorMessage;
      } else if (err?.message && err.message !== 'required') {
        errorMessage = err.message;
      } else if (err?.message === 'required') {
        errorMessage = 'A required field is missing — check console logs for details';
      }

      showErrorToast(errorMessage);
    },
    ...options,
  });
}
