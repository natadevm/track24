import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, CreditCard } from 'lucide-react';
import { formatCurrency, formatCurrencySimple } from '../utils/currency';

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-gray-500 py-8">
        No data available. Start adding transactions to see your dashboard.
      </div>
    );
  }


  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  // Prepare data for charts
  const expenseChartData = stats.expenseByCategory.map(item => ({
    name: item._id,
    value: item.total
  }));

  const incomeChartData = stats.incomeByCategory.map(item => ({
    name: item._id,
    value: item.total
  }));

  // Prepare monthly data for bar chart
  const monthlyData = stats.monthlyData.reduce((acc, item) => {
    const monthYear = `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`;
    const existing = acc.find(d => d.month === monthYear);
    
    if (existing) {
      existing[item._id.type] = item.total;
    } else {
      acc.push({
        month: monthYear,
        income: item._id.type === 'income' ? item.total : 0,
        expense: item._id.type === 'expense' ? item.total : 0
      });
    }
    return acc;
  }, []);

  // Prepare balance trend data
  const balanceTrendData = stats.balanceTrend.map(item => ({
    month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
    balance: item.balance
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-lg p-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-800">Total Income</p>
                <p className="text-xl lg:text-2xl font-bold text-green-900">
                  {formatCurrency(stats.totalIncome)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-500 rounded-lg p-3">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-red-800">Total Expense</p>
                <p className="text-xl lg:text-2xl font-bold text-red-900">
                  {formatCurrency(stats.totalExpense)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-800">Balance</p>
                <p className={`text-xl lg:text-2xl font-bold ${
                  stats.balance >= 0 ? 'text-green-900' : 'text-red-900'
                }`}>
                  {formatCurrency(stats.balance)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-lg p-3">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-800">Net Change</p>
                <p className={`text-xl lg:text-2xl font-bold ${
                  stats.balance >= 0 ? 'text-green-900' : 'text-red-900'
                }`}>
                  {stats.balance >= 0 ? '+' : ''}{formatCurrency(stats.balance)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Expense Breakdown */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="w-2 h-8 bg-red-500 rounded-full mr-3"></div>
            <h2 className="text-lg font-bold text-gray-900">Expense Breakdown</h2>
          </div>
          {expenseChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
              <TrendingDown className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p>No expense data available</p>
            </div>
          )}
        </div>

        {/* Income Breakdown */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="w-2 h-8 bg-green-500 rounded-full mr-3"></div>
            <h2 className="text-lg font-bold text-gray-900">Income Breakdown</h2>
          </div>
          {incomeChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incomeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
              <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p>No income data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center mb-4">
          <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
          <h2 className="text-lg font-bold text-gray-900">Monthly Income vs Expense</h2>
        </div>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
              <YAxis tickFormatter={(value) => `ETB ${value.toLocaleString()}`} tick={{ fill: '#6b7280' }} />
              <Tooltip 
                formatter={(value) => formatCurrency(value)} 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="income" fill="#10B981" name="Income" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expense" fill="#EF4444" name="Expense" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
            <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p>No monthly data available</p>
          </div>
        )}
      </div>

      {/* Balance Trend */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center mb-4">
          <div className="w-2 h-8 bg-purple-500 rounded-full mr-3"></div>
          <h2 className="text-lg font-bold text-gray-900">Balance Trend</h2>
        </div>
        {balanceTrendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={balanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
              <YAxis tickFormatter={(value) => `ETB ${value.toLocaleString()}`} tick={{ fill: '#6b7280' }} />
              <Tooltip 
                formatter={(value) => formatCurrency(value)} 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
                name="Balance"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p>No balance trend data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
