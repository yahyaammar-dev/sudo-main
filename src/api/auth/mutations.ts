import { use$ } from '@legendapp/state/react';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { accountKeyFactory } from 'api/account/key-factory';
import { AxiosError } from 'axios';
import { router } from 'expo-router';
import { Routes } from 'routers';
import { userStore } from 'store';

import { api } from '../axios.instance';
import apis from './api';
import {
  OtpResponse,
  SendOtpPayload,
  VerifyOtpPayload,
  VerifyOtpResponse,
  LogoutResponse,
  LogoutPayload,
  RegisterPayload,
  RegisterResponse,
} from './types';

export const useSendOtp = (
  options?: UseMutationOptions<OtpResponse, AxiosError, SendOtpPayload>
) => {
  const { userInfo, setUserInfo } = use$(userStore);

  const mutation = useMutation<OtpResponse, AxiosError, SendOtpPayload>({
    mutationFn: async (payload: SendOtpPayload) => {
      return await apis.sendOtp(payload);
    },
    onError: (data: any) => {
      if (data.response.status === 404) {
        router.navigate(Routes.SoftSignup);
      }
    },
    onMutate: (payload: SendOtpPayload) => {
      setUserInfo({
        ...userInfo,
        country: payload.country,
        phoneNumber: payload.phoneNumber,
        toPhoneNumber: payload.toPhoneNumber,
      });
    },

    onSuccess: (data, payload) => {
      setUserInfo({
        country: userInfo?.country,
        email: data?.email || '',
        toPhoneNumber: payload.toPhoneNumber,
        phoneNumber: userInfo?.phoneNumber,
      });

      router.push(Routes.Verify);

      mutation.reset();
    },

    ...options,
  });

  return mutation;
};

export const useVerifyOtp = (
  options?: UseMutationOptions<VerifyOtpResponse, AxiosError, VerifyOtpPayload>
) => {
  const queryClient = useQueryClient();
  return useMutation<VerifyOtpResponse, AxiosError, VerifyOtpPayload>({
    mutationFn: async (payload: VerifyOtpPayload) => {
      const response = await api.post<VerifyOtpResponse>('/api/users/verify-otp', payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData([accountKeyFactory.account], data);
      queryClient.invalidateQueries({ queryKey: [accountKeyFactory.session] });
    },
    ...options,
  });
};

export const useLogout = (
  options?: UseMutationOptions<LogoutResponse, AxiosError, LogoutPayload>
) => {
  return useMutation<LogoutResponse, AxiosError, LogoutPayload>({
    mutationFn: async (payload: LogoutPayload) => {
      const response = await api.post<LogoutResponse>('/api/users/logout', payload);
      return response.data;
    },
    ...options,
  });
};

export const useRegister = (
  options?: UseMutationOptions<RegisterResponse, AxiosError, RegisterPayload>
) => {
  return useMutation<RegisterResponse, AxiosError, RegisterPayload>({
    mutationFn: async (payload: RegisterPayload) => {
      return await apis.register(payload);
    },
    onSuccess: () => {
      router.navigate({
        pathname: Routes.Verify,
        params: {
          from: 'signup',
        },
      });
    },
    ...options,
  });
};
