import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { 
  MdSpaceDashboard, 
  MdGroup, 
  MdPersonAdd, 
  MdHistory,
  MdBook, 
  MdSearch,
  MdSettings // <-- Icône pour Paramètres (exemple)
} from 'react-icons/md';
import { useAuth } from '../../contexts/AuthContext';

// Type pour les items de navigation
type NavItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
};

// 1. Définir les liens pour le Professeur
const educateurNavItems: NavItem[] = [
  { path: '/app/dashboardEdu', label: 'Dashboard', icon: <MdSpaceDashboard /> },
  { path: '/app/inscription', label: '+ Inscription', icon: <MdPersonAdd /> },
  { path: '/app/eleves', label: 'Élèves', icon: <MdGroup /> },
  { path: '/app/historique', label: 'Historique', icon: <MdHistory /> },
];

const secretaireNavItems: NavItem[] = [
  { path: '/app/dashboardSec', label: 'Dashboard', icon: <MdSpaceDashboard /> },
  { path: '/app/inscription', label: '+ Inscription', icon: <MdPersonAdd /> },
  { path: '/app/matieres', label: 'Matières', icon: <MdBook /> },
  { path: '/app/eleves', label: 'Recherche Élèves', icon: <MdSearch /> },
];

const professeurNavItems: NavItem[] = [
  { path: '/app/dashboard', label: 'Mes Cours', icon: <MdSpaceDashboard /> },
  { path: '/app/settings', label: 'Paramètres', icon: <MdSettings /> },
];

const Sidebar: React.FC = () => {
  const { role } = useAuth();

  // 2. Ajouter la nouvelle logique
  let navItems: NavItem[] = [];
  if (role === 'Educateur') {
    navItems = educateurNavItems;
  } else if (role === 'Secretaire') {
    navItems = secretaireNavItems;
  } else if (role === 'Professeur') { // <-- 3. Ajouter la condition
    navItems = professeurNavItems;
  }

  if (!role) {
    return <aside className={styles.sidebar}>...</aside>; 
  }

  // ... (le reste du JSX est inchangé)
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>Smart Archive</h2>
        <span style={{color: '#9ca3af', fontSize: '0.9rem'}}>{role}</span>
      </div>
      <nav className={styles.sidebarNav}>
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
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