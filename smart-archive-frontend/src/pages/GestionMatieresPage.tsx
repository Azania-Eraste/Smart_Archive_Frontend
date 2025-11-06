import React, { useState } from 'react';
import styles from './GestionMatieresPage.module.css';
import { MdEdit, MdDelete } from 'react-icons/md';

// Données factices
const initialMatieres = [
  { id: 1, name: 'Mathématiques' },
  { id: 2, name: 'Français' },
  { id: 3, name: 'Histoire-Géographie' },
  { id: 4, name: 'Anglais' },
];

const GestionMatieresPage: React.FC = () => {
  // Gérer la liste des matières
  const [matieres, setMatieres] = useState(initialMatieres);
  // Gérer le champ du nouveau formulaire
  const [newMatiere, setNewMatiere] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatiere) return; // Ne pas ajouter si vide

    // Logique factice d'ajout
    const newId = Math.max(...matieres.map(m => m.id)) + 1;
    setMatieres([...matieres, { id: newId, name: newMatiere }]);
    setNewMatiere(''); // Vider le champ
    console.log('Ajout de:', newMatiere);
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Gestion des Matières</h1>

      <div className={styles.contentLayout}>
        
        {/* Colonne 1: Formulaire (PC) / Section 1 (Mobile) */}
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Ajouter une matière</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="matiereName" className={styles.label}>
                Nom de la matière
              </label>
              <input
                type="text"
                id="matiereName"
                className={styles.input}
                value={newMatiere}
                onChange={(e) => setNewMatiere(e.target.value)}
                placeholder="Ex: Physique-Chimie"
                required
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              Ajouter
            </button>
          </form>
        </div>

        {/* Colonne 2: Liste/Tableau (PC) / Section 2 (Mobile) */}
        <div className={styles.listContainer}>
          
          {/* --- Liste Mobile (affichée sur mobile) --- */}
          <div className={styles.mobileList}>
            {matieres.map((matiere) => (
              <div key={matiere.id} className={styles.item}>
                <span className={styles.itemName}>{matiere.name}</span>
                <div className={styles.itemActions}>
                  <button className={styles.iconButton}><MdEdit /></button>
                  <button className={styles.iconButton}><MdDelete /></button>
                </div>
              </div>
            ))}
          </div>

          {/* --- Tableau PC (affiché sur PC) --- */}
          <div className={styles.desktopTableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nom de la matière</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {matieres.map((matiere) => (
                  <tr key={matiere.id}>
                    <td>{matiere.name}</td>
                    <td>
                      <button className={styles.iconButton}><MdEdit /></button>
                      <button className={styles.iconButton}><MdDelete /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GestionMatieresPage;