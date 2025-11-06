import React from 'react';
import { useNavigate } from 'react-router-dom';
// 1. Réutiliser le même fichier de style
import styles from './ListPage.module.css'; 

// --- Données factices ---
// (Simule les demandes de modification)
const modificationsData = [
  
  {
    id: 'mod-001', 
    name: 'Kylian Mbappé', 
    class: '1ère A', 
    details: 'Modification : Adresse du tuteur' 
  },
];

const ModificationsAttentePage: React.FC = () => {
  const navigate = useNavigate();

  const handleReviewClick = (modificationId: string) => {
    // Redirige vers le dossier pour voir le "diff" (la modification)
    console.log("Ouvrir la modification:", modificationId);
    // navigate(`/app/modifications/attente/${modificationId}`);
  };

  return (
    // 2. Utiliser les mêmes classes de style
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Modifications à approuver (0)</h1>

      <div className={styles.listContainer}>
        {/* 3. Gérer le cas où la liste est vide */}
        {modificationsData.length === 0 ? (
          <p>Aucune modification en attente d'approbation.</p>
        ) : (
          modificationsData.map((item) => (
            <div 
              key={item.id} 
              className={styles.item}
              onClick={() => handleReviewClick(item.id)}
              role="button"
            >
              {/* Avatar */}
              <div className={styles.avatar}>
                {item.name.charAt(0)}
              </div>
              
              {/* Infos */}
              <div className={styles.info}>
                <div className={styles.name}>{item.name}</div>
                <div className={styles.details}>
                  {item.details}
                </div>
              </div>

              {/* Flèche */}
              <span>&gt;</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ModificationsAttentePage;