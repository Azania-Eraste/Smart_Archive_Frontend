import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './BottomNav.module.css';

// 1. Importer les icônes (les mêmes que la Sidebar)
// Note : J'utilise les icônes "Outline" (vides) comme sur votre maquette
// et les icônes "Filled" (pleines) pour l'état actif.
import { 
  MdOutlineGroup, 
  MdOutlineSpaceDashboard, 
  MdOutlinePersonAdd, 
  MdOutlineHistory,
  MdGroup,
  MdSpaceDashboard,
  MdPersonAdd,
  MdHistory
} from 'react-icons/md';

// 2. Définir la structure de nos liens
const navItems = [
  { 
    path: '/app/eleves', 
    label: 'Elèves', 
    icon: (isActive: boolean) => isActive ? <MdGroup /> : <MdOutlineGroup /> 
  },
  { 
    path: '/app/dashboardEdu', 
    label: 'Dashboard', 
    icon: (isActive: boolean) => isActive ? <MdSpaceDashboard /> : <MdOutlineSpaceDashboard /> 
  },
  { 
    path: '/app/inscription', 
    label: 'Inscription', 
    icon: (isActive: boolean) => isActive ? <MdPersonAdd /> : <MdOutlinePersonAdd />
  },
  { 
    path: '/app/historique', 
    label: 'Historique', 
    icon: (isActive: boolean) => isActive ? <MdHistory /> : <MdOutlineHistory />
  },
];

const BottomNav: React.FC = () => {
  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          // On vérifie si le lien est actif pour appliquer le style et choisir la bonne icône
          className={({ isActive }: { isActive: boolean }) =>
            isActive 
              ? `${styles.navLink} ${styles.active}` 
              : styles.navLink
          }
        >
          {/* La fonction 'children' de NavLink nous donne 'isActive' */}
          {({ isActive }: { isActive: boolean }) => (
            <>
              <span className={styles.icon}>
                {item.icon(isActive)} 
              </span>
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;