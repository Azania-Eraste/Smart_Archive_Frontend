import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ElevesListPage.module.css';

// --- Données factices ---
const classesData = ['3eme A', '3eme B', '3eme C', '3eme D', '3eme E'];

const elevesData = [
  { id: 'eleve-001', name: 'Lamine Yamal', class: '3eme C' },
  { id: 'eleve-002', name: 'Pau Cubarsi', class: '3eme C' },
  { id: 'eleve-003', name: 'Gavi', class: '3eme C' },
  { id: 'eleve-004', name: 'Fermin Lopez', class: '3eme A' },
  { id: 'eleve-005', name: 'Vitor Roque', class: '3eme B' },
];

const ElevesListPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('3eme C');
  const navigate = useNavigate();

  // Logique pour filtrer les élèves
  const filteredEleves = elevesData.filter(
    (eleve) => eleve.class === selectedClass
  );

  const handleEleveClick = (eleveId: string) => {
    // Redirige vers la page de détail (Écran 2)
    navigate(`/app/eleves/${eleveId}`);
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Élèves</h1>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher un élève..."
        className={styles.searchBar}
      />

      {/* Filtre par onglets de classe */}
      <div className={styles.tabsContainer}>
        {classesData.map((classe) => (
          <button
            key={classe}
            className={`${styles.tab} ${
              selectedClass === classe ? styles.tabActive : ''
            }`}
            onClick={() => setSelectedClass(classe)}
          >
            {classe}
          </button>
        ))}
      </div>

      {/* Liste des élèves filtrée */}
      <div className={styles.listContainer}>
        {filteredEleves.map((item) => (
          <div
            key={item.id}
            className={styles.item}
            onClick={() => handleEleveClick(item.id)}
            role="button"
          >
            <div className={styles.avatar}>{item.name.charAt(0)}</div>
            <div className={styles.info}>
              <div className={styles.name}>{item.name}</div>
              <div className={styles.details}>{item.class}</div>
            </div>
            <span>&gt;</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElevesListPage;