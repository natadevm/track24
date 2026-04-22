import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, CreditCard, Activity, ArrowUpRight, ArrowDownRight, Zap, Shield, Database } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-card border border-white/20 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-[10px] text-white/40 mb-1 font-semibold uppercase tracking-wider">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-bold text-white">
          <span style={{ color: entry.color }} className="mr-1">{entry.name}:</span>
          {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/transactions/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <div className="h-14 w-14 border-4 border-brand/20 border-t-brand rounded-full animate-spin"></div>
        <p className="mt-6 text-white/30 text-xs font-semibold uppercase tracking-[0.3em]">Initializing Matrix...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card card-glow p-16 text-center max-w-lg mx-auto mt-20 animate-fade-in">
        <div className="animate-float">
          <Activity className="h-14 w-14 text-brand mx-auto mb-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-2">Matrix Void Detected</h2>
        <p className="text-white/40 text-sm mb-8">Initialize financial entropy by creating your first transaction vector.</p>
        <button className="btn-blue" onClick={() => window.location.href = '/transactions'}>
          <Zap className="h-4 w-4 mr-2 inline" />
          Initialize Ledger Protocol
        </button>
      </div>
    );
  }

  const expenseChartData = stats.expenseByCategory.map(item => ({ name: item._id, value: item.total }));
  const incomeChartData = stats.incomeByCategory.map(item => ({ name: item._id, value: item.total }));

  const monthlyData = stats.monthlyData.reduce((acc, item) => {
    const monthYear = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
    const existing = acc.find(d => d.month === monthYear);
    if (existing) {
      existing[item._id.type] = item.total;
    } else {
      acc.push({
        month: monthYear,
        income: item._id.type === 'income' ? item.total : 0,
        expense: item._id.type === 'expense' ? item.total : 0,
      });
    }
    return acc;
  }, []);

  const balanceTrendData = stats.balanceTrend.map(item => ({
    month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
    balance: item.balance,
  }));

  const statCards = [
    { title: "Total Inflow", subtitle: "Revenue Stream", value: formatCurrency(stats.totalIncome), icon: TrendingUp, color: "text-success", bgColor: "bg-success/10", borderColor: "border-success/20", arrow: ArrowUpRight },
    { title: "Total Outflow", subtitle: "Drain Vector", value: formatCurrency(stats.totalExpense), icon: TrendingDown, color: "text-danger", bgColor: "bg-danger/10", borderColor: "border-danger/20", arrow: ArrowDownRight },
    { title: "Net Balance", subtitle: "System Equilibrium", value: formatCurrency(stats.balance), icon: Wallet, color: stats.balance >= 0 ? "text-success" : "text-danger", bgColor: "bg-brand/10", borderColor: "border-brand/20", arrow: stats.balance >= 0 ? ArrowUpRight : ArrowDownRight },
    { title: "Data Points", subtitle: "Matrix Entries", value: stats.totalTransactions || "—", icon: Database, color: "text-brand-light", bgColor: "bg-brand/10", borderColor: "border-brand/20", arrow: ArrowUpRight },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-brand" />
            <span className="text-[10px] font-bold text-brand uppercase tracking-[0.3em]">Command Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard</h1>
          <p className="text-white/30 text-sm mt-1">Financial matrix overview • Real-time analytics</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">Systems Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        {statCards.map(({ title, subtitle, value, icon: Icon, color, bgColor, borderColor, arrow: Arrow }, i) => (
          <div key={i} className="card card-hover p-5 group relative overflow-hidden">
            {/* Top accent line */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 ${i === 0 ? 'bg-success' : i === 1 ? 'bg-danger' : 'bg-brand'} opacity-60`}></div>
            
            <div className="flex items-center justify-between mb-4">
              <div className={`${bgColor} ${borderColor} border p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <Arrow className={`h-4 w-4 ${color} opacity-40 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-0.5`} />
            </div>
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">{subtitle}</p>
            <p className="text-xs font-semibold text-white/60 mt-0.5">{title}</p>
            <p className="text-2xl font-extrabold text-white mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row: Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <div className="card p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-danger rounded-full mr-3"></div>
              <div>
                <h2 className="text-base font-bold text-white">Expense Matrix</h2>
                <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider">Outflow Distribution</p>
              </div>
            </div>
          </div>
          {expenseChartData.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={expenseChartData} cx="50%" cy="50%" outerRadius={85} innerRadius={55} dataKey="value" stroke="none" strokeWidth={0}>
                    {expenseChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2 w-full">
                {expenseChartData.map((entry, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="text-xs text-white/50 font-medium truncate">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingDown className="h-10 w-10 text-white/15 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No drain vectors detected</p>
            </div>
          )}
        </div>

        {/* Income Breakdown */}
        <div className="card p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-1 h-6 bg-success rounded-full mr-3"></div>
              <div>
                <h2 className="text-base font-bold text-white">Income Matrix</h2>
                <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider">Inflow Distribution</p>
              </div>
            </div>
          </div>
          {incomeChartData.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={incomeChartData} cx="50%" cy="50%" outerRadius={85} innerRadius={55} dataKey="value" stroke="none" strokeWidth={0}>
                    {incomeChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2 w-full">
                {incomeChartData.map((entry, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="text-xs text-white/50 font-medium truncate">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="h-10 w-10 text-white/15 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No inflow vectors detected</p>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="card p-6 animate-fade-in">
        <div className="flex items-center mb-6">
          <div className="w-1 h-6 bg-brand rounded-full mr-3"></div>
          <div>
            <h2 className="text-base font-bold text-white">Temporal Analysis</h2>
            <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider">Monthly Inflow vs Outflow Matrix</p>
          </div>
        </div>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} />
              <YAxis tickFormatter={(v) => `${v.toLocaleString()}`} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="#10b981" name="Inflow" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" name="Outflow" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12">
            <Wallet className="h-10 w-10 text-white/15 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No temporal data available</p>
          </div>
        )}
      </div>

      {/* Balance Trend */}
      <div className="card p-6 animate-fade-in">
        <div className="flex items-center mb-6">
          <div className="w-1 h-6 bg-brand-light rounded-full mr-3"></div>
          <div>
            <h2 className="text-base font-bold text-white">Stability Trajectory</h2>
            <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider">Balance Evolution Vector</p>
          </div>
        </div>
        {balanceTrendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={balanceTrendData}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} />
              <YAxis tickFormatter={(v) => `${v.toLocaleString()}`} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} fill="url(#balanceGradient)" dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#60a5fa' }} name="Balance" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12">
            <CreditCard className="h-10 w-10 text-white/15 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No trajectory data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
