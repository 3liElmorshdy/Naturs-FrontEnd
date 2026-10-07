import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from '../store/store';
import { logoutUser } from '../store/authSlice';

const BASE_URL = 'http://localhost:5020/api/v1';

// الـ access token في memory بس (مش localStorage)
let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};
export const getAccessToken = () => accessToken;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// instance منفصل للـ refresh عشان مايمرش على الـ interceptors
const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Request: ضيف الـ Bearer token
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// refresh واحد مشترك لكل الطلبات الفاشلة
let refreshPromise: Promise<string> | null = null;

export const refreshAccessToken = (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post('/users/refreshAccessToken')
      .then((res) => {
        const token = res.data.accessToken as string;
        setAccessToken(token);
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;
    if (!originalRequest) return Promise.reject(error);

    const url = originalRequest.url ?? '';
    const isAuthRoute =
      url.includes('/users/login') ||
      url.includes('/users/signup') ||
      url.includes('/users/refreshAccessToken');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        store.dispatch(logoutUser());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;