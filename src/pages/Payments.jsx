import React, { useState, useEffect } from 'react';
import { Search, Download, ChevronDown } from 'lucide-react';
import { transactions } from '../data/mockData';
import { Badge, TableSkeleton, Pagination, EmptyState } from '../components/ui';
import toast from 'react-hot-toast';

const PER_PAGE = 12;

export default function Payments() {
  const [search, setSearch] = useState('');
  const [dSearch, setDSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setTimeout(() => setLoading(false), 700); }, []);
  useEffect(() => {
    const t = setTimeout(() => { setDSearch(search); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = transactions.filter(t => {
    const ms = !dSearch || t.id.toLowerCase().includes(dSearch.toLowerCase()) || t.user.toLowerCase().includes(dSearch.toLowerCase()) || t.orderId.toLowerCase().includes(dSearch.toLowerCase());
    const mt = typeFilter === 'all' || t.type === typeFilter;
    const mst = statusFilter === 'all' || t.status === statusFilter;
    return ms && mt && mst;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const totals = {
    revenue: transactions.filter(t=>t.type==='payment'&&t.status==='success').reduce((s,t)=>s+t.amount,0),
    refunds: transactions.filter(t=>t.type==='refund').reduce((s,t)=>s+t.amount,0),
    payouts: transactions.filter(t=>t.type==='payout').reduce((s,t)=>s+t.amount,0),
    fees: transactions.reduce((s,t)=>s+t.fee,0),
  };

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Total Revenue', value:`$${totals.revenue.toLocaleString(undefined,{maximumFractionDigits:0})}`, color:'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
          { label:'Total Refunds', value:`$${totals.refunds.toLocaleString(undefined,{maximumFractionDigits:0})}`, color:'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' },
          { label:'Total Payouts', value:`$${totals.payouts.toLocaleString(undefined,{maximumFractionDigits:0})}`, color:'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
          { label:'Total Fees', value:`$${totals.fees.toLocaleString(undefined,{maximumFractionDigits:0})}`, color:'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
        ].map(c => (
          <div key={c.label} className={`card p-4 ${c.color}`}>
            <p className="text-xs font-medium opacity-80 mb-1">{c.label}</p>
            <p className="text-xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9 h-9 text-sm" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="relative">
            <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} className="input h-9 pr-8 text-sm appearance-none">
              <option value="all">All Types</option>
              <option value="payment">Payment</option><option value="refund">Refund</option><option value="payout">Payout</option><option value="chargeback">Chargeback</option>
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input h-9 pr-8 text-sm appearance-none">
              <option value="all">All Status</option>
              <option value="success">Success</option><option value="pending">Pending</option><option value="failed">Failed</option>
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <button onClick={() => toast.success('Exporting transactions...')} className="btn-secondary flex items-center gap-2 h-9">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>{['Transaction ID','Order ID','User','Amount','Fee','Type','Method','Status','Date'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? <TableSkeleton rows={10} cols={9} /> : paged.length === 0 ? <tr><td colSpan={9}><EmptyState message="No transactions found" /></td></tr> : paged.map(t => (
                <tr key={t.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3"><span className="font-mono text-xs font-semibold text-brand-500">{t.id}</span></td>
                  <td className="px-4 py-3"><span className="font-mono text-xs text-slate-500">{t.orderId}</span></td>
                  <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">{t.user}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">${t.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">${t.fee.toFixed(2)}</td>
                  <td className="px-4 py-3"><Badge status={t.type} /></td>
                  <td className="px-4 py-3 text-xs text-slate-500">{t.method}</td>
                  <td className="px-4 py-3"><Badge status={t.status} /></td>
                  <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && <Pagination page={page} totalPages={Math.max(1,totalPages)} onChange={setPage} />}
      </div>
    </div>
  );
}
