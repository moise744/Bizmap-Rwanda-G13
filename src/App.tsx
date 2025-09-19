import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { Layout } from './components/layout/Layout';
import { Toaster } from './components/ui/sonner';

// Page imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BusinessesPage from './pages/BusinessesPage';
import BusinessDetailPage from './pages/BusinessDetailPage';
import SearchPage from './pages/SearchPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import FavoritesPage from './pages/FavoritesPage';
import HistoryPage from './pages/HistoryPage';
import NotificationsPage from './pages/NotificationsPage';
import ReviewsPage from './pages/ReviewsPage';
import BusinessDashboardPage from './pages/BusinessDashboardPage';
import ManageBusinessPage from './pages/ManageBusinessPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Public Route Component (redirect if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/businesses" element={<Layout><BusinessesPage /></Layout>} />
              <Route path="/business/:id" element={<Layout><BusinessDetailPage /></Layout>} />
              <Route path="/search" element={<Layout><SearchPage /></Layout>} />
              
              {/* Authentication Routes */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                } 
              />

              {/* Protected Routes */}
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <Layout><ChatPage /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Layout><ProfilePage /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Layout><SettingsPage /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/favorites" 
                element={
                  <ProtectedRoute>
                    <Layout><FavoritesPage /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/history" 
                element={
                  <ProtectedRoute>
                    <Layout><HistoryPage /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <Layout><NotificationsPage /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reviews" 
                element={
                  <ProtectedRoute>
                    <Layout><ReviewsPage /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Layout><BusinessDashboardPage /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/manage-business" 
                element={
                  <ProtectedRoute>
                    <Layout><ManageBusinessPage /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/manage-business/:id" 
                element={
                  <ProtectedRoute>
                    <Layout><ManageBusinessPage /></Layout>
                  </ProtectedRoute>
                } 
              />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* Toast notifications */}
            <Toaster position="top-right" richColors />
          </div>
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
}