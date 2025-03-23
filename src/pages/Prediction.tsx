import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import type { Expense, ExpensePrediction } from '../types';

export function Prediction() {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [predictions, setPredictions] = useState<ExpensePrediction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'All Categories',
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Other'
  ];

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  async function fetchData() {
    try {
      // Fetch historical expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: true });

      if (expensesError) throw expensesError;
      setExpenses(expensesData || []);

      // Fetch predictions
      const { data: predictionsData, error: predictionsError } = await supabase
        .from('expense_predictions')
        .select('*')
        .order('date', { ascending: true });

      if (predictionsError) throw predictionsError;
      setPredictions(predictionsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const getChartData = () => {
    const historicalData = expenses
      .filter(expense => selectedCategory === 'all' || expense.category === selectedCategory)
      .map(expense => ({
        date: expense.date,
        amount: expense.amount,
        type: 'Historical'
      }));

    const predictionData = predictions.map(pred => ({
      date: pred.date,
      amount: pred.predicted_amount,
      type: 'Predicted'
    }));

    return [...historicalData, ...predictionData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold">AI Expense Predictions</h2>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {categories.map((category) => (
              <option 
                key={category} 
                value={category === 'All Categories' ? 'all' : category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Historical"
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8B5CF6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
                name="Predicted"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold">Spending Insights</h3>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600">
              Based on your historical spending patterns, our AI predicts your expenses will
              {predictions.length > 0 && predictions[0].predicted_amount > 0
                ? ` increase by approximately ${((predictions[0].predicted_amount / expenses[expenses.length - 1]?.amount - 1) * 100).toFixed(1)}% `
                : ' change '} 
              in the next month.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <AlertCircle className="w-4 h-4" />
              <p>Predictions are based on your spending history and market trends</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">AI Recommendations</h3>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600">
              To optimize your spending, consider:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Setting a budget for categories with increasing trends</li>
              <li>Reviewing recurring expenses for potential savings</li>
              <li>Planning ahead for predicted expense increases</li>
              <li>Monitoring seasonal spending patterns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}