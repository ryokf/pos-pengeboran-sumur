import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Settings from './pages/Settings';

import ReceiptPrint from './pages/ReceiptPrint';
import Billing from './pages/Billing';
import BillingPrint from './pages/BillingPrint';
import BillingSummary from './pages/BillingSummary';
import FinancialReport from './pages/FinancialReport';
import MeterReadings from './pages/MeterReadings';

const router = createBrowserRouter([
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
        path: 'finance/billing',
        element: <Billing />
      },
      {
        path: 'finance/report',
        element: <FinancialReport />
      }
    ]
  },
  // Print pages without layout (no sidebar/header)
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
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)