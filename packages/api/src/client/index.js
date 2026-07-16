import axios from 'axios';
import { useAuthStore } from '@buni/auth';
const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
export const apiClient = axios.create({
    baseURL: BASE,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});
apiClient.interceptors.request.use((config) => {
    if (config.data instanceof FormData)
        delete config.headers['Content-Type'];
    return config;
});
apiClient.interceptors.response.use(r => r, async (err) => {
    if (err.response?.status === 401)
        useAuthStore.getState().logout();
    return Promise.reject(err);
});
export async function get(url, params) {
    const res = await apiClient.get(url, { params });
    return res.data;
}
export async function post(url, data) {
    const res = await apiClient.post(url, data);
    return res.data;
}
export async function put(url, data) {
    const res = await apiClient.put(url, data);
    return res.data;
}
export async function patch(url, data) {
    const res = await apiClient.patch(url, data);
    return res.data;
}
export async function del(url) {
    const res = await apiClient.delete(url);
    return res.data;
}
//# sourceMappingURL=index.js.map