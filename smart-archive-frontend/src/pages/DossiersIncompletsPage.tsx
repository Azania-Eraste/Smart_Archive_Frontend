import React from 'react';
import { useNavigate } from 'react-router-dom';
// 1. Réutiliser le même fichier de style
import styles from './ListPage.module.css'; 

// --- Données factices ---
// (Simule les dossiers avec des pièces manquantes)
const dossiersData = [
  { 
    id: 'eleve-001', 
    name: 'Lamine Yamal', 
    class: '3ème C', 
    missing: 'Manque : Acte de naissance' 
  },
  { 
    id: 'eleve-002', 
    name: 'Pau Cubarsi', 
    class: '3ème C', 
    missing: 'Manque : Fiche médicale' 
  },
  { 
    id: 'eleve-003', 
    name: 'Gavi', 
    class: '4ème A', 
    missing: 'Manque : Photo d\'identité' 
  },
];

const DossiersIncompletsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleFixClick = (eleveId: string) => {
    // Redirige vers le dossier de l'élève pour ajouter les documents
    console.log("Ouvrir le dossier élève:", eleveId);
    // Exemple de route (à définir plus tard)
    // navigate(`/app/eleves/${eleveId}/documents`);
  };

  return (
    // 2. Utiliser les mêmes classes de style
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Dossiers Incomplets (3)</h1>

      <div className={styles.listContainer}>
        {dossiersData.map((item) => (
          <div 
            key={item.id} 
            className={styles.item}
            onClick={() => handleFixClick(item.id)}
            role="button"
          >
            {/* Avatar */}
            <div className={styles.avatar}>
              {item.name.charAt(0)}
            </div>
            
            {/* Infos */}
            <div className={styles.info}>
              <div className={styles.name}>{item.name}</div>
              {/* Note : Le détail affiche la pièce manquante */}
              <div className={styles.details} style={{ color: '#ef4444' }}> {/* En rouge */}
                {item.missing}
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

export default DossiersIncompletsPage;