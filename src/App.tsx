import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { Summary } from './pages/Summary';
import { Prediction } from './pages/Prediction';
import { Expenses } from './pages/Expenses';
import { Profile } from './pages/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 p-8">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/summary" element={<Summary />} />
                        <Route path="/prediction" element={<Prediction />} />
                        <Route path="/expenses" element={<Expenses />} />
                        <Route path="/profile" element={<Profile />} />
                      </Routes>
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;