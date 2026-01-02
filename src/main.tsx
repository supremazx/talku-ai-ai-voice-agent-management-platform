import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
// Global Admin Pages
import { HomePage as AdminHomePage } from '@/pages/HomePage'
import TenantsPage from '@/pages/admin/TenantsPage'
import AdminCallLogsPage from '@/pages/CallLogsPage'
import AdminUsagePage from '@/pages/admin/UsagePage'
import AdminHealthPage from '@/pages/admin/HealthPage'
import AdminAuditLogsPage from '@/pages/admin/AuditLogsPage'
import AdminSettingsPage from '@/pages/SettingsPage'
import AdminBillingPage from '@/pages/BillingPage'
// Customer App Pages
import { DashboardPage as AppDashboardPage } from '@/pages/app/DashboardPage'
import AppAgentsPage from '@/pages/AgentsPage'
import AppNumbersPage from '@/pages/NumbersPage'
import AppCallLogsPage from '@/pages/CallLogsPage'
import AppBillingPage from '@/pages/BillingPage'
import AppSettingsPage from '@/pages/SettingsPage'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/app" replace />,
    errorElement: <RouteErrorBoundary />,
  },
  // Customer Dashboard Routes
  {
    path: "/app",
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <AppDashboardPage /> },
      { path: "agents", element: <AppAgentsPage /> },
      { path: "numbers", element: <AppNumbersPage /> },
      { path: "logs", element: <AppCallLogsPage /> },
      { path: "billing", element: <AppBillingPage /> },
      { path: "settings", element: <AppSettingsPage /> },
    ]
  },
  // Admin Control Panel Routes
  {
    path: "/admin",
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <AdminHomePage /> },
      { path: "tenants", element: <TenantsPage /> },
      { path: "logs", element: <AdminCallLogsPage /> },
      { path: "usage", element: <AdminUsagePage /> },
      { path: "health", element: <AdminHealthPage /> },
      { path: "audit", element: <AdminAuditLogsPage /> },
      { path: "settings", element: <AdminSettingsPage /> },
      { path: "billing", element: <AdminBillingPage /> },
    ]
  }
]);
const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');
const root = createRoot(container);
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>
);