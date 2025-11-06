import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 1. Importer notre nouveau Provider
import { AuthProvider } from './contexts/AuthContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. Entourer <App /> avec le <AuthProvider> */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);