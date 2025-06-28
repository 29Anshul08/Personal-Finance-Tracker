import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useExpenses } from '../hooks/useExpenses';
import MonthlyReport from '../components/Reports/MonthlyReport';
import { FileText, Download, Calendar, TrendingUp, PieChart, BarChart3 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';

const Reports = () => {
  const { user } = useAuth();
  const { expenses, loading } = useExpenses(user?.id);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  const reportData = useMemo(() => {
    const monthStart = startOfMonth(new Date(selectedMonth + '-01'));
    const monthEnd = endOfMonth(new Date(selectedMonth + '-01'));
    
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    });

    const totalSpent = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Category breakdown
    const categorySpending = monthExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const categoryBreakdown = Object.entries(categorySpending)
      .map(([name, value]) => ({ name, value, color: '' }))
      .sort((a, b) => b.value - a.value);

    // Daily spending
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const dailySpending = daysInMonth.map(day => {
      const dayExpenses = monthExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return format(expenseDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      });
      
      return {
        date: format(day, 'dd'),
        amount: dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      };
    });

    // Top expenses
    const topExpenses = monthExpenses
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10)
      .map(expense => ({
        category: expense.category,
        amount: expense.amount,
        notes: expense.notes,
        date: format(new Date(expense.date), 'MMM dd, yyyy')
      }));

    return {
      month: format(new Date(selectedMonth + '-01'), 'MMMM yyyy'),
      totalSpent,
      categoryBreakdown,
      dailySpending,
      topExpenses,
      transactionCount: monthExpenses.length
    };
  }, [expenses, selectedMonth]);

  const yearlyData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(currentYear, i, 1);
      const monthKey = format(month, 'yyyy-MM');
      
      const monthExpenses = expenses.filter(expense => {
        return expense.date.startsWith(monthKey);
      });
      
      return {
        month: format(month, 'MMM'),
        amount: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      };
    });

    return months;
  }, [expenses]);

  const exportReport = () => {
    const csvContent = [
      ['Date', 'Category', 'Amount', 'Payment Method', 'Notes'],
      ...expenses
        .filter(expense => expense.date.startsWith(selectedMonth))
        .map(expense => [
          expense.date,
          expense.category,
          expense.amount.toString(),
          expense.payment_method,
          expense.notes || ''
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${selectedMonth}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Reports</h1>
          <p className="text-gray-600">Detailed analysis of your spending patterns</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={exportReport}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Monthly Total</p>
              <p className="text-2xl font-bold text-gray-900">₹{reportData.totalSpent.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.transactionCount}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.categoryBreakdown.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <PieChart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Daily</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{reportData.transactionCount > 0 ? (reportData.totalSpent / new Date(selectedMonth + '-01').getDate()).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Report */}
      {reportData.transactionCount > 0 ? (
        <MonthlyReport data={reportData} />
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No data for selected month</h3>
          <p className="text-gray-600">
            No expenses found for {format(new Date(selectedMonth + '-01'), 'MMMM yyyy')}. 
            Try selecting a different month or add some expenses.
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;