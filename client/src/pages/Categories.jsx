import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Edit2, Trash2, X, Check, FolderTree, ArrowUp, ArrowDown, Layers, Zap, Shield } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('expense');
  const [formData, setFormData] = useState({ name: '', type: 'expense' });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setFormData({ name: '', type: activeTab });
      setShowAddForm(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, type: category.type });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Purge this sector classification?')) {
      try { await api.delete(`/categories/${id}`); fetchCategories(); }
      catch (error) { console.error('Error:', error); }
    }
  };

  const cancelForm = () => {
    setFormData({ name: '', type: activeTab });
    setShowAddForm(false);
    setEditingCategory(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <div className="h-14 w-14 border-4 border-brand/20 border-t-brand rounded-full animate-spin"></div>
        <p className="mt-6 text-white/30 text-xs font-semibold uppercase tracking-[0.3em]">Indexing Sector Grid...</p>
      </div>
    );
  }

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');
  const activeCategories = activeTab === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-4 w-4 text-brand" />
            <span className="text-[10px] font-bold text-brand uppercase tracking-[0.3em]">Sector Management</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Categories</h1>
          <p className="text-white/30 text-sm mt-1">Classification matrix • {categories.length} sectors active</p>
        </div>
        <button onClick={() => { setFormData({ name: '', type: activeTab }); setShowAddForm(true); }} className="btn-blue">
          <Plus className="h-4 w-4 mr-2 inline" />
          New Sector
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-surface-card rounded-xl border border-white/10 p-1 max-w-md">
        <button
          onClick={() => setActiveTab('expense')}
          className={`flex-1 flex items-center justify-center py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
            activeTab === 'expense'
              ? 'bg-brand text-white shadow-[0_2px_15px_rgba(59,130,246,0.3)]'
              : 'text-white/40 hover:text-white'
          }`}
        >
          <ArrowDown className={`h-4 w-4 mr-2 transition-transform duration-500 ${activeTab === 'expense' ? 'rotate-0' : 'rotate-180'}`} />
          Outflow ({expenseCategories.length})
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`flex-1 flex items-center justify-center py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
            activeTab === 'income'
              ? 'bg-success text-white shadow-[0_2px_15px_rgba(16,185,129,0.3)]'
              : 'text-white/40 hover:text-white'
          }`}
        >
          <ArrowUp className={`h-4 w-4 mr-2 transition-transform duration-500 ${activeTab === 'income' ? 'rotate-0' : 'rotate-180'}`} />
          Inflow ({incomeCategories.length})
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
        {activeCategories.length > 0 ? (
          activeCategories.map((cat, index) => (
            <div key={cat._id} className="card card-hover p-5 group relative overflow-hidden">
              {/* Top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${activeTab === 'income' ? 'bg-success' : 'bg-brand'} opacity-60`}></div>

              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl border transition-all duration-300 group-hover:scale-110 ${
                    activeTab === 'income'
                      ? 'bg-success/10 border-success/20 text-success'
                      : 'bg-brand/10 border-brand/20 text-brand'
                  }`}>
                    <FolderTree className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">{cat.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`tag ${activeTab === 'income' ? 'bg-success/10 text-success border border-success/20' : 'bg-brand/10 text-brand border border-brand/20'}`}>
                        {activeTab === 'income' ? 'INFLOW' : 'OUTFLOW'}
                      </span>
                      <span className="text-[10px] text-white/20 font-mono">#{String(index + 1).padStart(3, '0')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(cat)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-brand/20 text-white/50 hover:text-brand transition-all">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(cat._id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-danger/20 text-white/50 hover:text-danger transition-all">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Bottom info row */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${activeTab === 'income' ? 'bg-success' : 'bg-brand'}`}></div>
                  <span className="text-[10px] text-white/30 font-semibold uppercase tracking-wider">Active</span>
                </div>
                <span className="text-[10px] text-white/15 font-mono">{cat._id.substring(0, 8)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full card p-16 text-center animate-fade-in">
            <div className="animate-float">
              <FolderTree className="h-12 w-12 text-brand/30 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Null Sector</h3>
            <p className="text-white/30 text-sm">No {activeTab} classification nodes detected. Initialize a new sector.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={cancelForm} />
          <div className="card card-glow w-full max-w-md p-8 z-10 animate-scale-in relative">
            {/* Top glow line */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-60"></div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-extrabold text-white">
                  {editingCategory ? 'Override Sector' : 'New Classification'}
                </h3>
                <p className="text-xs text-white/30 mt-1 uppercase tracking-wider font-medium">
                  {editingCategory ? 'Modify sector parameters' : 'Initialize sector protocol'}
                </p>
              </div>
              <button onClick={cancelForm} className="p-2 text-white/30 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Sector Designation</label>
                <input type="text" required className="input text-lg font-semibold" placeholder="e.g. Food, Salary..."
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="label">Stream Type</label>
                <div className="flex bg-surface rounded-xl border border-white/10 p-1">
                  <button type="button" onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${formData.type === 'expense' ? 'bg-brand text-white shadow-[0_2px_10px_rgba(59,130,246,0.3)]' : 'text-white/40 hover:text-white'}`}>
                    Outflow Drain
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${formData.type === 'income' ? 'bg-success text-white shadow-[0_2px_10px_rgba(16,185,129,0.3)]' : 'text-white/40 hover:text-white'}`}>
                    Inflow Control
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button type="submit" className="btn-blue flex-1">
                  <Check className="h-4 w-4 mr-2 inline" />
                  {editingCategory ? 'Execute Override' : 'Commit Sector'}
                </button>
                <button type="button" onClick={cancelForm} className="btn-outline flex-1">Abort</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
