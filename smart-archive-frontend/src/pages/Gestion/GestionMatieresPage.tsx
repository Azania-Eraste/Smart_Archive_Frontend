import React, { useState, useEffect } from 'react';
import styles from './GestionMatieresPage.module.css';
import { MdEdit, MdDelete } from 'react-icons/md';
import { pedagogieService } from '../../shared/services';

interface Matiere {
  id: number;
  nom: string;
}

const GestionMatieresPage: React.FC = () => {
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [newMatiere, setNewMatiere] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger les matières au montage
  useEffect(() => {
    const fetchMatieres = async () => {
      try {
        setLoading(true);
        setError(''); // Reset error
        const matieresData = await pedagogieService.getMatieres();
        setMatieres(matieresData);
      } catch (err: any) {
        console.error('Erreur critique:', err);
        setError('Impossible de charger les matières');
      } finally {
        setLoading(false);
      }
    };
    fetchMatieres();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatiere.trim()) return;

    try {
      const createdMatiere = await pedagogieService.createMatiere({ nom: newMatiere });
      setMatieres([...matieres, createdMatiere]);
      setNewMatiere('');
      setError('');
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout:', err);
      setError('Impossible d\'ajouter la matière');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) return;

    try {
      await pedagogieService.deleteMatiere(id);
      setMatieres(matieres.filter(m => m.id !== id));
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err);
      setError('Impossible de supprimer la matière');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Gestion des Matières</h1>

      {error && <div style={{ color: 'red', padding: '10px', marginBottom: '10px' }}>{error}</div>}

      <div className={styles.contentLayout}>
        
        {/* Formulaire */}
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
            <button type="submit" className={styles.submitButton} disabled={loading}>
              Ajouter
            </button>
          </form>
        </div>

        {/* Colonne 2: Liste/Tableau */}
        <div className={styles.listContainer}>
          
          {loading ? (
            <div>Chargement des matières...</div>
          ) : matieres.length > 0 ? (
            <>
              {/* --- Liste Mobile --- */}
              <div className={styles.mobileList}>
                {matieres.map((matiere) => (
                  <div key={matiere.id} className={styles.item}>
                    <span className={styles.itemName}>{matiere.nom}</span>
                    <div className={styles.itemActions}>
                      <button className={styles.iconButton}><MdEdit /></button>
                      <button 
                        className={styles.iconButton}
                        onClick={() => handleDelete(matiere.id)}
                      >
                        <MdDelete />
                      </button>
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
                    <td>{matiere.nom}</td>
                    <td>
                      <button className={styles.iconButton}><MdEdit /></button>
                      <button 
                        className={styles.iconButton}
                        onClick={() => handleDelete(matiere.id)}
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </>
          ) : (
            <div>Aucune matière trouvée</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionMatieresPage;