import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './BottomNav.module.css';
import {
  MdOutlineGroup,
  MdOutlineSpaceDashboard,
  MdOutlinePersonAdd,
  MdOutlineHistory,
  MdOutlineSearch,
  MdOutlineMenuBook,
  MdOutlineSettings,
  MdGroup,
  MdSpaceDashboard,
  MdPersonAdd,
  MdHistory,
  MdSearch,
  MdMenuBook,
  MdSettings,
} from 'react-icons/md';
import type { IconType } from 'react-icons';
import { useAuth } from '../../contexts/AuthContext';

type NavItem = {
  path: string;
  label: string;
  Icon: IconType;
  ActiveIcon?: IconType;
};

const educateurNavItems: NavItem[] = [
  { path: '/app/dashboardEdu', label: 'Dashboard', Icon: MdOutlineSpaceDashboard, ActiveIcon: MdSpaceDashboard },
  { path: '/app/inscription', label: '+ Inscription', Icon: MdOutlinePersonAdd, ActiveIcon: MdPersonAdd },
  { path: '/app/eleves', label: 'Élèves', Icon: MdOutlineGroup, ActiveIcon: MdGroup },
  { path: '/app/historique', label: 'Historique', Icon: MdOutlineHistory, ActiveIcon: MdHistory },
];

const secretaireNavItems: NavItem[] = [
  { path: '/app/dashboardSec', label: 'Dashboard', Icon: MdOutlineSpaceDashboard, ActiveIcon: MdSpaceDashboard },
  { path: '/app/inscription', label: '+ Inscription', Icon: MdOutlinePersonAdd, ActiveIcon: MdPersonAdd },
  { path: '/app/matieres', label: 'Matières', Icon: MdOutlineMenuBook, ActiveIcon: MdMenuBook },
  { path: '/app/eleves', label: 'Recherche Élèves', Icon: MdOutlineSearch, ActiveIcon: MdSearch },
];

const professeurNavItems: NavItem[] = [
  { path: '/app/dashboard', label: 'Mes Cours', Icon: MdOutlineSpaceDashboard, ActiveIcon: MdSpaceDashboard },
  { path: '/app/settings', label: 'Paramètres', Icon: MdOutlineSettings, ActiveIcon: MdSettings },
];

const BottomNav: React.FC = () => {
  const { role } = useAuth();

  let navItems: NavItem[] = [];
  if (role === 'Educateur') {
    navItems = educateurNavItems;
  } else if (role === 'Secretaire') {
    navItems = secretaireNavItems;
  } else if (role === 'Professeur') {
    navItems = professeurNavItems;
  }

  if (!role || navItems.length === 0) {
    return null;
  }

  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }: { isActive: boolean }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          {({ isActive }: { isActive: boolean }) => {
            const IconComponent = isActive && item.ActiveIcon ? item.ActiveIcon : item.Icon;
            return (
              <>
                <span className={styles.icon}>
                  <IconComponent />
                </span>
                <span>{item.label}</span>
              </>
            );
          }}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;