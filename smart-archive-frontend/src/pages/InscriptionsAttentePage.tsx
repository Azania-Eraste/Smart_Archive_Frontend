import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ListPage.module.css'; 

// --- Données factices ---
// (Simule les dossiers soumis par la Secrétaire)
const inscriptionsData = [
  { 
    id: 'inscription-123', 
    name: 'Warren Zaïre-Emery', 
    class: '6ème B', 
    date: 'Soumis le 05/11/2025' 
  },
  { 
    id: 'inscription-124', 
    name: 'Bradley Barcola', 
    class: 'CM2 A', 
    date: 'Soumis le 04/11/2025' 
  },
];

const InscriptionsAttentePage: React.FC = () => {
  // Le hook 'navigate' nous permettra de rediriger l'utilisateur
  // vers la page de détail quand il clique.
  const navigate = useNavigate();

  const handleValidationClick = (inscriptionId: string) => {
    // C'est ici que vous redirigerez vers la page de validation détaillée
    // Par exemple: /app/inscriptions/attente/inscription-123
    console.log("Ouvrir le dossier:", inscriptionId);
    // navigate(`/app/inscriptions/attente/${inscriptionId}`);
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Inscriptions en attente (2)</h1>

      <div className={styles.listContainer}>
        {inscriptionsData.map((item) => (
          <div 
            key={item.id} 
            className={styles.item}
            onClick={() => handleValidationClick(item.id)}
            role="button" // Bon pour l'accessibilité
          >
            {/* Avatar avec l'initiale */}
            <div className={styles.avatar}>
              {item.name.charAt(0)}
            </div>
            
            {/* Infos */}
            <div className={styles.info}>
              <div className={styles.name}>{item.name}</div>
              <div className={styles.details}>
                {item.class} - {item.date}
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

export default InscriptionsAttentePage;