import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Shield, Ban, CheckCircle, ChevronDown, Filter } from 'lucide-react';
import { users as allUsers } from '../data/mockData';
import { Badge, Modal, TableSkeleton, Pagination, EmptyState } from '../components/ui';
import toast from 'react-hot-toast';

const PER_PAGE = 10;

export default function Users() {
  const [users, setUsers] = useState(allUsers);
  const [search, setSearch] = useState('');
  const [dSearch, setDSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { setTimeout(() => setLoading(false), 700); }, []);

  useEffect(() => {
    const t = setTimeout(() => { setDSearch(search); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = users.filter(u => {
    const matchSearch = !dSearch || u.name.toLowerCase().includes(dSearch.toLowerCase()) || u.email.toLowerCase().includes(dSearch.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      const newStatus = u.status === 'active' ? 'blocked' : 'active';
      toast.success(`User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`);
      return { ...u, status: newStatus };
    }));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{filtered.length} users found</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <UserPlus size={15} /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9 h-9 text-sm" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="relative">
            <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} className="input h-9 pr-8 text-sm appearance-none">
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="customer">Customer</option>
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input h-9 pr-8 text-sm appearance-none">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {['User','Role','Status','Orders','Spent','Joined','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <TableSkeleton rows={8} cols={7} /> : paged.length === 0 ? (
                <tr><td colSpan={7}><EmptyState message="No users found" /></td></tr>
              ) : paged.map(user => (
                <tr key={user.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${user.avatar} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{user.initials}</div>
                      <div>
                        <p className="font-medium text-slate-700 dark:text-slate-200 text-sm">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge status={user.role} /></td>
                  <td className="px-4 py-3"><Badge status={user.status} /></td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{user.orders}</td>
                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">${user.spent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{user.joined}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setSelectedUser(user); setShowModal(true); }} className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 text-brand-500 transition-colors" title="View"><Shield size={15} /></button>
                      <button onClick={() => toggleStatus(user.id)} className={`p-1.5 rounded-lg transition-colors ${user.status === 'active' ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500' : 'hover:bg-green-50 dark:hover:bg-green-900/20 text-green-500'}`} title={user.status === 'active' ? 'Block' : 'Unblock'}>
                        {user.status === 'active' ? <Ban size={15} /> : <CheckCircle size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && <Pagination page={page} totalPages={Math.max(1, totalPages)} onChange={setPage} />}
      </div>

      {/* User Detail Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="User Details">
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl ${selectedUser.avatar} flex items-center justify-center text-white text-xl font-bold`}>{selectedUser.initials}</div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{selectedUser.name}</h3>
                <p className="text-sm text-slate-400">{selectedUser.email}</p>
                <div className="flex gap-2 mt-1.5"><Badge status={selectedUser.role} /><Badge status={selectedUser.status} /></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[['Orders', selectedUser.orders],['Total Spent', `$${selectedUser.spent.toFixed(2)}`],['Joined', selectedUser.joined]].map(([l,v]) => (
                <div key={l} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-slate-800 dark:text-white">{v}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{l}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { toggleStatus(selectedUser.id); setShowModal(false); }} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedUser.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                {selectedUser.status === 'active' ? 'Block User' : 'Unblock User'}
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 btn-primary py-2.5 rounded-xl">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
