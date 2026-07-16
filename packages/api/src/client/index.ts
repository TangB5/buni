import axios, { type InternalAxiosRequestConfig, type AxiosError } from 'axios';
import { useAuthStore } from '@buni/auth';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export const apiClient = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.data instanceof FormData) delete config.headers['Content-Type'];
  return config;
});

apiClient.interceptors.response.use(
  r => r,
  async (err: AxiosError) => {
    if (err.response?.status === 401) useAuthStore.getState().logout();
    return Promise.reject(err);
  }
);

export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await apiClient.get<T>(url, { params });
  return res.data;
}

export async function post<T, D = unknown>(url: string, data?: D): Promise<T> {
  const res = await apiClient.post<T>(url, data);
  return res.data;
}

export async function put<T, D = unknown>(url: string, data?: D): Promise<T> {
  const res = await apiClient.put<T>(url, data);
  return res.data;
}

export async function patch<T, D = unknown>(url: string, data?: D): Promise<T> {
  const res = await apiClient.patch<T>(url, data);
  return res.data;
}

export async function del<T>(url: string): Promise<T> {
  const res = await apiClient.delete<T>(url);
  return res.data;
}