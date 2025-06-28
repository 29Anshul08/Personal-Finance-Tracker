import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface MonthlyReportProps {
  data: {
    month: string;
    totalSpent: number;
    categoryBreakdown: Array<{ name: string; value: number; color: string }>;
    dailySpending: Array<{ date: string; amount: number }>;
    topExpenses: Array<{ category: string; amount: number; notes?: string; date: string }>;
  };
}

const MonthlyReport: React.FC<MonthlyReportProps> = ({ data }) => {
  const COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'
  ];

  const categoryDataWithColors = data.categoryBreakdown.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="space-y-6">
      {/* Monthly Overview */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Overview - {data.month}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-1">Total Spent</h4>
            <p className="text-2xl font-bold text-blue-600">₹{data.totalSpent.toFixed(2)}</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-emerald-900 mb-1">Average Daily</h4>
            <p className="text-2xl font-bold text-emerald-600">
              ₹{(data.totalSpent / new Date(data.month + '-01').getDate()).toFixed(2)}
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-orange-900 mb-1">Top Category</h4>
            <p className="text-lg font-bold text-orange-600">
              {data.categoryBreakdown[0]?.name || 'None'}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDataWithColors}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDataWithColors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Spending Trend */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Spending Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dailySpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                <Bar dataKey="amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Expenses */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Expenses</h3>
        <div className="space-y-3">
          {data.topExpenses.slice(0, 5).map((expense, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{expense.category}</p>
                <p className="text-sm text-gray-600">{expense.notes || 'No description'}</p>
                <p className="text-xs text-gray-500">{expense.date}</p>
              </div>
              <span className="text-lg font-bold text-gray-900">₹{expense.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;