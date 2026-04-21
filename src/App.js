import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Payments from './pages/Payments';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#1e293b',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '13px',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/users" element={<Layout><Users /></Layout>} />
          <Route path="/products" element={<Layout><Products /></Layout>} />
          <Route path="/orders" element={<Layout><Orders /></Layout>} />
          <Route path="/payments" element={<Layout><Payments /></Layout>} />
          <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
