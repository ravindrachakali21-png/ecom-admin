import React, { useState, useEffect } from 'react';
import { Search, Eye } from 'lucide-react';
import { orders as allOrders } from '../data/mockData';
import { Badge, Modal, TableSkeleton, Pagination, EmptyState } from '../components/ui';
import toast from 'react-hot-toast';

const PER_PAGE = 12;
const STATUSES = ['all','pending','processing','shipped','delivered','cancelled','refunded'];

export default function Orders() {
  const [orders, setOrders] = useState(allOrders);
  const [search, setSearch] = useState('');
  const [dSearch, setDSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { setTimeout(() => setLoading(false), 700); }, []);
  useEffect(() => {
    const t = setTimeout(() => { setDSearch(search); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = orders.filter(o => {
    const ms = !dSearch || o.id.toLowerCase().includes(dSearch.toLowerCase()) || o.user.toLowerCase().includes(dSearch.toLowerCase()) || o.product.toLowerCase().includes(dSearch.toLowerCase());
    const mst = statusFilter === 'all' || o.status === statusFilter;
    return ms && mst;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const updateStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? {...o, status} : o));
    toast.success(`Order status updated to ${status}`);
    setShowModal(false);
  };

  const statusCounts = STATUSES.reduce((acc, s) => {
    acc[s] = s === 'all' ? orders.length : orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scroll">
        {STATUSES.map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${statusFilter === s ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-300'}`}>
            <span className="capitalize">{s}</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${statusFilter === s ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{statusCounts[s]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9 h-9 text-sm" placeholder="Search by order ID, user, product..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>{['Order ID','Customer','Product','Amount','Status','Payment','Date','Actions'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? <TableSkeleton rows={10} cols={8} /> : paged.length === 0 ? <tr><td colSpan={8}><EmptyState message="No orders found" /></td></tr> : paged.map(o => (
                <tr key={o.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3"><span className="font-mono text-xs font-semibold text-brand-500">{o.id}</span></td>
                  <td className="px-4 py-3"><div><p className="text-xs font-medium text-slate-700 dark:text-slate-200">{o.user}</p><p className="text-[10px] text-slate-400 truncate max-w-[100px]">{o.userEmail}</p></div></td>
                  <td className="px-4 py-3"><p className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-[120px]">{o.product}</p></td>
                  <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">${o.amount.toFixed(2)}</td>
                  <td className="px-4 py-3"><Badge status={o.status} /></td>
                  <td className="px-4 py-3 text-xs text-slate-500">{o.paymentMethod}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{o.date}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => { setSelected(o); setShowModal(true); }} className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 text-brand-500 transition-colors"><Eye size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && <Pagination page={page} totalPages={Math.max(1,totalPages)} onChange={setPage} />}
      </div>

      {/* Order Detail Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Order Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Order Info</p>
                {[['Order ID', selected.id],['Date', selected.date],['Amount', `$${selected.amount.toFixed(2)}`],['Qty', selected.qty],['Payment', selected.paymentMethod]].map(([l,v])=>(
                  <div key={l} className="flex justify-between text-xs py-1.5 border-b border-slate-200 dark:border-slate-700 last:border-0">
                    <span className="text-slate-500">{l}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{v}</span>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Customer</p>
                {[['Name', selected.user],['Email', selected.userEmail],['Address', selected.address]].map(([l,v])=>(
                  <div key={l} className="flex justify-between text-xs py-1.5 border-b border-slate-200 dark:border-slate-700 last:border-0">
                    <span className="text-slate-500">{l}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200 text-right max-w-[140px]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {['pending','processing','shipped','delivered','cancelled','refunded'].map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)} className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${selected.status === s ? 'bg-brand-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-600'}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
