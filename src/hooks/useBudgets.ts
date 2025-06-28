import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Budget } from '../types';

export const useBudgets = (userId: string | undefined) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    
    fetchBudgets();
  }, [userId]);

  const fetchBudgets = async () => {
    if (!userId) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .order('month', { ascending: false });

    if (error) {
      console.error('Error fetching budgets:', error);
    } else {
      setBudgets(data || []);
    }
    setLoading(false);
  };

  const addBudget = async (budget: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('budgets')
      .insert([{ ...budget, user_id: userId }])
      .select()
      .single();

    if (error) {
      console.error('Error adding budget:', error);
      return { error };
    }

    setBudgets(prev => [data, ...prev]);
    return { data, error: null };
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    const { data, error } = await supabase
      .from('budgets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating budget:', error);
      return { error };
    }

    setBudgets(prev => prev.map(budget => 
      budget.id === id ? { ...budget, ...data } : budget
    ));
    return { data, error: null };
  };

  const deleteBudget = async (id: string) => {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting budget:', error);
      return { error };
    }

    setBudgets(prev => prev.filter(budget => budget.id !== id));
    return { error: null };
  };

  return {
    budgets,
    loading,
    addBudget,
    updateBudget,
    deleteBudget,
    refetch: fetchBudgets,
  };
};