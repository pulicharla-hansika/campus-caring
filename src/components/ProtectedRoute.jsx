import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRole, children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const loginPath = allowedRole === 'admin' ? '/admin/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    // Role-based access guard: students cannot access admin pages and vice versa
    const fallback = user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return children;
}
