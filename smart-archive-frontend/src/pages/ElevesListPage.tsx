import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ElevesListPage.module.css';

// ... (Données factices inchangées) ...
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

  const filteredEleves = elevesData.filter(
    (eleve) => eleve.class === selectedClass
  );

  const handleEleveClick = (eleveId: string) => {
    navigate(`/app/eleves/${eleveId}`);
  };

  return (
    <div className={styles.pageContainer}>
      {/* 1. Header (remanié pour le style desktop) */}
      <div className={styles.headerContainer}>
        <h1 className={styles.pageHeader}>Élèves</h1>
        <input
          type="text"
          placeholder="Rechercher un élève..."
          className={styles.searchBar}
        />
      </div>

      {/* 2. Filtre par onglets (inchangé) */}
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

      {/* 3. VUE LISTE (pour Mobile)
          Sera cachée sur desktop par le CSS
      */}
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

      {/* 4. VUE TABLEAU (pour Desktop)
          Sera cachée sur mobile par le CSS
      */}
      <div className={styles.desktopTableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Classe</th>
              {/* Ajoutez d'autres colonnes ici (ex: Matricule) */}
            </tr>
          </thead>
          <tbody>
            {filteredEleves.map((item) => (
              <tr
                key={item.id}
                className={styles.tableRow}
                onClick={() => handleEleveClick(item.id)}
              >
                <td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={styles.tableAvatar}>
                      {item.name.charAt(0)}
                    </div>
                    <span>{item.name}</span>
                  </div>
                </td>
                <td>{item.class}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ElevesListPage;