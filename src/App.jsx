// frontend/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Importez vos composants de mise en page et de pages
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard';
import CommissariatDashboard from './pages/CommissariatDashboard';
import CommissariatDeclarations from './pages/CommissariatDeclarations';
import CommissariatStatistics from './pages/CommissariatStatistics';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import NewDeclarationPage from './pages/NewDeclarationPage';
import DeclarationSuccessPage from './pages/DeclarationSuccessPage';
import NotificationsPage from './pages/NotificationsPage';
import StatisticsPage from './pages/StatisticsPage';

import './index.css'; // Pour les styles globaux (ou App.css si vous en créez un)
import './styles/DateInput.css';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route 
              path="/user-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/commissariat-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['commissariat_agent']}>
                  <CommissariatDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/statistics" 
              element={
                <ProtectedRoute allowedRoles={['commissariat_agent']}>
                  <StatisticsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/declaration/new" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <NewDeclarationPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/declaration-success" element={<DeclarationSuccessPage />} />

            {/* Routes pour les Agents de Commissariat - Sans vérification */}
            <Route path="/commissariat-declarations" element={<CommissariatDeclarations />} />
            <Route path="/commissariat-statistics" element={<CommissariatStatistics />} />

            {/* Routes Protégées pour les Administrateurs */}
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Route 404 - Toujours en dernier */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;