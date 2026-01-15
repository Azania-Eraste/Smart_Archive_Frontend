import React from 'react';
import styles from './DashboardEducateurPage.module.css';
// 1. Importer 'Link' de react-router-dom
import { Link } from 'react-router-dom';

// --- Données factices (MISES À JOUR) ---

// 2. Mettre à jour 'widgetData' pour inclure les 'path' (routes)
const widgetData = [
  { 
    title: 'Dossiers Incomplets', 
    value: '3', 
    color: '#ef4444', // Rouge
    path: '/app/dossiers/incomplets' // Nouvelle route
  },
  { 
    title: 'Inscription en attente', 
    value: '2', 
    color: '#eab308', // Jaune
    path: '/app/inscriptions/attente' // Nouvelle route
  },
  { 
    title: 'Modification à approuver', 
    value: '1', 
    color: '#4f46e5', // Violet
    path: '/app/modifications/attente' // Nouvelle route
  },
  { 
    title: 'Nouvelle note', 
    value: '4', 
    color: '#22c55e', // Vert
    path: '/app/notes/recentes' // Nouvelle route
  },
];

// ... (activityData reste le même) ...
const activityData = [
  { id: 1, name: 'Lamine Yamal', details: '3eme C - Action : Mise à jour dossier' },
  { id: 2, name: 'Pau Cubarsi', details: '3eme C - Action : Import document' },
  { id: 3, name: 'Gavi', details: '4eme A - Action : Dossier validé' },
];

// --- Le Composant Page ---

const DashboardEducateurPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Bonjour, Monsieur Eraste</h1>

      {/* Section 1: Grille des Widgets d'Alerte (MISE À JOUR) */}
      <div className={styles.widgetGrid}>
        {widgetData.map((widget) => (
          // 3. Envelopper le 'div' dans un 'Link'
          <Link 
            to={widget.path} 
            key={widget.title} 
            className={styles.widgetLink}
          >
            <div
              className={styles.widgetCard}
              style={{ borderLeftColor: widget.color }}
            >
              <h2 className={styles.widgetTitle}>{widget.title}</h2>
              <p className={styles.widgetValue}>{widget.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Section 2: Historique d'Activité (inchangée) */}
      <div>
        <h2 className={styles.activityHeader}>Activité récentes</h2>
        <div className={styles.activityList}>
          {activityData.map((item) => (
            <div key={item.id} className={styles.activityItem}>
              <div className={styles.activityAvatar}>
                {item.name.charAt(0)}
              </div>
              <div className={styles.activityInfo}>
                <div className={styles.activityName}>{item.name}</div>
                <div className={styles.activityDetails}>{item.details}</div>
              </div>
              <span>&gt;</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardEducateurPage;