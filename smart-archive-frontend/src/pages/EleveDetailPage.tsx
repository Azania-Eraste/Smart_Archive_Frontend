import React from 'react';
// 1. Importer les hooks de navigation
import { useNavigate, useParams, Link } from 'react-router-dom';

// 2. Importer les styles
import styles from './EleveDetailPage.module.css';
// 3. RÉUTILISER les styles de liste pour l'historique
import listStyles from './ListPage.module.css'; 

import { MdArrowBack } from 'react-icons/md'; // Importer l'icône de retour

// --- Données factices ---
// Simule une "base de données" d'élèves
const allEleves = [
  { 
    id: 'eleve-001', 
    name: 'Lamine Yamal', 
    class: '3eme C',
    history: [
      { year: '2024-2025', class: '3eme C' },
      { year: '2023-2024', class: '4eme A' },
      { year: '2022-2023', class: '5eme 2' },
      { year: '2021-2022', class: '6eme 1' },
    ]
  },
  // ... (ajoutez d'autres élèves si nécessaire)
];

const EleveDetailPage: React.FC = () => {
  // 4. Utiliser les hooks
  const { id } = useParams<{ id: string }>(); // Récupère le ':id' de l'URL
  const navigate = useNavigate();

  // 5. Trouver l'élève basé sur l'ID (logique factice)
  const eleve = allEleves.find(e => e.id === id);

  if (!eleve) {
    return <div>Élève non trouvé.</div>;
  }

  return (
    <div className={styles.pageContainer}>
      {/* En-tête avec bouton Retour */}
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <MdArrowBack />
        </button>
        <h1 className={styles.pageTitle}>Détail</h1>
      </div>

      {/* Section Info Élève (Maquette "Élèves detail") */}
      <section className={styles.infoSection}>
        <div className={styles.avatar}>{eleve.name.charAt(0)}</div>
        <div className={styles.infoDetails}>
          <h2 className={styles.name}>{eleve.name}</h2>
          <p className={styles.class}>{eleve.class}</p>
        </div>
        <button className={styles.downloadButton}>Download</button>
      </section>

      {/* Section Historique des Classes (Maquette "Classe") */}
      <section>
        <h2 className={styles.historyHeader}>Classe</h2>
        <div className={listStyles.listContainer}>
          {eleve.history.map((hist) => (
            // 6. Chaque item est un LIEN vers le dossier
            <Link 
              key={hist.year} 
              // Route vers l'Écran 3 (Dossier)
              to={`/app/eleves/${eleve.id}/dossier/${hist.year}`}
              className={listStyles.item} // Réutilise le style de liste
              style={{ textDecoration: 'none' }} // Enlève le soulignement
            >
              <div className={listStyles.avatar}>{hist.class.charAt(0)}</div>
              <div className={listStyles.info}>
                <div className={listStyles.name}>{hist.class}</div>
                <div className={listStyles.details}>Année {hist.year}</div>
              </div>
              <span>&gt;</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EleveDetailPage;