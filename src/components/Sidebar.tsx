import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PieChart, Brain, IndianRupee, User, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Sidebar() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <IndianRupee className="w-8 h-8 text-emerald-400" />
        <h1 className="text-xl font-bold">ExpenseAI</h1>
      </div>

      <nav className="space-y-2 flex-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? 'bg-emerald-600' : 'hover:bg-gray-800'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/summary"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? 'bg-emerald-600' : 'hover:bg-gray-800'
            }`
          }
        >
          <PieChart className="w-5 h-5" />
          <span>Summary</span>
        </NavLink>

        <NavLink
          to="/prediction"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? 'bg-emerald-600' : 'hover:bg-gray-800'
            }`
          }
        >
          <Brain className="w-5 h-5" />
          <span>AI Prediction</span>
        </NavLink>

        <NavLink
          to="/expenses"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? 'bg-emerald-600' : 'hover:bg-gray-800'
            }`
          }
        >
          <IndianRupee className="w-5 h-5" />
          <span>Expenses</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive ? 'bg-emerald-600' : 'hover:bg-gray-800'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 mt-4 w-full rounded-lg transition-colors text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-red-500/20"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  );
}