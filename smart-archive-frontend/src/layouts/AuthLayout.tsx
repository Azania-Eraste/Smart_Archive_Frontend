import React from 'react';
import { Outlet } from 'react-router-dom';

// Ce 'Outlet' est l'endroit où LoginPage sera affiché.
// S'il manque, rien ne s'affiche.

const layoutStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f3f4f6', 
};

const contentStyle: React.CSSProperties = {
  padding: '2rem',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  borderRadius: '8px',
  width: '100%',
  maxWidth: '420px',
};

const AuthLayout: React.FC = () => {
  return (
    <div style={layoutStyle}>
      <div style={contentStyle}>
        {/* Le Outlet rendra la page enfant (LoginPage) */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;