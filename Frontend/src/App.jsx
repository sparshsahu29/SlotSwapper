import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';

// Protected Switch Route
import ProtectedRoute from './components/layout/ProtectedRoute';

// Page Components
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import MarketplacePage from './pages/MarketplacePage';
import NotificationsPage from './pages/NotificationsPage';

export const App = () => {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <BrowserRouter>
          <Routes>
            {/* Redirect root to dashboard/login */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Public Authentication Routes */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />

            {/* Protected Core Application Layout */}
            {/* <Route element={<ProtectedRoute />}> */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            {/* </Route> */}

            {/* Catch-all Wildcard fallback redirects back to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        
        {/* Customized Dark Elegant Toaster styling */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1a1a1a',
              color: '#f5f5f5',
              border: '1px solid #2a2a2a',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              borderRadius: '8px',
              padding: '10px 14px',
            },
            success: {
              iconTheme: {
                primary: '#00D2FF',
                secondary: '#1a1a1a',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#1a1a1a',
              },
            },
          }}
        />
      </WebSocketProvider>
    </AuthProvider>
  );
};

export default App;
