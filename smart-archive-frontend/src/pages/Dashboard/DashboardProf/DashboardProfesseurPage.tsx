import React from 'react';
// 1. IMPORTER 'useNavigate' (en plus de 'Link')
import { Link, useNavigate } from 'react-router-dom';
import styles from './DashboardProfesseurPage.module.css';
import { MdBook } from 'react-icons/md'; // Icône pour un cours

// --- Données factices (inchangées) ---
const enseignementsData = [
  { id: 'ens-001', classe: '6ème A', matiere: 'Mathématiques', nbEleves: 30 },
  { id: 'ens-002', classe: '5ème B', matiere: 'Français', nbEleves: 28 },
  { id: 'ens-003', classe: '5ème C', matiere: 'Français', nbEleves: 29 },
];

const DashboardProfesseurPage: React.FC = () => {
  // 2. RÉCUPÉRER LA FONCTION 'navigate'
  const navigate = useNavigate();

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Mes Enseignements</h1>

      {/* --- VUE LISTE (pour Mobile) - Inchangée --- */}
      <div className={styles.mobileList}>
        {enseignementsData.map((item) => (
          <Link 
            to={`/app/cours/${item.id}`} 
            key={item.id} 
            className={styles.item}
          >
            <div className={styles.icon}><MdBook /></div>
            <div className={styles.info}>
              <div className={styles.name}>{item.classe} - {item.matiere}</div>
              <div className={styles.details}>{item.nbEleves} élèves</div>
            </div>
            <span>&gt;</span>
          </Link>
        ))}
      </div>

      {/* --- VUE TABLEAU (pour Desktop) - Corrigée --- */}
      <div className={styles.desktopTableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Classe</th>
              <th>Matière</th>
              <th>Nombre d'élèves</th>
            </tr>
          </thead>
          <tbody>
            {enseignementsData.map((item) => (
              <tr 
                key={item.id} 
                className={styles.tableRow}
                // 3. UTILISER LA FONCTION 'navigate'
                onClick={() => {
                  navigate(`/app/cours/${item.id}`);
                }}
              >
                <td>{item.classe}</td>
                <td>{item.matiere}</td>
                <td>{item.nbEleves}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardProfesseurPage;