import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Package, ShoppingCart, CreditCard,
  BarChart3, Settings, X, Zap, ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/users', label: 'Users', icon: Users },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/payments', label: 'Payments', icon: CreditCard },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useApp();
  const location = useLocation();

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-40 flex flex-col
        bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto lg:h-screen
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center shadow-md shadow-brand-500/30">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800 dark:text-white tracking-tight">AdminFlow</p>
              <p className="text-[10px] text-slate-400 font-mono">v2.0 PRO</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Main Menu</p>
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
            return (
              <NavLink
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={`nav-link group ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} className={isActive ? 'text-brand-500' : 'text-slate-400 group-hover:text-brand-400'} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-brand-400" />}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold shadow">SA</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">Super Admin</p>
              <p className="text-[10px] text-slate-400 truncate">admin@store.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
