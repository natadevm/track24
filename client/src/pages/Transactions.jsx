import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Edit2, Trash2, X, Check, Filter, ArrowUp, ArrowDown, Search, Zap, Clock, Hash, Database } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ category: '', type: '', startDate: '', endDate: '' });
  const [formData, setFormData] = useState({
    amount: '', type: 'expense', categoryId: '', description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => { fetchData(); }, [filters]);

  const fetchData = async () => {
    try {
      const [transactionsRes, categoriesRes] = await Promise.all([
        api.get('/transactions', { params: filters }),
        api.get('/categories')
      ]);
      setTransactions(transactionsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction._id}`, formData);
      } else {
        await api.post('/transactions', formData);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount, type: transaction.type,
      categoryId: transaction.categoryId._id,
      description: transaction.description || '',
      date: new Date(transaction.date).toISOString().split('T')[0]
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Purge this matrix entry?')) {
      try { await api.delete(`/transactions/${id}`); fetchData(); }
      catch (error) { console.error('Error:', error); }
    }
  };

  const resetForm = () => {
    setFormData({ amount: '', type: 'expense', categoryId: '', description: '', date: new Date().toISOString().split('T')[0] });
    setShowAddForm(false);
    setEditingTransaction(null);
  };

  const resetFilters = () => setFilters({ category: '', type: '', startDate: '', endDate: '' });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <div className="h-14 w-14 border-4 border-brand/20 border-t-brand rounded-full animate-spin"></div>
        <p className="mt-6 text-white/30 text-xs font-semibold uppercase tracking-[0.3em]">Scanning Ledger Matrix...</p>
      </div>
    );
  }

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Database className="h-4 w-4 text-brand" />
            <span className="text-[10px] font-bold text-brand uppercase tracking-[0.3em]">Financial Ledger</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Transactions</h1>
          <p className="text-white/30 text-sm mt-1">{transactions.length} matrix entries detected</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFilters(!showFilters)}
            className={`btn-outline ${showFilters ? '!border-brand !text-brand' : ''}`}>
            <Filter className="h-4 w-4 mr-2 inline" />
            Scan Filter
          </button>
          <button onClick={() => setShowAddForm(true)} className="btn-blue">
            <Plus className="h-4 w-4 mr-2 inline" />
            New Entry
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card card-glow p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-3.5 w-3.5 text-brand" />
            <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Diagnostic Parameters</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="label">Vector Type</label>
              <select className="input" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
                <option value="">All Vectors</option>
                <option value="income">Inflow</option>
                <option value="expense">Outflow</option>
              </select>
            </div>
            <div>
              <label className="label">Sector</label>
              <select className="input" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
                <option value="">All Sectors</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Timeline Start</label>
              <input type="date" className="input" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
            </div>
            <div>
              <label className="label">Timeline End</label>
              <input type="date" className="input" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={resetFilters} className="text-xs text-white/40 hover:text-brand font-semibold transition-colors uppercase tracking-wider">
              Reset Parameters
            </button>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div className="space-y-3 stagger">
        {transactions.length > 0 ? (
          transactions.map((t) => (
            <div key={t._id} className="card card-hover p-5 group flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
              {/* Left accent */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${t.type === 'income' ? 'bg-success' : 'bg-brand'}`}></div>

              <div className="flex items-center space-x-4 pl-2">
                <div className={`p-3 rounded-xl border transition-transform duration-300 group-hover:scale-110 ${
                  t.type === 'income'
                    ? 'bg-success/10 border-success/20 text-success'
                    : 'bg-brand/10 border-brand/20 text-brand'
                }`}>
                  {t.type === 'income' ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.description || 'Unnamed Vector'}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="tag bg-brand/10 text-brand border border-brand/20">{t.categoryId.name}</span>
                    <span className="flex items-center text-[10px] text-white/30 font-medium">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(t.date).toLocaleDateString()}
                    </span>
                    <span className="hidden sm:flex items-center text-[10px] text-white/20 font-mono">
                      <Hash className="h-3 w-3 mr-0.5" />
                      {t._id.substring(0, 8)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 pl-2 sm:pl-0">
                <p className={`text-xl font-extrabold tabular-nums ${t.type === 'income' ? 'text-success' : 'text-white'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </p>
                <div className="flex items-center gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(t)} className="p-2 rounded-lg bg-white/5 hover:bg-brand/20 text-white/50 hover:text-brand transition-all">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(t._id)} className="p-2 rounded-lg bg-white/5 hover:bg-danger/20 text-white/50 hover:text-danger transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card p-16 text-center animate-fade-in">
            <div className="animate-float">
              <Search className="h-12 w-12 text-white/15 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Null Archive</h3>
            <p className="text-white/30 text-sm">No matrix entries detected. Initialize your first transaction vector.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={resetForm} />
          <div className="card card-glow w-full max-w-xl p-8 z-10 animate-scale-in relative">
            {/* Top glow line */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-60"></div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-extrabold text-white">
                  {editingTransaction ? 'Override Matrix Entry' : 'Register New Vector'}
                </h3>
                <p className="text-xs text-white/30 mt-1 uppercase tracking-wider font-medium">
                  {editingTransaction ? 'Modify existing data point' : 'Initialize transaction protocol'}
                </p>
              </div>
              <button onClick={resetForm} className="p-2 text-white/30 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Magnitude (Amount)</label>
                  <input type="number" step="0.01" required className="input text-lg font-bold" placeholder="0.00"
                    value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
                </div>
                <div>
                  <label className="label">Vector Class</label>
                  <div className="flex bg-surface rounded-xl border border-white/10 p-1">
                    <button type="button" onClick={() => setFormData({ ...formData, type: 'expense', categoryId: '' })}
                      className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${formData.type === 'expense' ? 'bg-brand text-white shadow-[0_2px_10px_rgba(59,130,246,0.3)]' : 'text-white/40 hover:text-white'}`}>
                      Outflow
                    </button>
                    <button type="button" onClick={() => setFormData({ ...formData, type: 'income', categoryId: '' })}
                      className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${formData.type === 'income' ? 'bg-success text-white shadow-[0_2px_10px_rgba(16,185,129,0.3)]' : 'text-white/40 hover:text-white'}`}>
                      Inflow
                    </button>
                  </div>
                </div>
                <div>
                  <label className="label">Sector Index</label>
                  <select required className="input" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}>
                    <option value="">Select sector...</option>
                    {filteredCategories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Timeline Lock</label>
                  <input type="date" required className="input" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="label">Identification Tag</label>
                <textarea rows={2} className="input" placeholder="Describe this vector..."
                  value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button type="submit" className="btn-blue flex-1">
                  <Check className="h-4 w-4 mr-2 inline" />
                  {editingTransaction ? 'Execute Override' : 'Commit Protocol'}
                </button>
                <button type="button" onClick={resetForm} className="btn-outline flex-1">Abort</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
