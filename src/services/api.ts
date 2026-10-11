import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { store } from "../store/store";
import { logoutUser } from "../store/authSlice";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://naturs.onrender.com/api/v1";

// الـ access token في الذاكرة فقط، وليس في localStorage.
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Axios instance منفصل للـ refresh حتى لا يدخل في response interceptor نفسه.
const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// يضيف Bearer token لكل request محمي.
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Promise واحد لمنع عدة refresh requests عند فشل requests متعددة في نفس الوقت.
let refreshPromise: Promise<string> | null = null;

export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/users/refreshAccessToken")
      .then((response) => {
        const token = response.data.accessToken as string;

        setAccessToken(token);

        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url ?? "";

    const isAuthRoute =
      url.includes("/users/login") ||
      url.includes("/users/signup") ||
      url.includes("/users/refreshAccessToken");

    const shouldRefresh =
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute;

    if (!shouldRefresh) {
      return Promise.reject(error);
    }

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
  },
);

export default api;