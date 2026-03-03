import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminPrivateRoute from './components/AdminPrivateRoute';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import Products from './components/Products/Products';
import Cart from './components/Cart/Cart';
import AdminDashboard from './components/Admin/AdminDashboard';
import RouteTracker from './components/RouteTracker';
import './index.css';

function App() {
  return (
    <Router>
      <RouteTracker />
      <AuthProvider>
        <AdminAuthProvider>
          <Routes>
            {/* User Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/products"
              element={
                <PrivateRoute>
                  <Products />
                </PrivateRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<Navigate to="/login" replace />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminPrivateRoute>
                  <AdminDashboard />
                </AdminPrivateRoute>
              }
            />

            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/admin" element={<Navigate to="/login" replace />} />
          </Routes>
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
