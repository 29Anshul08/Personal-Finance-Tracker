import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBudgets } from '../hooks/useBudgets';
import { useExpenses } from '../hooks/useExpenses';
import BudgetForm from '../components/Budgets/BudgetForm';
import BudgetCard from '../components/Budgets/BudgetCard';
import { Plus, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { Budget } from '../types';
import toast from 'react-hot-toast';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const Budgets = () => {
  const { user } = useAuth();
  const { budgets, loading: budgetsLoading, addBudget, updateBudget, deleteBudget } = useBudgets(user?.id);
  const { expenses, loading: expensesLoading } = useExpenses(user?.id);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const currentMonth = format(new Date(), 'yyyy-MM');
  
  const budgetData = useMemo(() => {
    const currentMonthBudgets = budgets.filter(budget => budget.month === currentMonth);
    
    const budgetsWithSpending = currentMonthBudgets.map(budget => {
      const monthStart = startOfMonth(new Date(budget.month + '-01'));
      const monthEnd = endOfMonth(new Date(budget.month + '-01'));
      
      const categoryExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expense.category === budget.category &&
               expenseDate >= monthStart &&
               expenseDate <= monthEnd;
      });
      
      const currentSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        ...budget,
        currentSpent,
        percentage: (currentSpent / budget.monthly_limit) * 100
      };
    });

    const totalBudget = budgetsWithSpending.reduce((sum, budget) => sum + budget.monthly_limit, 0);
    const totalSpent = budgetsWithSpending.reduce((sum, budget) => sum + budget.currentSpent, 0);
    const overBudgetCount = budgetsWithSpending.filter(budget => budget.percentage >= 100).length;
    const approachingLimitCount = budgetsWithSpending.filter(budget => budget.percentage >= 80 && budget.percentage < 100).length;

    return {
      budgetsWithSpending,
      totalBudget,
      totalSpent,
      overBudgetCount,
      approachingLimitCount
    };
  }, [budgets, expenses, currentMonth]);

  const handleAddBudget = async (budgetData: {
    category: string;
    monthly_limit: number;
    month: string;
  }) => {
    const { error } = await addBudget(budgetData);
    if (error) {
      toast.error('Failed to create budget');
      throw error;
    }
  };

  const handleUpdateBudget = async (budgetData: {
    category: string;
    monthly_limit: number;
    month: string;
  }) => {
    if (!editingBudget) return;
    
    const { error } = await updateBudget(editingBudget.id, budgetData);
    if (error) {
      toast.error('Failed to update budget');
      throw error;
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      const { error } = await deleteBudget(id);
      if (error) {
        toast.error('Failed to delete budget');
      } else {
        toast.success('Budget deleted successfully');
      }
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBudget(null);
  };

  if (budgetsLoading || expensesLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Management</h1>
          <p className="text-gray-600">Set monthly spending limits and track your progress</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Create Budget</span>
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">₹{budgetData.totalBudget.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">₹{budgetData.totalSpent.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Over Budget</p>
              <p className="text-2xl font-bold text-red-600">{budgetData.overBudgetCount}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Approaching Limit</p>
              <p className="text-2xl font-bold text-orange-600">{budgetData.approachingLimitCount}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Budget Cards */}
      {budgetData.budgetsWithSpending.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No budgets set for this month</h3>
          <p className="text-gray-600 mb-6">
            Create your first budget to start tracking your spending limits
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgetData.budgetsWithSpending.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              currentSpent={budget.currentSpent}
              onEdit={handleEditBudget}
              onDelete={handleDeleteBudget}
            />
          ))}
        </div>
      )}

      {/* Budget Form Modal */}
      {showForm && (
        <BudgetForm
          onSubmit={editingBudget ? handleUpdateBudget : handleAddBudget}
          onClose={handleCloseForm}
          initialData={editingBudget ? {
            category: editingBudget.category,
            monthly_limit: editingBudget.monthly_limit,
            month: editingBudget.month,
          } : undefined}
          isEditing={!!editingBudget}
        />
      )}
    </div>
  );
};

export default Budgets;