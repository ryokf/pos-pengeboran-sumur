import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Settings from './pages/Settings';
import CashFlow from './pages/CashFlow';
import ReceiptPrint from './pages/ReceiptPrint';
import Billing from './pages/Billing';
import BillingPrint from './pages/BillingPrint';
import FinancialReport from './pages/FinancialReport';

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
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'finance/cash-flow',
        element: <CashFlow />
      },
      {
        path: 'finance/receipt/:transactionId/print',
        element: <ReceiptPrint />
      },
      {
        path: 'finance/billing',
        element: <Billing />
      },
      {
        path: 'finance/billing/print',
        element: <BillingPrint />
      },
      {
        path: 'finance/report',
        element: <FinancialReport />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)