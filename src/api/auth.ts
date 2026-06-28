import client from './client';

export interface LoginPayload { email: string; password: string; tenant: string; }
export interface AuthUser { id: number; name: string; email: string; roles: string[]; }
export interface Tenant  { id: number; name: string; currency: string; locale: string; }

export const authApi = {
  login: async (payload: LoginPayload) => {
    const { data } = await client.post('/auth/login', {
      email: payload.email,
      password: payload.password,
      device_name: 'erp-react-spa',
    }, { headers: { 'X-Tenant': payload.tenant } });
    return data as { token: string; user: AuthUser; tenant: Tenant };
  },
  logout: () => client.post('/auth/logout'),
  me: async () => {
    const { data } = await client.get('/auth/me');
    return data as { user: AuthUser; roles: string[]; permissions: string[] };
  },
};
