import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Ce composant 'Outlet' est la partie magique de react-router-dom.
 * C'est ici que votre <LoginPage> ou <ForgotPasswordPage> 
 * sera automatiquement affichée.
 */

// Styles CSS pour centrer le contenu
const layoutStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f3f4f6', // Un fond gris clair
};

const contentStyle: React.CSSProperties = {
  padding: '2rem',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  borderRadius: '8px',
  width: '100%',
  maxWidth: '420px', // Limite la largeur du formulaire
};

const AuthLayout: React.FC = () => {
  return (
    <div style={layoutStyle}>
      <div style={contentStyle}>
        {/* Le Outlet rendra la page enfant (ex: LoginPage) */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;