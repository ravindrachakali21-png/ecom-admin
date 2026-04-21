import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, ChevronDown, Star, Grid, List } from 'lucide-react';
import { products as allProducts } from '../data/mockData';
import { Badge, Modal, Pagination, EmptyState, TableSkeleton } from '../components/ui';
import toast from 'react-hot-toast';

const PER_PAGE = 12;
const CATS = ['all','Electronics','Fashion','Sports','Home & Garden','Books','Health & Beauty'];

const emptyForm = { name:'', category:'Electronics', price:'', stock:'', description:'', status:'active', image:'' };

export default function Products() {
  const [products, setProducts] = useState(allProducts);
  const [search, setSearch] = useState('');
  const [dSearch, setDSearch] = useState('');
  const [cat, setCat] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'view' | 'delete'
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  useEffect(() => { setTimeout(() => setLoading(false), 700); }, []);
  useEffect(() => {
    const t = setTimeout(() => { setDSearch(search); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = products.filter(p => {
    const ms = !dSearch || p.name.toLowerCase().includes(dSearch.toLowerCase()) || p.sku.toLowerCase().includes(dSearch.toLowerCase());
    const mc = cat === 'all' || p.category === cat;
    return ms && mc;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => { setForm(emptyForm); setModal('add'); };
  const openEdit = (p) => { setForm({ name:p.name, category:p.category, price:p.price, stock:p.stock, description:p.description, status:p.status, image:p.image }); setEditId(p.id); setModal('edit'); };
  const openDelete = (p) => { setEditId(p.id); setModal('delete'); };

  const handleSave = () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
    if (modal === 'add') {
      const newP = { ...form, id: products.length + 1, price: +form.price, stock: +form.stock, sold: 0, rating: 4.0, sku: `SKU-NEW${products.length}`, image: form.image || `https://placehold.co/200x200/0ea5e9/fff?text=${encodeURIComponent(form.name.split(' ')[0])}` };
      setProducts(prev => [newP, ...prev]);
      toast.success('Product added!');
    } else {
      setProducts(prev => prev.map(p => p.id === editId ? { ...p, ...form, price: +form.price, stock: +form.stock } : p));
      toast.success('Product updated!');
    }
    setModal(null);
  };

  const handleDelete = () => {
    setProducts(prev => prev.filter(p => p.id !== editId));
    toast.success('Product deleted');
    setModal(null);
  };

  const ProductForm = () => (
    <div className="space-y-4">
      <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center">
        {form.image ? <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} /> : <div className="text-center text-slate-400"><Plus size={24} className="mx-auto mb-1" /><p className="text-xs">Enter URL below</p></div>}
      </div>
      <input className="input text-sm" placeholder="Image URL (optional)" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Product Name *</label><input className="input text-sm" placeholder="Product name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
        <div><label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Category</label>
          <select className="input text-sm" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            {CATS.filter(c=>c!=='all').map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div><label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Status</label>
          <select className="input text-sm" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
            <option value="active">Active</option><option value="draft">Draft</option><option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
        <div><label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Price ($) *</label><input type="number" className="input text-sm" placeholder="0.00" value={form.price} onChange={e => setForm({...form, price: e.target.value})} /></div>
        <div><label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Stock</label><input type="number" className="input text-sm" placeholder="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} /></div>
        <div className="col-span-2"><label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Description</label><textarea className="input text-sm resize-none" rows={2} placeholder="Product description..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
      </div>
      <div className="flex gap-3 pt-1">
        <button onClick={() => setModal(null)} className="flex-1 btn-secondary py-2.5">Cancel</button>
        <button onClick={handleSave} className="flex-1 btn-primary py-2.5">{modal === 'add' ? 'Add Product' : 'Save Changes'}</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{filtered.length} products</p>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus size={15} /> Add Product</button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-9 h-9 text-sm" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1 flex-wrap">
            {CATS.map(c => (
              <button key={c} onClick={() => { setCat(c); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${cat === c ? 'bg-brand-600 text-white' : 'btn-secondary'}`}>{c === 'all' ? 'All' : c}</button>
            ))}
          </div>
          <div className="flex gap-1 ml-auto">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-brand-600 text-white' : 'btn-secondary'}`}><Grid size={15} /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-brand-600 text-white' : 'btn-secondary'}`}><List size={15} /></button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {loading ? Array.from({length:12}).map((_,i)=>(
            <div key={i} className="card p-3"><div className="skeleton aspect-square rounded-lg mb-3" /><div className="skeleton h-3 w-3/4 mb-1.5" /><div className="skeleton h-3 w-1/2" /></div>
          )) : paged.length === 0 ? <div className="col-span-full"><EmptyState /></div> : paged.map(p => (
            <div key={p.id} className="card p-3 group hover:shadow-md transition-all">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-2 right-2"><Badge status={p.status} /></div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openEdit(p)} className="p-2 bg-white rounded-lg text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"><Pencil size={13} /></button>
                  <button onClick={() => openDelete(p)} className="p-2 bg-white rounded-lg text-slate-700 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate mb-1">{p.name}</p>
              <p className="text-[10px] text-slate-400 mb-1.5">{p.category}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-brand-600">${p.price}</span>
                <div className="flex items-center gap-0.5"><Star size={10} className="text-amber-400 fill-amber-400" /><span className="text-[10px] text-slate-400">{p.rating}</span></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>{['Product','Category','Price','Stock','Rating','Status','Actions'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody>
                {loading ? <TableSkeleton rows={10} cols={7} /> : paged.map(p => (
                  <tr key={p.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover border border-slate-100 dark:border-slate-700" />
                        <div><p className="font-medium text-xs text-slate-700 dark:text-slate-200 truncate max-w-[120px]">{p.name}</p><p className="text-[10px] text-slate-400 font-mono">{p.sku}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{p.category}</td>
                    <td className="px-4 py-3 font-semibold text-brand-600">${p.price}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">{p.stock}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" /><span className="text-xs">{p.rating}</span></div></td>
                    <td className="px-4 py-3"><Badge status={p.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 text-brand-500 transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => openDelete(p)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && <Pagination page={page} totalPages={Math.max(1, totalPages)} onChange={setPage} />}
        </div>
      )}
      {viewMode === 'grid' && !loading && totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      )}

      <Modal open={modal === 'add'} onClose={() => setModal(null)} title="Add Product"><ProductForm /></Modal>
      <Modal open={modal === 'edit'} onClose={() => setModal(null)} title="Edit Product"><ProductForm /></Modal>
      <Modal open={modal === 'delete'} onClose={() => setModal(null)} title="Delete Product" size="sm">
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">Are you sure you want to delete this product? This action cannot be undone.</p>
        <div className="flex gap-3"><button onClick={() => setModal(null)} className="flex-1 btn-secondary py-2.5">Cancel</button><button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors">Delete</button></div>
      </Modal>
    </div>
  );
}
