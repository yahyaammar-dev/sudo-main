import { use$ } from '@legendapp/state/react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { userStore } from 'store';
import { Cart } from 'swell-js';

import { cartKeyFactory } from './key-factory';
import swell from '../swell/client';

export function useGetCart(options?: UseQueryOptions<Cart | null, Error>) {
  const { account } = use$(userStore);

  const result = useQuery<Cart | null, Error>({
    queryKey: [cartKeyFactory.cart, account?.id],
    queryFn: async () => await swell.cart.get(),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    enabled: !!account?.id,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    ...options,
  });

  return result;
}

export function useGetShippingRates() {
  const { account } = use$(userStore);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const result = useQuery({
    queryKey: [cartKeyFactory.shippingRates, account?.id],
    queryFn: async () => await swell.cart.getShippingRates(),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    enabled: !!account?.id,
  });

  useEffect(() => {
    const service = (result.data as { services: { id: string }[] })?.services.find(
      (service: { id: string }) => service.id === 'local_pickup'
    );
    setServiceId(service?.id ?? null);
  }, [result.data]);
  return {
    ...result,
    serviceId,
  };
}
