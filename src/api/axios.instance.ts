import axios from 'axios';
import { env } from 'config';

export const api = axios.create();
api.defaults.baseURL = env.baseUrl;
api.interceptors.request.use(
  (config) => {
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
