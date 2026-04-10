import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Public pages
import HomePage from './pages/public/HomePage';
import BrowseIdeasPage from './pages/public/BrowseIdeasPage';
import IdeaDetailPage from './pages/public/IdeaDetailPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Creator pages
import CreatorDashboard from './pages/creator/CreatorDashboard';
import SubmitIdeaPage from './pages/creator/SubmitIdeaPage';
import MyIdeasPage from './pages/creator/MyIdeasPage';
import EditIdeaPage from './pages/creator/EditIdeaPage';

// Investor pages
import InvestorDashboard from './pages/investor/InvestorDashboard';
import PaymentPage from './pages/investor/PaymentPage';
import InvestorSubmitIdea from './pages/investor/InvestorSubmitIdea';
import InvestorMyIdeas from './pages/investor/InvestorMyIdeas';
import InvestorEditIdea from './pages/investor/InvestorEditIdea';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminIdeas from './pages/admin/AdminIdeas';
import AdminPayments from './pages/admin/AdminPayments';
import AdminWarnings from './pages/admin/AdminWarnings';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'creator') return <Navigate to="/creator" replace />;
    return <Navigate to="/investor" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Shared protected */}
      <Route path="/browse" element={<ProtectedRoute><BrowseIdeasPage /></ProtectedRoute>} />
      <Route path="/ideas/:id" element={<ProtectedRoute><IdeaDetailPage /></ProtectedRoute>} />

      {/* Creator */}
      <Route path="/creator" element={<ProtectedRoute roles={['creator']}><CreatorDashboard /></ProtectedRoute>} />
      <Route path="/creator/submit" element={<ProtectedRoute roles={['creator']}><SubmitIdeaPage /></ProtectedRoute>} />
      <Route path="/creator/ideas" element={<ProtectedRoute roles={['creator']}><MyIdeasPage /></ProtectedRoute>} />
      <Route path="/creator/ideas/:id/edit" element={<ProtectedRoute roles={['creator']}><EditIdeaPage /></ProtectedRoute>} />

      {/* Investor */}
      <Route path="/investor" element={<ProtectedRoute roles={['investor']}><InvestorDashboard /></ProtectedRoute>} />
      <Route path="/investor/payment" element={<ProtectedRoute roles={['investor']}><PaymentPage /></ProtectedRoute>} />
      <Route path="/investor/submit" element={<ProtectedRoute roles={['investor']}><InvestorSubmitIdea /></ProtectedRoute>} />
      <Route path="/investor/ideas" element={<ProtectedRoute roles={['investor']}><InvestorMyIdeas /></ProtectedRoute>} />
      <Route path="/investor/ideas/:id/edit" element={<ProtectedRoute roles={['investor']}><InvestorEditIdea /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/ideas" element={<ProtectedRoute roles={['admin']}><AdminIdeas /></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute roles={['admin']}><AdminPayments /></ProtectedRoute>} />
      <Route path="/admin/warnings" element={<ProtectedRoute roles={['admin']}><AdminWarnings /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
