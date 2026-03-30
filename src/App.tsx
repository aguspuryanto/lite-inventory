import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RawMaterials from './pages/RawMaterials';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import PurchaseOrders from './pages/PurchaseOrders';
import GoodsReceipts from './pages/GoodsReceipts';
import Productions from './pages/Productions';
import SalesOrders from './pages/SalesOrders';
import Shipments from './pages/Shipments';
import Reports from './pages/Reports';
import { ThemeProvider } from './components/theme-provider';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const currentUser = useStore(state => state.currentUser);
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="raw-materials" element={<RawMaterials />} />
            <Route path="products" element={<Products />} />
            <Route path="purchase-orders" element={<PurchaseOrders />} />
            <Route path="goods-receipts" element={<GoodsReceipts />} />
            <Route path="productions" element={<Productions />} />
            <Route path="sales-orders" element={<SalesOrders />} />
            <Route path="shipments" element={<Shipments />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
