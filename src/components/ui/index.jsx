import React from 'react';
import { TrendingUp, TrendingDown, X } from 'lucide-react';

// Stat Card
export function StatCard({ label, value, change, icon: Icon, color = 'brand', loading }) {
  const colorMap = {
    brand: 'from-brand-500 to-brand-600 shadow-brand-500/20',
    orange: 'from-orange-500 to-orange-600 shadow-orange-500/20',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/20',
    green: 'from-green-500 to-green-600 shadow-green-500/20',
  };
  const bgMap = {
    brand: 'bg-brand-50 dark:bg-brand-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    green: 'bg-green-50 dark:bg-green-900/20',
  };
  const positive = change >= 0;

  if (loading) return (
    <div className="card p-5">
      <div className="skeleton h-4 w-24 mb-3" />
      <div className="skeleton h-8 w-32 mb-2" />
      <div className="skeleton h-3 w-20" />
    </div>
  );

  return (
    <div className="card p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[color]} shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-800 dark:text-white mb-1.5">
        {typeof value === 'number' && value > 1000
          ? (value >= 1000000 ? `$${(value/1000000).toFixed(1)}M` : value >= 1000 ? `${(value/1000).toFixed(0)}K` : value.toLocaleString())
          : value}
      </p>
      <div className={`flex items-center gap-1 text-xs font-medium ${positive ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
        {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        <span>{Math.abs(change)}% vs last month</span>
      </div>
    </div>
  );
}

// Badge
export function Badge({ status }) {
  const map = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    blocked: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    refunded: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    out_of_stock: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    moderator: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    customer: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    payment: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    refund: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    payout: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    chargeback: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };
  return (
    <span className={`badge ${map[status] || 'bg-slate-100 text-slate-600'}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}

// Modal
export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className={`relative w-full ${sizes[size]} bg-white dark:bg-slate-900 rounded-2xl shadow-2xl animate-fade-in overflow-hidden`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-800 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// Skeleton rows
export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="skeleton h-4 rounded" style={{ width: `${60 + (j * 10) % 40}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// Pagination
export function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800">
      <p className="text-xs text-slate-500">Page {page} of {totalPages}</p>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(page - 1)} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs btn-secondary disabled:opacity-40 disabled:cursor-not-allowed">Prev</button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const p = Math.max(1, page - 2) + i;
          if (p > totalPages) return null;
          return (
            <button key={p} onClick={() => onChange(p)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${p === page ? 'bg-brand-600 text-white' : 'btn-secondary'}`}>{p}</button>
          );
        })}
        <button onClick={() => onChange(page + 1)} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-xs btn-secondary disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
      </div>
    </div>
  );
}

// Empty state
export function EmptyState({ message = 'No data found' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      </div>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
