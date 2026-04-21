import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Sun, Moon, X, Package, Users, ShoppingCart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { users, products, orders } from '../../data/mockData';

const notifications = [
  { id: 1, text: 'New order #ORD-010045 placed', time: '2m ago', type: 'order', unread: true },
  { id: 2, text: 'User Alice Smith registered', time: '15m ago', type: 'user', unread: true },
  { id: 3, text: 'Product "Headphones" low stock', time: '1h ago', type: 'product', unread: true },
  { id: 4, text: 'Payment of $249 received', time: '3h ago', type: 'payment', unread: false },
  { id: 5, text: 'Order #ORD-009988 delivered', time: '5h ago', type: 'order', unread: false },
];

export default function Header({ title }) {
  const { darkMode, setDarkMode, setSidebarOpen, globalSearch, setGlobalSearch, debouncedSearch } = useApp();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [unreadCount] = useState(notifications.filter(n => n.unread).length);
  const navigate = useNavigate();
  const searchRef = useRef();

  useEffect(() => {
    if (showSearch) searchRef.current?.focus();
  }, [showSearch]);

  const searchResults = debouncedSearch.length > 1 ? [
    ...users.filter(u => u.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || u.email.toLowerCase().includes(debouncedSearch.toLowerCase())).slice(0, 2).map(u => ({ ...u, type: 'user' })),
    ...products.filter(p => p.name.toLowerCase().includes(debouncedSearch.toLowerCase())).slice(0, 2).map(p => ({ ...p, type: 'product' })),
    ...orders.filter(o => o.id.toLowerCase().includes(debouncedSearch.toLowerCase()) || o.user.toLowerCase().includes(debouncedSearch.toLowerCase())).slice(0, 2).map(o => ({ ...o, type: 'order' })),
  ] : [];

  const handleResultClick = (result) => {
    setGlobalSearch('');
    setShowSearch(false);
    if (result.type === 'user') navigate('/users');
    else if (result.type === 'product') navigate('/products');
    else if (result.type === 'order') navigate('/orders');
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16 gap-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <Menu size={20} />
          </button>
          {!showSearch && <h1 className="text-base font-bold text-slate-800 dark:text-white hidden sm:block">{title}</h1>}
        </div>

        {/* Search */}
        <div className={`relative flex-1 max-w-md ${showSearch ? 'block' : 'hidden sm:block'}`}>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search users, products, orders..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="input pl-9 pr-8 h-9 text-sm"
            />
            {globalSearch && (
              <button onClick={() => setGlobalSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
              {searchResults.map((result, i) => (
                <button key={i} onClick={() => handleResultClick(result)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs ${result.type === 'user' ? 'bg-brand-500' : result.type === 'product' ? 'bg-purple-500' : 'bg-orange-500'}`}>
                    {result.type === 'user' ? <Users size={12} /> : result.type === 'product' ? <Package size={12} /> : <ShoppingCart size={12} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">{result.name || result.id}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{result.type}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          <button
            className="sm:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search size={18} />
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>
            {showNotifs && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-semibold">Notifications</p>
                  <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">{unreadCount} new</span>
                </div>
                {notifications.map(n => (
                  <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border-b border-slate-50 dark:border-slate-800/50 ${n.unread ? 'bg-brand-50/50 dark:bg-brand-900/10' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                    <div className="flex-1">
                      <p className="text-xs text-slate-700 dark:text-slate-200">{n.text}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-2.5 text-center">
                  <button className="text-xs text-brand-500 hover:text-brand-600 font-medium">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold ml-1 cursor-pointer hover:shadow-md hover:shadow-brand-500/30 transition-all">SA</div>
        </div>
      </div>
    </header>
  );
}
