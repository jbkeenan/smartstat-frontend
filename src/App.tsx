import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PropertiesPage from './pages/properties/PropertiesPage';
import PropertyDetailPage from './pages/properties/PropertyDetailPage';
import ThermostatsPage from './pages/thermostats/ThermostatsPage';
import CalendarsPage from './pages/calendars/CalendarsPage';
import StatisticsPage from './pages/statistics/StatisticsPage';
import FAQPage from './pages/FAQPage';
import NotFoundPage from './pages/NotFoundPage';
import './styles/main.scss';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/faq" element={<FAQPage />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/properties" element={
            <ProtectedRoute>
              <PropertiesPage />
            </ProtectedRoute>
          } />
          
          <Route path="/properties/:id" element={
            <ProtectedRoute>
              <PropertyDetailPage />
            </ProtectedRoute>
          } />
          
          <Route path="/thermostats" element={
            <ProtectedRoute>
              <ThermostatsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/calendars" element={
            <ProtectedRoute>
              <CalendarsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/statistics" element={
            <ProtectedRoute>
              <StatisticsPage />
            </ProtectedRoute>
          } />
          
          {/* Redirect /home to /dashboard */}
          <Route path="/home" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
