import React from 'react';
// 1. Réutiliser le même fichier de style que nos autres listes
import styles from './ListPage.module.css'; 

// --- Données factices ---
// (Simule le journal d'audit complet du système)
const historyData = [
  { 
    id: 'hist-001', 
    user: 'M. Eraste (Educateur)', 
    action: 'Validation du dossier de Lamine Yamal.' 
  },
  { 
    id: 'hist-002', 
    user: 'Mme. Traoré (Secrétaire)', 
    action: 'Soumission du dossier de Bradley Barcola.' 
  },
  { 
    id: 'hist-003', 
    user: 'M. Dupont (Professeur)', 
    action: 'Saisie de la note (17/20) pour Lamine Yamal en Maths.' 
  },
  { 
    id: 'hist-004', 
    user: 'M. Eraste (Educateur)', 
    action: 'Importation du document "Acte de naissance" pour P. Cubarsi.' 
  },
];

const HistoriquePage: React.FC = () => {

  const handleHistoryClick = (historyId: string) => {
    // On pourrait imaginer de cliquer pour voir plus de détails
    console.log("Afficher détail de l'action:", historyId);
  };

  return (
    // 2. Utiliser les mêmes classes de style
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Historique</h1>

      <div className={styles.listContainer}>
        {historyData.map((item) => (
          <div 
            key={item.id} 
            className={styles.item}
            onClick={() => handleHistoryClick(item.id)}
            role="button"
          >
            {/* Avatar (utilisons la première lettre de l'utilisateur) */}
            <div className={styles.avatar}>
              {item.user.charAt(0)}
            </div>
            
            {/* Infos */}
            <div className={styles.info}>
              <div className={styles.name}>{item.user}</div>
              <div className={styles.details}>
                {item.action}
              </div>
            </div>

            {/* Flèche */}
            <span>&gt;</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoriquePage;