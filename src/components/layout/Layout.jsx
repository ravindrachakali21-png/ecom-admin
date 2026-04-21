import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '../../context/AppContext';

const pageTitles = {
  '/': 'Dashboard',
  '/users': 'User Management',
  '/products': 'Product Management',
  '/orders': 'Orders',
  '/payments': 'Payments & Transactions',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

export default function Layout({ children }) {
  const location = useLocation();
  const { updateLastVisited } = useApp();
  const title = pageTitles[location.pathname] || 'AdminFlow';

  useEffect(() => {
    updateLastVisited(location.pathname);
  }, [location.pathname, updateLastVisited]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
