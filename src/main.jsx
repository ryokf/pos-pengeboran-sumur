import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

import ReceiptPrint from './pages/ReceiptPrint';
import Billing from './pages/Billing';
import BillingPrint from './pages/BillingPrint';
import BillingSummary from './pages/BillingSummary';
import FinancialReport from './pages/FinancialReport';
import MeterReadings from './pages/MeterReadings';

const router = createBrowserRouter([
  // Auth routes (public)
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      }
    ]
  },
  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />
          },
          {
            path: 'customers',
            element: <Customers />
          },
          {
            path: 'customers/:customerId',
            element: <CustomerDetail />
          },
          {
            path: 'meter-readings',
            element: <MeterReadings />
          },
          {
            path: 'settings',
            element: <Settings />
          },
          {
            path: 'profile',
            element: <Profile />
          },
          {
            path: 'finance/billing',
            element: <Billing />
          },
          {
            path: 'finance/report',
            element: <FinancialReport />
          }
        ]
      },
      // Print pages without layout (but still protected)
      {
        path: 'finance/receipt/:transactionId/print',
        element: <ReceiptPrint />
      },
      {
        path: 'finance/billing/print',
        element: <BillingPrint />
      },
      {
        path: 'finance/billing/summary',
        element: <BillingSummary />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)