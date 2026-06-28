import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const TENANT   = import.meta.env.VITE_TENANT_SLUG || '';

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(TENANT && { 'X-Tenant': TENANT }),
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('erp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const tenant = localStorage.getItem('erp_tenant') || TENANT;
  if (tenant) config.headers['X-Tenant'] = tenant;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('erp_token');
      localStorage.removeItem('erp_tenant');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default client;
