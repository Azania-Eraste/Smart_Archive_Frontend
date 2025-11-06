import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styles from './EleveDetailPage.module.css';
import listStyles from './ListPage.module.css'; 
import { MdArrowBack } from 'react-icons/md';

// ... (Données factices inchangées) ...
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
  // ...
];

const EleveDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const eleve = allEleves.find(e => e.id === id);

  if (!eleve) {
    return <div>Élève non trouvé.</div>;
  }

  return (
    <div className={styles.pageContainer}>
      {/* En-tête avec bouton Retour (inchangé) */}
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <MdArrowBack />
        </button>
        <h1 className={styles.pageTitle}>Détail</h1>
      </div>

      {/* ----- MODIFICATION ICI -----
        Nous entourons les deux sections (Info et Historique)
        du nouveau conteneur 'contentGrid'
      */}
      <div className={styles.contentGrid}>

        {/* COLONNE 1 (Info Élève) */}
        <section className={styles.infoSection}>
          <div className={styles.avatar}>{eleve.name.charAt(0)}</div>
          <div className={styles.infoDetails}>
            <h2 className={styles.name}>{eleve.name}</h2>
            <p className={styles.class}>{eleve.class}</p>
          </div>
          <button className={styles.downloadButton}>Download</button>
        </section>

        {/* COLONNE 2 (Historique des Classes) */}
        <section className={styles.historySection}>
          <h2 className={styles.historyHeader}>Classe</h2>
          <div className={listStyles.listContainer}>
            {eleve.history.map((hist) => (
              <Link 
                key={hist.year} 
                to={`/app/eleves/${eleve.id}/dossier/${hist.year}`}
                className={listStyles.item}
                style={{ textDecoration: 'none' }}
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

      </div> {/* Fin de contentGrid */}
    </div>
  );
};

export default EleveDetailPage;