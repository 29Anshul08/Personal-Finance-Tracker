import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useExpenses } from '../hooks/useExpenses';
import ExpenseForm from '../components/Expenses/ExpenseForm';
import ExpenseList from '../components/Expenses/ExpenseList';
import { Plus } from 'lucide-react';
import { Expense } from '../types';
import toast from 'react-hot-toast';

const Expenses = () => {
  const { user } = useAuth();
  const { expenses, loading, addExpense, updateExpense, deleteExpense } = useExpenses(user?.id);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

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

  const handleUpdateExpense = async (expenseData: {
    amount: number;
    category: string;
    date: string;
    payment_method: string;
    notes?: string;
  }) => {
    if (!editingExpense) return;
    
    const { error } = await updateExpense(editingExpense.id, expenseData);
    if (error) {
      toast.error('Failed to update expense');
      throw error;
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      const { error } = await deleteExpense(id);
      if (error) {
        toast.error('Failed to delete expense');
      } else {
        toast.success('Expense deleted successfully');
      }
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExpense(null);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Expenses</h1>
          <p className="text-gray-600">Track and manage your daily expenses</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Expense</span>
        </button>
      </div>

      <ExpenseList
        expenses={expenses}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
      />

      {showForm && (
        <ExpenseForm
          onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
          onClose={handleCloseForm}
          initialData={editingExpense ? {
            amount: editingExpense.amount,
            category: editingExpense.category,
            date: editingExpense.date,
            payment_method: editingExpense.payment_method,
            notes: editingExpense.notes,
          } : undefined}
          isEditing={!!editingExpense}
        />
      )}
    </div>
  );
};

export default Expenses;