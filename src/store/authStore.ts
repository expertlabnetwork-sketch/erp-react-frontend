import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, Tenant } from '../api/auth';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  tenant: Tenant | null;
  tenantSlug: string | null;
  setAuth: (token: string, user: AuthUser, tenant: Tenant, slug: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      tenant: null,
      tenantSlug: null,
      setAuth: (token, user, tenant, slug) => {
        localStorage.setItem('erp_token', token);
        localStorage.setItem('erp_tenant', slug);
        set({ token, user, tenant, tenantSlug: slug });
      },
      clearAuth: () => {
        localStorage.removeItem('erp_token');
        localStorage.removeItem('erp_tenant');
        set({ token: null, user: null, tenant: null, tenantSlug: null });
      },
      isAuthenticated: () => !!get().token,
    }),
    { name: 'erp-auth' }
  )
);
