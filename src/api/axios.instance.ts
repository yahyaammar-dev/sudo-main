import axios from 'axios';
import { env } from 'config';
import userStore from 'store/userStore';

export const api = axios.create();
api.defaults.baseURL = env.baseUrl;
api.interceptors.request.use(
  (config) => {
    const token = userStore.authToken.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
