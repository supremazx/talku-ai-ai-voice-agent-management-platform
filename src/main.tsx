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
// Mock components for non-implemented internal routes to keep router clean
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-screen font-mono text-muted-foreground uppercase tracking-widest">
    {title} - Under Construction
  </div>
);
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
    element: <Placeholder title="Usage & Costs" />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/billing",
    element: <BillingPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/providers",
    element: <Placeholder title="Providers & Routing" />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/health",
    element: <Placeholder title="System Health" />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/abuse",
    element: <Placeholder title="Abuse & Risk" />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/webhooks",
    element: <Placeholder title="Webhooks & Events" />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/audit",
    element: <Placeholder title="Audit Logs" />,
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