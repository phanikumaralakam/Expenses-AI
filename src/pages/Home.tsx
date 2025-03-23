import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  IndianRupee, 
  Calendar, 
  PieChart, 
  Clock, 
  ArrowRight,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Expense } from '../types';

export function Home() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchRecentExpenses();
    }
  }, [user]);

  async function fetchRecentExpenses() {
    try {
      const { data, error: fetchError } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false })
        .limit(5);

      if (fetchError) throw fetchError;
      setExpenses(data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError('Failed to load recent expenses');
    } finally {
      setLoading(false);
    }
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  
  // Get the highest expense
  const highestExpense = expenses.reduce(
    (max, exp) => (exp.amount > max.amount ? exp : max),
    { amount: 0 } as Expense
  );

  // Calculate month-over-month change
  const currentMonth = new Date().getMonth();
  const currentMonthExpenses = expenses.filter(
    exp => new Date(exp.date).getMonth() === currentMonth
  );
  const previousMonthExpenses = expenses.filter(
    exp => new Date(exp.date).getMonth() === currentMonth - 1
  );
  
  const currentMonthTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const previousMonthTotal = previousMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const monthOverMonthChange = previousMonthTotal !== 0
    ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100
    : 0;

  if (!user) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-emerald-50 p-4 rounded-full mb-4">
          <IndianRupee className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to ExpenseAI
        </h1>
        <p className="text-gray-600 mb-6 max-w-md">
          Track your expenses, get AI-powered insights, and take control of your finances.
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center px-4 py-2 border border-emerald-600 rounded-lg shadow-sm text-sm font-medium text-emerald-600 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Expenses Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <IndianRupee className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-sm text-gray-500">Total Expenses</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ₹{totalExpenses.toFixed(2)}
          </p>
          <div className="mt-2 flex items-center text-sm">
            <span className={`flex items-center ${monthOverMonthChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
              {monthOverMonthChange >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {Math.abs(monthOverMonthChange).toFixed(1)}%
            </span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        {/* Average Expense Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <PieChart className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Average Expense</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ₹{averageExpense.toFixed(2)}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Per transaction
          </p>
        </div>

        {/* Highest Expense Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Highest Expense</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ₹{highestExpense.amount?.toFixed(2) || '0.00'}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {highestExpense.category || 'No expenses yet'}
          </p>
        </div>

        {/* This Month Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">This Month</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ₹{currentMonthTotal.toFixed(2)}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {currentMonthExpenses.length} transactions
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              <Clock className="w-6 h-6 text-gray-600" />
            </div>
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          <Link
            to="/expenses"
            className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No recent expenses</p>
            <Link
              to="/expenses"
              className="mt-2 inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700"
            >
              Add your first expense
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Category</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Description</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-100">
                    <td className="px-4 py-3 text-sm">{expense.date}</td>
                    <td className="px-4 py-3 text-sm">{expense.category}</td>
                    <td className="px-4 py-3 text-sm">{expense.description}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      ₹{expense.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}