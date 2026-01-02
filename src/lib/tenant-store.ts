import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Tenant } from '@shared/types';
interface TenantState {
  activeTenantId: string;
  activeTenant: Tenant | null;
  setTenant: (tenant: Tenant) => void;
  clearTenant: () => void;
}
export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      activeTenantId: 'tenant-1',
      activeTenant: null,
      setTenant: (tenant: Tenant) => set({ activeTenant: tenant, activeTenantId: tenant.id }),
      clearTenant: () => set({ activeTenantId: 'tenant-1', activeTenant: null }),
    }),
    {
      name: 'talku-tenant-storage',
    }
  )
);