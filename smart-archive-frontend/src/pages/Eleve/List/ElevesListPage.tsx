import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ElevesListPage.module.css';
import { pedagogieService } from '../../../shared/services';

interface Classe {
  id: number;
  nom: string;
}

interface Eleve {
  id: number;
  prenom: string;
  nom: string;
  matricule: string;
}

const ElevesListPage: React.FC = () => {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Charger les classes au montage
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError(''); // Reset error
        const classesData = await pedagogieService.getClasses();
        setClasses(classesData);
        if (classesData.length > 0) {
          setSelectedClass(classesData[0].id);
        }
      } catch (err: any) {
        console.error('Erreur critique lors du chargement des classes:', err);
        setError('Impossible de charger les classes');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  // Charger les élèves quand la classe change
  useEffect(() => {
    if (!selectedClass) return;

    const fetchEleves = async () => {
      try {
        setLoading(true);
        setError(''); // Reset error
        const elevesData = await pedagogieService.getElevesByClasse(selectedClass);
        setEleves(elevesData);
      } catch (err: any) {
        console.error('Erreur critique lors du chargement des élèves:', err);
        setError('Impossible de charger les élèves');
        setEleves([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEleves();
  }, [selectedClass]);

  // Filtrer les élèves selon la recherche
  const filteredEleves = eleves.filter(
    (eleve) =>
      eleve.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eleve.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEleveClick = (eleveId: number) => {
    navigate(`/app/eleves/${eleveId}`);
  };

  if (loading && classes.length === 0) {
    return <div className={styles.pageContainer}>Chargement...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      {/* 1. Header */}
      <div className={styles.headerContainer}>
        <h1 className={styles.pageHeader}>Élèves</h1>
        <input
          type="text"
          placeholder="Rechercher un élève..."
          className={styles.searchBar}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && <div style={{ color: 'red', padding: '10px', marginBottom: '10px' }}>{error}</div>}

      {/* 2. Filtre par classes */}
      <div className={styles.tabsContainer}>
        {classes.map((classe) => (
          <button
            key={classe.id}
            className={`${styles.tab} ${
              selectedClass === classe.id ? styles.tabActive : ''
            }`}
            onClick={() => setSelectedClass(classe.id)}
          >
            {classe.nom}
          </button>
        ))}
      </div>

      {/* 3. VUE LISTE (pour Mobile) */}
      {loading ? (
        <div>Chargement des élèves...</div>
      ) : filteredEleves.length > 0 ? (
        <>
          <div className={styles.listContainer}>
            {filteredEleves.map((eleve) => (
              <div
                key={eleve.id}
                className={styles.item}
                onClick={() => handleEleveClick(eleve.id)}
                role="button"
              >
                <div className={styles.avatar}>{eleve.prenom.charAt(0)}</div>
                <div className={styles.info}>
                  <div className={styles.name}>{eleve.prenom} {eleve.nom}</div>
                  <div className={styles.details}>{eleve.matricule}</div>
                </div>
                <span>&gt;</span>
              </div>
            ))}
          </div>

          {/* 4. VUE TABLEAU (pour Desktop) */}
          <div className={styles.desktopTableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Prénom</th>
                  <th>Nom</th>
                  <th>Matricule</th>
                </tr>
              </thead>
              <tbody>
                {filteredEleves.map((eleve) => (
                  <tr
                    key={eleve.id}
                    className={styles.tableRow}
                    onClick={() => handleEleveClick(eleve.id)}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className={styles.tableAvatar}>
                          {eleve.prenom.charAt(0)}
                        </div>
                        <span>{eleve.prenom}</span>
                      </div>
                    </td>
                    <td>{eleve.nom}</td>
                    <td>{eleve.matricule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className={styles.empty}>Aucun élève trouvé</div>
      )}
    </div>
  );
};

export default ElevesListPage;