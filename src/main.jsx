import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Employees from './pages/Employees';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

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
        path: 'orders',
        element: <Orders />
      },
      {
        path: 'orders/:orderId',
        element: <OrderDetail />
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
        path: 'employees',
        element: <Employees />
      },
      {
        path: 'reports',
        element: <Reports />
      },
      {
        path: 'settings',
        element: <Settings />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)