import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { UserDashboard } from './pages/UserDashboard'
import { AdminDashboard } from './pages/AdminDashboard'
import { NetlifyPasswordSetup } from './pages/NetlifyPasswordSetup'
import { NetlifyInviteDetector } from './components/NetlifyInviteDetector'

function AppContent() {
  const { user } = useAuth()

  return (
    <Router>
      <NetlifyInviteDetector />
      <Layout>
        <Routes>
          {/* Home page */}
          <Route path="/" element={<HomePage />} />

          {/* Login page */}
          <Route 
            path="/login" 
            element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <LoginPage />} 
          />

          {/* Registration page */}
          <Route 
            path="/register" 
            element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <RegisterPage />} 
          />

          {/* User dashboard (protected) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Admin dashboard (protected, admin only) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Netlify Identity password setup */}
          <Route path="/netlify-password-setup" element={<NetlifyPasswordSetup />} />

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App