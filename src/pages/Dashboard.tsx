import React, { useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useExpenses } from '../hooks/useExpenses';
import StatsCard from '../components/Dashboard/StatsCard';
import SpendingChart from '../components/Dashboard/SpendingChart';
import SpendingTrend from '../components/Dashboard/SpendingTrend';
import ExpenseForm from '../components/Expenses/ExpenseForm';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  PieChart,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths, eachDayOfInterval } from 'date-fns';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { expenses, loading, addExpense } = useExpenses(user?.id);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const handleAddExpense = async (expenseData: {
    amount: number;
    category: string;
    date: string;
    payment_method: string;
    notes?: string;
  }) => {
    const { error } = await addExpense(expenseData);
    if (error) {
      toast.error('Failed to add expense');
      throw error;
    }
  };

  const dashboardData = useMemo(() => {
    const now = new Date();
    const currentMonth = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const lastMonth = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= currentMonth && expenseDate <= currentMonthEnd;
    });

    const lastMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= lastMonth && expenseDate <= lastMonthEnd;
    });

    const totalCurrentMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalLastMonth = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Category breakdown
    const categorySpending = currentMonthExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const categoryChartData = Object.entries(categorySpending).map(([name, value]) => ({
      name,
      value,
      color: ''
    }));

    // Top category
    const topCategory = Object.entries(categorySpending).sort(([,a], [,b]) => b - a)[0];

    // Payment method breakdown
    const paymentMethods = currentMonthExpenses.reduce((acc, expense) => {
      acc[expense.payment_method] = (acc[expense.payment_method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPaymentMethods = Object.entries(paymentMethods)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([method, count]) => ({ method, count }));

    // Spending trend for last 30 days
    const last30Days = eachDayOfInterval({
      start: subMonths(now, 1),
      end: now
    });

    const trendData = last30Days.map(day => {
      const dayExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return format(expenseDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      });
      
      return {
        date: format(day, 'MM/dd'),
        amount: dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      };
    });

    return {
      totalCurrentMonth,
      totalLastMonth,
      categoryChartData,
      topCategory,
      topPaymentMethods,
      trendData,
      transactionCount: currentMonthExpenses.length
    };
  }, [expenses]);

  const monthlyChange = dashboardData.totalCurrentMonth - dashboardData.totalLastMonth;
  const monthlyChangePercent = dashboardData.totalLastMonth > 0 
    ? ((monthlyChange / dashboardData.totalLastMonth) * 100).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-600">Here's your financial overview for {format(new Date(), 'MMMM yyyy')}</p>
          </div>
          <button
            onClick={() => setShowExpenseForm(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="This Month's Spending"
            value={`₹${dashboardData.totalCurrentMonth.toFixed(2)}`}
            icon={DollarSign}
            trend={{
              value: `${monthlyChangePercent}%`,
              isPositive: monthlyChange < 0
            }}
            color="blue"
          />
          <StatsCard
            title="Transactions"
            value={dashboardData.transactionCount.toString()}
            icon={CreditCard}
            color="emerald"
          />
          <StatsCard
            title="Top Category"
            value={dashboardData.topCategory?.[0] || 'None'}
            icon={PieChart}
            color="orange"
          />
          <StatsCard
            title="Top Payment Method"
            value={dashboardData.topPaymentMethods[0]?.method || 'None'}
            icon={TrendingUp}
            color="red"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SpendingChart data={dashboardData.categoryChartData} />
          <SpendingTrend data={dashboardData.trendData} />
        </div>

        {/* Quick Insights */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
            Quick Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Monthly Comparison</h4>
              <p className="text-sm text-blue-700">
                {monthlyChange > 0 
                  ? `You spent ₹${monthlyChange.toFixed(2)} more than last month`
                  : monthlyChange < 0
                  ? `You saved ₹${Math.abs(monthlyChange).toFixed(2)} compared to last month`
                  : 'Your spending is the same as last month'
                }
              </p>
            </div>
            
            {dashboardData.topCategory && (
              <div className="bg-emerald-50 rounded-lg p-4">
                <h4 className="font-medium text-emerald-900 mb-2">Top Spending Category</h4>
                <p className="text-sm text-emerald-700">
                  {dashboardData.topCategory[0]}: ₹{dashboardData.topCategory[1].toFixed(2)}
                </p>
              </div>
            )}
            
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-medium text-orange-900 mb-2">Payment Preferences</h4>
              <p className="text-sm text-orange-700">
                {dashboardData.topPaymentMethods.slice(0, 2).map(pm => pm.method).join(', ')} are your most used methods
              </p>
            </div>
          </div>
        </div>

        {/* Expense Form Modal */}
        {showExpenseForm && (
          <ExpenseForm
            onSubmit={handleAddExpense}
            onClose={() => setShowExpenseForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;