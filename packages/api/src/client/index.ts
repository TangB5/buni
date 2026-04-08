import axios from 'axios';
import { useAuthStore } from '@buni/auth';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export const apiClient = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(config => {
  const token = useAuthStore.getState().tokens?.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  r => r,
  async err => {
    if (err.response?.status === 401) useAuthStore.getState().clearAuth();
    return Promise.reject(err);
  }
);

export type ApiError = { message: string; statusCode: number; errors?: Record<string, string[]> };
