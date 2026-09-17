import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import FarmerDashboard from './pages/FarmerDashboard';
import DiseaseDetection from './pages/DiseaseDetection';
import WeatherRisk from './pages/WeatherRisk';
import RiskMap from './pages/RiskMap';
import ExpertValidation from './pages/ExpertValidation';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import './App.css';

// Guard component that redirects unauthenticated users on first visit to /login
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Hide Navbar and Footer when on any of the Login/Auth pages
  const isAuthPage = location.pathname.startsWith('/login');

  return (
    <div className={`app-layout ${isAuthPage ? 'auth-mode-layout' : ''}`}>
      {!isAuthPage && <Navbar />}
      <main className={isAuthPage ? 'auth-main-content' : 'main-content'}>
        <Routes>
          {/* Public Dedicated Auth Routes */}
          <Route path="/login" element={<AuthPage initialRole="Farmer" />} />
          <Route path="/login/farmer" element={<AuthPage initialRole="Farmer" />} />
          <Route path="/login/expert" element={<AuthPage initialRole="Agronomist" />} />
          <Route path="/login/admin" element={<AuthPage initialRole="Admin" />} />

          {/* First Entry Guard: If not logged in, redirect to /login */}
          <Route
            path="/"
            element={
              isAuthenticated ? <Home /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/home"
            element={
              isAuthenticated ? <Home /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/detect"
            element={
              <ProtectedRoute>
                <DiseaseDetection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/weather"
            element={
              <ProtectedRoute>
                <WeatherRisk />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <RiskMap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expert"
            element={
              <ProtectedRoute>
                <ExpertValidation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;