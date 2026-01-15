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

// 1. Définir les liens pour chaque rôle
const educateurNavItems: NavItem[] = [
  { path: '/app/dashboard', label: 'Dashboard', icon: <MdSpaceDashboard /> },
  { path: '/app/inscription', label: '+ Inscription', icon: <MdPersonAdd /> },
  { path: '/app/eleves', label: 'Élèves', icon: <MdGroup /> },
  { path: '/app/historique', label: 'Historique', icon: <MdHistory /> },
];

const secretaireNavItems: NavItem[] = [
  { path: '/app/dashboard', label: 'Dashboard', icon: <MdSpaceDashboard /> },
  { path: '/app/inscription', label: '+ Inscription', icon: <MdPersonAdd /> },
  { path: '/app/matieres', label: 'Matières', icon: <MdBook /> },
  { path: '/app/eleves', label: 'Recherche Élèves', icon: <MdSearch /> },
];

const professeurNavItems: NavItem[] = [
  { path: '/app/dashboard', label: 'Mes Cours', icon: <MdSpaceDashboard /> },
  { path: '/app/settings', label: 'Paramètres', icon: <MdSettings /> },
];

const parentNavItems: NavItem[] = [
  { path: '/app/dashboard', label: 'Dashboard', icon: <MdSpaceDashboard /> },
  { path: '/app/eleves', label: 'Mes Enfants', icon: <MdGroup /> },
  { path: '/app/historique', label: 'Historique', icon: <MdHistory /> },
];

const adminNavItems: NavItem[] = [
  { path: '/app/dashboard', label: 'Dashboard', icon: <MdSpaceDashboard /> },
  { path: '/app/inscription', label: '+ Inscription', icon: <MdPersonAdd /> },
  { path: '/app/matieres', label: 'Matières', icon: <MdBook /> },
  { path: '/app/eleves', label: 'Recherche Élèves', icon: <MdSearch /> },
];

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role;

  // Normaliser le rôle en title case pour la comparaison
  const normalizedRole = role 
    ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    : null;

  // Sélectionner les items en fonction du rôle
  let navItems: NavItem[] = [];
  switch (normalizedRole) {
    case 'Educateur':
      navItems = educateurNavItems;
      break;
    case 'Secretaire':
      navItems = secretaireNavItems;
      break;
    case 'Professeur':
      navItems = professeurNavItems;
      break;
    case 'Parent':
      navItems = parentNavItems;
      break;
    case 'Admin':
    case 'Directeur':
      navItems = adminNavItems;
      break;
    default:
      navItems = [];
  }

  if (!user) {
    return <aside className={styles.sidebar}>Chargement...</aside>; 
  }

  // ... (le reste du JSX est inchangé)
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>Smart Archive</h2>
        <div style={{color: '#9ca3af', fontSize: '0.85rem', marginTop: '0.5rem'}}>
          <p style={{margin: '0.25rem 0'}}>{user.prenom} {user.nom}</p>
          <p style={{margin: '0.25rem 0'}}><strong>{normalizedRole || 'Unknown'}</strong></p>
        </div>
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