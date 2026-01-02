import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import TenantsPage from '@/pages/admin/TenantsPage'
import CallLogsPage from '@/pages/CallLogsPage'
import BillingPage from '@/pages/BillingPage'
import SettingsPage from '@/pages/SettingsPage'
import AuditLogsPage from '@/pages/admin/AuditLogsPage'
import HealthPage from '@/pages/admin/HealthPage'
import UsagePage from '@/pages/admin/UsagePage'
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/tenants",
    element: <TenantsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/logs",
    element: <CallLogsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/usage",
    element: <UsagePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/billing",
    element: <BillingPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/providers",
    element: <HealthPage />, // Providers view now merged into Health/Routing
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/health",
    element: <HealthPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/abuse",
    element: <HealthPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/webhooks",
    element: <SettingsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/audit",
    element: <AuditLogsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)