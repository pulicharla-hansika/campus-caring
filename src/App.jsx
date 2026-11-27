import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';
import { ToastProvider } from './context/ToastContext';

import ProtectedRoute from './components/ProtectedRoute';
import StudentLayout from './components/StudentLayout';
import AdminLayout from './components/AdminLayout';

import WelcomePage from './pages/WelcomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AboutPage from './pages/AboutPage';
import ComplaintDetailsPage from './pages/ComplaintDetailsPage';

import StudentDashboardPage from './pages/student/StudentDashboardPage';
import SubmitComplaintPage from './pages/student/SubmitComplaintPage';
import TrackComplaintPage from './pages/student/TrackComplaintPage';
import MyComplaintsPage from './pages/student/MyComplaintsPage';
import StudentProfilePage from './pages/student/StudentProfilePage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageComplaintsPage from './pages/admin/ManageComplaintsPage';
import AllComplaintsPage from './pages/admin/AllComplaintsPage';
import ReportsOverviewPage from './pages/admin/ReportsOverviewPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';

function AboutRouteWrapper() {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <AboutPage />;
  if (isAdmin) {
    return (
      <AdminLayout>
        <AboutPage />
      </AdminLayout>
    );
  }
  return (
    <StudentLayout>
      <AboutPage />
    </StudentLayout>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ComplaintProvider>
          <BrowserRouter>
            <Routes>
              {/* Minimal Welcome Screen (no navbar/dashboard) */}
              <Route path="/" element={<WelcomePage />} />

              {/* Authentication Routes */}
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* About Route */}
              <Route path="/about" element={<AboutRouteWrapper />} />

              {/* Student Portal Routes */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRole="student">
                    <StudentLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<StudentDashboardPage />} />
                <Route path="submit" element={<SubmitComplaintPage />} />
                <Route path="track" element={<TrackComplaintPage />} />
                <Route path="track/:id" element={<TrackComplaintPage />} />
                <Route path="complaints" element={<MyComplaintsPage />} />
                <Route path="complaints/:id" element={<ComplaintDetailsPage />} />
                <Route path="profile" element={<StudentProfilePage />} />
              </Route>

              {/* Administrator Portal Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="manage" element={<ManageComplaintsPage />} />
                <Route path="complaints" element={<AllComplaintsPage />} />
                <Route path="complaints/:id" element={<ComplaintDetailsPage />} />
                <Route path="reports" element={<ReportsOverviewPage />} />
                <Route path="profile" element={<AdminProfilePage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ComplaintProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
