import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.css';

// Ce 'Outlet' est l'endroit où LoginPage sera affiché.
// S'il manque, rien ne s'affiche.

const AuthLayout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        {/* Le Outlet rendra la page enfant (LoginPage) */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;