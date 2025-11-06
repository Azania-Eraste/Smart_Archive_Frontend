import React from 'react';
import { Link } from 'react-router-dom';
import styles from './DashboardSecretairePage.module.css';

// --- Données factices ---
const statsData = [
  { title: 'Total Élèves', value: '850' },
  { title: 'Dossiers Incomplets (Global)', value: '42' },
  { title: 'Inscriptions ce mois-ci', value: '15' },
];

const DashboardSecretairePage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Tableau de Bord (Secrétariat)</h1>

      {/* Bouton d'action (Maquette PC) */}
      <Link to="/app/inscription" className={styles.ctaButton}>
        + Enregistrer une Nouvelle Inscription
      </Link>
      
      {/* Bouton d'action (Maquette Mobile) */}
      <Link to="/app/inscription" className={styles.mobileCtaButton}>
        + Nouvelle Inscription
      </Link>

      {/* Section 2: Barre de Recherche Globale */}
      <div>
        <input
          type="text"
          placeholder="Recherche Globale..."
          className={styles.searchBar}
        />
      </div>

      {/* Section 3: Grille des Statistiques */}
      <div className={styles.statsGrid}>
        {statsData.map((stat) => (
          <div key={stat.title} className={styles.statCard}>
            <h2 className={styles.statTitle}>{stat.title}</h2>
            <p className={styles.statValue}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSecretairePage;