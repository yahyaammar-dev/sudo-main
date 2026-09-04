import { use$ } from '@legendapp/state/react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { TUser } from 'api/auth';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { userStore } from 'store';
import { Account, PasswordTokenInput } from 'swell-js';

import accountApi from './api';
import { accountKeyFactory } from './key-factory';
import { AccountVerificationResponse } from './types';
import swell from '../swell/client';

interface LoginCredentials {
  user: string;
  password: string | PasswordTokenInput;
}

export function useLogin(
  options?: UseMutationOptions<Account | null, AxiosError, LoginCredentials>
) {
  const queryClient = useQueryClient();

  return useMutation<Account | null, AxiosError, LoginCredentials>({
    mutationFn: ({ user, password }) => swell.account.login(user, password),
    onSuccess: (data) => {
      queryClient.setQueryData([accountKeyFactory.account], data);
      queryClient.invalidateQueries({ queryKey: [accountKeyFactory.session] });
    },
    ...options,
  });
}

export function useLogout(options?: UseMutationOptions<unknown, AxiosError>) {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError>({
    mutationFn: () => swell.account.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [accountKeyFactory.account] });
      queryClient.invalidateQueries({ queryKey: [accountKeyFactory.session] });
    },
    ...options,
  });
}

export function useGetSession(options?: UseQueryOptions<Record<string, unknown>, Error>) {
  return useQuery<Record<string, unknown>, Error>({
    queryKey: [accountKeyFactory.session],
    queryFn: () => swell.session.get(),
    staleTime: 0,
    gcTime: 0,

    ...options,
  });
}

// export function useGetAccount(options?: UseQueryOptions<Account | null, Error>) {
//   const { setAccount } = use$(userStore);
//   const { data, ...rest } = useQuery<Account | null, Error>({
//     queryKey: [accountKeyFactory.account],
//     queryFn: () => swell.account.get(),
//     staleTime: 0,
//     gcTime: 0,
//     ...options,
//   });

//   useEffect(() => {
//     if (rest.isSuccess && data) {
//       setAccount(data as TUser);
//     }
//   }, [rest.isSuccess, data, setAccount]);

//   return {
//     data: data || null,
//     ...rest,
//   };
// }

export function useDeleteAccount(
  options?: UseMutationOptions<{ success: boolean; message: string }, AxiosError, string>
) {
  return useMutation<{ success: boolean; message: string }, AxiosError, string>({
    mutationFn: (accountId: string) => accountApi.deleteAccount(accountId),
    ...options,
  });
}

export function useGetSessionCookie(): string | undefined {
  return swell.session.getCookie();
}

export function useAccountVerification(
  options?: UseQueryOptions<AccountVerificationResponse, Error>
) {
  const { account, setAccount } = use$(userStore);
  const { data, ...rest } = useQuery<AccountVerificationResponse, Error>({
    queryKey: accountKeyFactory.accountVerification(account?.id ?? ''),
    queryFn: () => accountApi.checkAccountVerification(account?.id ?? ''),
    enabled: !!account?.id,
    ...options,
  });
  useEffect(() => {
    if (rest.isSuccess && data) {
      setAccount({ ...account, isVerified: data.data.verified ?? false } as TUser);
    }
  }, [rest.isSuccess, data, setAccount]);
  return {
    data: data || null,
    ...rest,
  };
}
