import React from 'react';
// 1. Importer NavLink pour la navigation
import { NavLink } from 'react-router-dom';

// 2. Importer les styles du CSS Module
import styles from './Sidebar.module.css';

// 3. Importer les icônes (Material Design)
import { 
  MdSpaceDashboard, 
  MdGroup, 
  MdPersonAdd, 
  MdHistory 
} from 'react-icons/md';

// 4. Définir la structure de nos liens pour un code propre
const navItems = [
  { 
    path: '/app/dashboard', 
    label: 'Dashboard', 
    icon: <MdSpaceDashboard /> 
  },
  { 
    path: '/app/eleves', 
    label: 'Élèves', 
    icon: <MdGroup /> 
  },
  { 
    path: '/app/inscription', 
    label: 'Inscription', 
    icon: <MdPersonAdd /> 
  },
  { 
    path: '/app/historique', 
    label: 'Historique', 
    icon: <MdHistory /> 
  },
];

const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>Smart Archive</h2>
      </div>

      <nav className={styles.sidebarNav}>
        <ul>
          {/* 5. Mapper sur nos liens pour les afficher */}
          {navItems.map((item) => (
            <li key={item.path}>
              {/* 6. Utiliser NavLink au lieu de <a>
                'className' reçoit une fonction qui nous dit si le lien est actif.
                C'est ce qui active le style 'active' de notre CSS.
              */}
              <NavLink
                to={item.path}
                className={({ isActive }: { isActive: boolean }) =>
                  isActive 
                    ? `${styles.navLink} ${styles.active}` 
                    : styles.navLink
                }
              >
                <span className={styles.icon}>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;