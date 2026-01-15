# Exemple d'Intégration - NotesRecentesPage.tsx

## Version Actuelle (Données Fictives)

```typescript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ListPage.module.css'; 

const notesData = [
  { 
    id: 'note-001', 
    name: 'Lamine Yamal', 
    class: '3ème C', 
    details: 'Mathématiques - Devoir 1 : 17/20' 
  },
  // ... autres données fictives
];

const NotesRecentesPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNoteClick = (noteId: string) => {
    console.log("Ouvrir la note/bulletin:", noteId);
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Notes Récentes (12)</h1>
      <div className={styles.listContainer}>
        {notesData.map((item) => (
          <div key={item.id} onClick={() => handleNoteClick(item.id)}>
            {/* Affichage */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesRecentesPage;
```

---

## Version Intégrée avec API (Version 1 - Simple)

```typescript
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pedagogieService } from '@/shared/services';
import styles from './ListPage.module.css'; 

const NotesRecentesPage: React.FC = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const recentNotes = await pedagogieService.getRecentNotes(12);
        setNotes(recentNotes);
      } catch (err) {
        setError('Erreur lors du chargement des notes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleNoteClick = (noteId: number) => {
    console.log("Ouvrir la note/bulletin:", noteId);
    // navigate(`/app/notes/${noteId}`);
  };

  if (loading) {
    return <div className={styles.pageContainer}>Chargement...</div>;
  }

  if (error) {
    return <div className={styles.pageContainer} style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Notes Récentes ({notes.length})</h1>

      <div className={styles.listContainer}>
        {notes.map((note) => (
          <div 
            key={note.id} 
            className={styles.listItem}
            onClick={() => handleNoteClick(note.id)}
            style={{ cursor: 'pointer' }}
          >
            <div>
              <h3>{note.eleve.prenom} {note.eleve.nom}</h3>
              <p><strong>Classe:</strong> {note.evaluation.matiere}</p>
              <p><strong>Note:</strong> {note.valeur}/20</p>
              <p><strong>Évaluation:</strong> {note.evaluation.titre}</p>
              {note.appreciation && (
                <p><strong>Appréciation:</strong> {note.appreciation}</p>
              )}
              <p style={{ fontSize: '0.9em', color: '#666' }}>
                Saisie le: {new Date(note.date_saisie).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesRecentesPage;
```

---

## Version Intégrée Complète (Version 2 - Avec Filtres et Gestion)

