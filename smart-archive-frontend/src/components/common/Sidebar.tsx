import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

// 1. Importer les icônes (y compris les nouvelles)
import { 
  MdSpaceDashboard, 
  MdGroup, 
  MdPersonAdd, 
  MdHistory,
  MdBook, // <-- Nouvelle icône pour "Matières"
  MdSearch // <-- Nouvelle icône pour "Recherche"
} from 'react-icons/md';

// 2. Importer notre nouveau hook
import { useAuth } from '../../contexts/AuthContext';

// 3. Définir les listes de liens pour chaque rôle
type NavItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
};
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


const Sidebar: React.FC = () => {
  // 4. Lire le rôle depuis le contexte
  const { role } = useAuth();

  // 5. Choisir la bonne liste de liens
  // (Note: J'ai renommé votre '/app/dashboardEdu' en '/app/dashboard'
  // car nous allons utiliser une autre technique pour les dashboards)
  let navItems: NavItem[] = [];
  if (role === 'Educateur') {
    navItems = educateurNavItems;
  } else if (role === 'Secretaire') {
    navItems = secretaireNavItems;
  }
  
  // 6. Gérer le cas où personne n'est connecté
  if (!role) {
    return <aside className={styles.sidebar}>...</aside>; // Ne rien afficher
  }

  // 7. Le reste de votre composant est identique
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