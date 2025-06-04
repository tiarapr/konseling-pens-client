import axios from 'axios';
import Cookies from 'js-cookie';
import { checkAndRefreshToken } from './checkingToken';

const BASIC_AUTH_USERNAME = import.meta.env.VITE_BASIC_AUTH_USERNAME || '';
const BASIC_AUTH_PASSWORD = import.meta.env.VITE_BASIC_AUTH_PASSWORD || '';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getBasicAuthHeader = () => {
  const encoded = btoa(`${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`);
  return `Basic ${encoded}`;
};

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,  // Kirim cookie (HttpOnly)
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(async (config) => {
  config.headers = config.headers || {};
  config.headers['Authorization'] = getBasicAuthHeader();
  return config;
}, (error) => Promise.reject(error));

// RESPONSE INTERCEPTOR (auto-refresh or logout)
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika token expired dan belum di-retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await checkAndRefreshToken();

      if (newAccessToken) {
        // Retry request dengan token baru
        return api(originalRequest);
      } else {
        // Refresh gagal, logout paksa
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/signin';  // Redirect ke halaman login
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