```typescript
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pedagogieService, etablissementService } from '@/shared/services';
import styles from './ListPage.module.css';

interface FilterOptions {
  matiere?: string;
  classe?: number;
  trimesters?: number;
}

const NotesRecentesPage: React.FC = () => {
  const navigate = useNavigate();
  
  // States
  const [notes, setNotes] = useState<any[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [matieres, setMatieres] = useState<any[]>([]);
  
  // Filter states
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [recentNotes, classesData, matieresData] = await Promise.all([
          pedagogieService.getRecentNotes(50),
          etablissementService.getClasses(),
          etablissementService.getAllMatieres(),
        ]);
        
        setNotes(recentNotes);
        setFilteredNotes(recentNotes);
        setClasses(classesData.results || []);
        setMatieres(matieresData || []);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...notes];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(note => {
        const fullName = `${note.eleve.prenom} ${note.eleve.nom}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      });
    }

    // Classe filter
    if (filters.classe) {
      filtered = filtered.filter(note => note.evaluation.classe?.id === filters.classe);
    }

    // Matière filter
    if (filters.matiere) {
      filtered = filtered.filter(note => note.evaluation.matiere.id === filters.matiere);
    }

    setFilteredNotes(filtered);
  }, [notes, filters, searchQuery]);

  const handleNoteClick = (noteId: number, eleveId: number) => {
    navigate(`/app/eleves/${eleveId}/detail`);
  };

  if (loading) {
    return <div className={styles.pageContainer}>Chargement des notes...</div>;
  }

  if (error) {
    return (
      <div className={styles.pageContainer} style={{ color: 'red' }}>
        <h2>⚠️ {error}</h2>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Notes Récentes</h1>

      {/* Filters Section */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>Filtres</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {/* Search */}
          <input
            type="text"
            placeholder="Rechercher par élève..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />

          {/* Classe Filter */}
          <select
            value={filters.classe || ''}
            onChange={(e) => setFilters({ ...filters, classe: e.target.value ? Number(e.target.value) : undefined })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="">Toutes les classes</option>
            {classes.map(classe => (
              <option key={classe.id} value={classe.id}>
                {classe.nom} - {classe.niveau.nom}
              </option>
            ))}
          </select>

          {/* Matière Filter */}
          <select
            value={filters.matiere || ''}
            onChange={(e) => setFilters({ ...filters, matiere: e.target.value ? Number(e.target.value) : undefined })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="">Toutes les matières</option>
            {matieres.map(matiere => (
              <option key={matiere.id} value={matiere.id}>
                {matiere.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <p style={{ color: '#666' }}>
        {filteredNotes.length} note{filteredNotes.length > 1 ? 's' : ''} affichée{filteredNotes.length > 1 ? 's' : ''}
      </p>

      <div className={styles.listContainer}>
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div 
              key={note.id} 
              className={styles.listItem}
              onClick={() => handleNoteClick(note.id, note.eleve.id)}
              style={{ 
                cursor: 'pointer',
                padding: '15px',
                borderLeft: '4px solid #3498db',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>
                    {note.eleve.prenom} {note.eleve.nom}
                  </h3>
                  <p style={{ margin: '4px 0', fontSize: '0.9em', color: '#666' }}>
                    <strong>Matricule:</strong> {note.eleve.matricule}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '2em', 
                    fontWeight: 'bold', 
                    color: note.valeur >= 15 ? '#2ecc71' : note.valeur >= 10 ? '#f39c12' : '#e74c3c'
                  }}>
                    {note.valeur}/20
                  </div>
                </div>
              </div>

              <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #ecf0f1' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9em' }}>
                <div>
                  <p style={{ margin: '4px 0' }}>
                    <strong>Matière:</strong> {note.evaluation.matiere}
                  </p>
                  <p style={{ margin: '4px 0' }}>
                    <strong>Évaluation:</strong> {note.evaluation.titre}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '4px 0' }}>
                    <strong>Coefficient:</strong> {note.evaluation.coefficient}
                  </p>
                  <p style={{ margin: '4px 0', color: '#7f8c8d' }}>
                    {new Date(note.date_saisie).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              {note.appreciation && (
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#ecf0f1', borderRadius: '4px', fontSize: '0.9em' }}>
                  <strong>Appréciation:</strong> {note.appreciation}
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
            <p>Aucune note ne correspond aux filtres</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesRecentesPage;
```

---

## Points Clés à Adapter

### 1. Imports
```typescript
import { pedagogieService, etablissementService } from '@/shared/services';
```

### 2. Structure des Données
La structure correspond à l'API :
```typescript
interface Note {
  id: number;
  valeur: number;
  appreciation?: string;
  eleve: { id, matricule, nom, prenom };
  evaluation: { id, titre, coefficient, matiere };
  date_saisie: string;
}
```

### 3. Gestion des Erreurs
```typescript
try {
  const data = await pedagogieService.getRecentNotes();
  // ...
} catch (error) {
  setError('Message d\'erreur');
  console.error(error);
}
```

### 4. Chargement Asynchrone
```typescript
useEffect(() => {
  fetchData();
}, []); // [] = une seule fois au montage
```

---

## Prochaines Pages à Intégrer

1. **Dashboard Pages**
   - `DashboardEducateurPage.tsx`
   - `DashboardProfesseurPage.tsx`
   - `DashboardSecretairePage.tsx`

2. **Élèves**
   - `ElevesListPage.tsx` → `dossiersService.getEleves()`
   - `EleveDetailPage.tsx` → `dossiersService.getEleve()`
   - `EleveDossierPage.tsx` → `dossiersService.getDocumentsByEleve()`

3. **Gestion**
   - `GestionClassePage.tsx` → `etablissementService.getClasses()`
   - `GestionMatieresPage.tsx` → `etablissementService.getMatieres()`

4. **Inscriptions**
   - `InscriptionsAttentePage.tsx` → `inscriptionsService.getDemandesEnAttente()`
   - `ModificationsAttentePage.tsx` → Modifications API

5. **Notes**
   - `SaisieNotesPage.tsx` → `pedagogieService.createNote()`

---

**Créé:** 14 Janvier 2026
