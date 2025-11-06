import React from 'react';
import { Outlet } from 'react-router-dom';

// 1. Importer les composants de navigation
import Sidebar from '../components/common/Sidebar';
import BottomNav from '../components/common/BottomNav';

// 2. Importer les nouveaux styles
import styles from './DashboardLayout.module.css';

const DashboardLayout: React.FC = () => {
  return (
    // 3. Utiliser les classes de style
    <div className={styles.layout}>
      
      {/* La Sidebar sera gérée par le CSS */}
      <div className={styles.sidebar}>
        <Sidebar />
      </div>

      {/* Le Contenu Principal */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>

      {/* La BottomNav sera gérée par le CSS */}
      <div className={styles.bottomNav}>
        <BottomNav />
      </div>
      
    </div>
  );
};

export default DashboardLayout;