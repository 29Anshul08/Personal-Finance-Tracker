import React from 'react';
import { Edit2, Trash2, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Budget } from '../../types';

interface BudgetCardProps {
  budget: Budget;
  currentSpent: number;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget, currentSpent, onEdit, onDelete }) => {
  const spentPercentage = (currentSpent / budget.monthly_limit) * 100;
  const remaining = budget.monthly_limit - currentSpent;
  
  const getStatusColor = () => {
    if (spentPercentage >= 100) return 'text-red-600';
    if (spentPercentage >= 80) return 'text-orange-600';
    return 'text-green-600';
  };

  const getStatusIcon = () => {
    if (spentPercentage >= 100) return <AlertTriangle className="w-5 h-5 text-red-600" />;
    if (spentPercentage >= 80) return <Clock className="w-5 h-5 text-orange-600" />;
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  };

  const getStatusText = () => {
    if (spentPercentage >= 100) return 'Over Budget';
    if (spentPercentage >= 80) return 'Approaching Limit';
    return 'Within Budget';
  };

  const getProgressBarColor = () => {
    if (spentPercentage >= 100) return 'bg-red-500';
    if (spentPercentage >= 80) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{budget.category}</h3>
          <p className="text-sm text-gray-500">{budget.month}</p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Spent</span>
          <span className="text-sm font-medium text-gray-900">
            ₹{currentSpent.toFixed(2)} / ₹{budget.monthly_limit.toFixed(2)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
            style={{ width: `${Math.min(spentPercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            {spentPercentage.toFixed(1)}% used
          </span>
          <span className={`text-xs font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {remaining >= 0 ? `₹${remaining.toFixed(2)} remaining` : `₹${Math.abs(remaining).toFixed(2)} over`}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <button
          onClick={() => onEdit(budget)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(budget.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default BudgetCard;