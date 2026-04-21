import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { DollarSign, ShoppingCart, Users, Package, ArrowRight, Star } from 'lucide-react';
import { statsData, revenueData, categoryData, recentOrders, topProducts } from '../data/mockData';
import { StatCard, Badge } from '../components/ui';
import { useApp } from '../context/AppContext';

const COLORS = ['#0ea5e9', '#f97316', '#8b5cf6', '#22c55e', '#f59e0b'];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('12m');
  const { darkMode } = useApp();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const chartData = period === '6m' ? revenueData.slice(6) : period === '3m' ? revenueData.slice(9) : revenueData;
  const axisColor = darkMode ? '#94a3b8' : '#64748b';
  const gridColor = darkMode ? '#1e293b' : '#f1f5f9';

  const stats = [
    { ...statsData.revenue, icon: DollarSign, color: 'brand' },
    { ...statsData.orders, icon: ShoppingCart, color: 'orange' },
    { ...statsData.users, icon: Users, color: 'purple' },
    { ...statsData.products, icon: Package, color: 'green' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard key={i} loading={loading} label={s.label} value={s.value} change={s.change} icon={s.icon} color={s.color} />
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white">Revenue Overview</h3>
            <p className="text-xs text-slate-400 mt-0.5">Monthly revenue & orders trend</p>
          </div>
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            {['3m','6m','12m'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${period === p ? 'bg-white dark:bg-slate-700 shadow text-slate-700 dark:text-white' : 'text-slate-500'}`}>{p}</button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="skeleton h-52 rounded-xl" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}K`} />
              <Tooltip contentStyle={{ background: darkMode ? '#0f172a' : '#fff', border: '1px solid ' + gridColor, borderRadius: 12, fontSize: 12 }} formatter={v => [`$${v.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: '#0ea5e9' }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Orders by Month</h3>
          <p className="text-xs text-slate-400 mb-4">Total orders per month</p>
          {loading ? <div className="skeleton h-44 rounded-xl" /> : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: darkMode ? '#0f172a' : '#fff', border: '1px solid ' + gridColor, borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="orders" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Categories</h3>
          <p className="text-xs text-slate-400 mb-4">Sales by category</p>
          {loading ? <div className="skeleton h-44 rounded-xl" /> : (
            <>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={3}>
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`]} contentStyle={{ background: darkMode ? '#0f172a' : '#fff', border: 'none', borderRadius: 8, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {categoryData.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-slate-600 dark:text-slate-400">{c.name}</span>
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{c.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recent Orders */}
        <div className="card lg:col-span-3 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-800 dark:text-white">Recent Orders</h3>
            <a href="/orders" className="text-xs text-brand-500 hover:text-brand-600 flex items-center gap-1 font-medium">View all <ArrowRight size={12} /></a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {recentOrders.map((o, i) => (
                  <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-mono text-xs text-brand-500 font-medium">{o.id}</p>
                      <p className="text-xs text-slate-500 truncate max-w-[120px]">{o.user}</p>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <p className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-[120px]">{o.product}</p>
                    </td>
                    <td className="px-3 py-3"><Badge status={o.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-sm font-semibold text-slate-800 dark:text-white">${o.amount.toFixed(2)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="card lg:col-span-2">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-800 dark:text-white">Top Products</h3>
          </div>
          <div className="p-4 space-y-3">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-5 text-xs font-bold text-slate-400">#{i + 1}</span>
                <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover border border-slate-100 dark:border-slate-700" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">{p.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="text-[10px] text-slate-400">{p.rating} · {p.sold} sold</span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">${p.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
