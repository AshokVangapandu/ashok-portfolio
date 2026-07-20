import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './auth/AuthProvider';
import { PortfolioSettingsProvider } from './context/PortfolioSettingsContext';
import { AdminPage } from './pages/Admin';
import './admin.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider>
        <PortfolioSettingsProvider>
          <AdminPage />
        </PortfolioSettingsProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}
