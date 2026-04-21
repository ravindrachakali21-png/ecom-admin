import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { revenueData, weeklyData, categoryData } from '../data/mockData';
import { useApp } from '../context/AppContext';

const COLORS = ['#0ea5e9','#f97316','#8b5cf6','#22c55e','#f59e0b'];

const performanceData = [
  { subject: 'Revenue', A: 120, fullMark: 150 },
  { subject: 'Users', A: 98, fullMark: 150 },
  { subject: 'Orders', A: 86, fullMark: 150 },
  { subject: 'Retention', A: 99, fullMark: 150 },
  { subject: 'Satisfaction', A: 85, fullMark: 150 },
  { subject: 'Growth', A: 65, fullMark: 150 },
];

const conversionData = [
  { stage: 'Visitors', value: 10000 },
  { stage: 'Signups', value: 4200 },
  { stage: 'Activated', value: 2800 },
  { stage: 'Purchased', value: 1200 },
  { stage: 'Retained', value: 820 },
];

export default function Analytics() {
  const [period, setPeriod] = useState('12m');
  const [loading, setLoading] = useState(true);
  const { darkMode } = useApp();

  useEffect(() => { setTimeout(() => setLoading(false), 800); }, []);

  const chartData = period === '6m' ? revenueData.slice(6) : period === '3m' ? revenueData.slice(9) : revenueData;
  const axisColor = darkMode ? '#94a3b8' : '#64748b';
  const gridColor = darkMode ? '#1e293b' : '#f1f5f9';
  const tipStyle = { background: darkMode ? '#0f172a' : '#fff', border: `1px solid ${gridColor}`, borderRadius: 12, fontSize: 12 };

  const kpis = [
    { label:'Conversion Rate', value:'12.4%', change:'+2.1%', positive:true },
    { label:'Avg Order Value', value:'$74.20', change:'+5.3%', positive:true },
    { label:'Bounce Rate', value:'38.6%', change:'-3.2%', positive:true },
    { label:'Customer LTV', value:'$428', change:'+8.7%', positive:true },
  ];

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({length:4}).map((_,i)=><div key={i} className="card p-5"><div className="skeleton h-4 w-24 mb-3" /><div className="skeleton h-8 w-32 mb-2" /><div className="skeleton h-3 w-16" /></div>)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{Array.from({length:4}).map((_,i)=><div key={i} className="card p-5"><div className="skeleton h-52 rounded-xl" /></div>)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="card p-5">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{k.label}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{k.value}</p>
            <p className={`text-xs font-medium ${k.positive ? 'text-green-500' : 'text-red-500'}`}>{k.change} vs last period</p>
          </div>
        ))}
      </div>

      {/* Period filter */}
      <div className="flex gap-1 bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-100 dark:border-slate-800 w-fit">
        {['3m','6m','12m'].map(p => (
          <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${period === p ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>{p}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue vs Orders */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Revenue vs Orders</h3>
          <p className="text-xs text-slate-400 mb-4">Dual-axis comparison</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{fontSize:11,fill:axisColor}} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{fontSize:11,fill:axisColor}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v/1000}K`} />
              <YAxis yAxisId="right" orientation="right" tick={{fontSize:11,fill:axisColor}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tipStyle} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2.5} dot={false} activeDot={{r:5}} />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={2.5} dot={false} activeDot={{r:5}} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Weekly Visitors vs Sales</h3>
          <p className="text-xs text-slate-400 mb-4">This week's traffic and sales</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="day" tick={{fontSize:11,fill:axisColor}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11,fill:axisColor}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tipStyle} />
              <Legend />
              <Bar dataKey="visitors" fill="#0ea5e9" radius={[4,4,0,0]} opacity={0.7} />
              <Bar dataKey="sales" fill="#f97316" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Funnel */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Conversion Funnel</h3>
          <p className="text-xs text-slate-400 mb-4">Visitor to purchase journey</p>
          <div className="space-y-3">
            {conversionData.map((c, i) => {
              const pct = Math.round((c.value / conversionData[0].value) * 100);
              return (
                <div key={c.stage}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{c.stage}</span>
                    <span className="text-slate-400">{c.value.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="h-7 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                    <div className="h-full rounded-lg flex items-center px-3 transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, #0ea5e9, #0284c7)` }}>
                      {pct > 15 && <span className="text-white text-xs font-bold">{pct}%</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Radar */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Performance Radar</h3>
          <p className="text-xs text-slate-400 mb-2">Key metrics overview</p>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={performanceData}>
              <PolarGrid stroke={gridColor} />
              <PolarAngleAxis dataKey="subject" tick={{fontSize:11,fill:axisColor}} />
              <Radar name="Score" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip contentStyle={tipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="card p-5">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Category Performance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {categoryData.map((c, i) => (
            <div key={c.name} className="flex flex-col items-center gap-3">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={darkMode ? '#1e293b' : '#f1f5f9'} strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={COLORS[i % COLORS.length]} strokeWidth="3"
                    strokeDasharray={`${c.value} ${100 - c.value}`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">{c.value}%</span>
              </div>
              <p className="text-xs text-center text-slate-600 dark:text-slate-300 font-medium">{c.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
