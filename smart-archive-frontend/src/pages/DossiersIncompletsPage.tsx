import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. Réutiliser le même fichier de style
import styles from './ListPage.module.css'; 
import Toast from '../components/ui/Toast';

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

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calcule l'année scolaire au format "YYYY-YYYY".
  const getSchoolYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1..12
    // Si nous sommes en août (8) ou après, la nouvelle année scolaire commence (ex: 2024-2025)
    if (month >= 8) {
      return `${year}-${year + 1}`;
    }
    // Sinon use previous year as start (ex: 2023-2024)
    return `${year - 1}-${year}`;
  };

  const handleFixClick = (eleveId: string) => {
    console.log('Ouvrir le dossier élève:', eleveId);
    const schoolYear = getSchoolYear();
    // Affiche un toast de confirmation puis redirige après un court délai
    setToastMessage(`Ouverture du dossier (${schoolYear})...`);
    setTimeout(() => {
      setToastMessage(null);
      navigate(`/app/eleves/${eleveId}/dossier/${schoolYear}`);
    }, 800); // délai court pour voir la confirmation
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
            {/* Actions rapides */}
            <div className={styles.actions}>
              <button
                className={styles.actionButton}
                onClick={() => handleFixClick(item.id)}
                aria-label={`Compléter le dossier de ${item.name}`}
              >
                Compléter
              </button>
            </div>
          </div>
        ))}
      </div>
      {toastMessage && <Toast message={toastMessage} type="success" />}
    </div>
  );
};

export default DossiersIncompletsPage;