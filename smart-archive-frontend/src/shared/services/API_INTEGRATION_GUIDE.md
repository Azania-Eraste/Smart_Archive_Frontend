# Guide d'Intégration des Services API - SmartArchive Frontend

## 📚 Vue d'ensemble

Le frontend SmartArchive dispose maintenant d'un ensemble complet de services API typés qui encapsulent toutes les interactions avec le backend Django. Ces services sont organisés par module API :

| Service | Module | Fichier |
|---------|--------|---------|
| **Pédagogie** | Notes, Évaluations, Bulletins | `pedagogieService.ts` |
| **Dossiers** | Élèves, Documents | `dossiersService.ts` |
| **Établissement** | Classes, Niveaux, Matières, Années | `etablissementService.ts` |
| **Comptes** | Utilisateurs, Authentification | `comptesService.ts` |
| **Inscriptions** | Demandes d'inscription | `inscriptionsService.ts` |

---

## 🚀 Installation et Configuration

### 1. Configuration du Client API

Le fichier `api.ts` configure axios avec :
- ✅ Base URL correcte (`http://127.0.0.1:8000/api`)
- ✅ Injection automatique du token JWT dans les en-têtes
- ✅ Gestion des erreurs 401 (token expiré)

```typescript
// src/shared/services/api.ts
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' }
});
```

### 2. Authentification Automatique

Les tokens sont automatiquement ajoutés à chaque requête via un intercepteur :

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 📖 Exemples d'Utilisation

### Authentification

```typescript
import { comptesService } from '@/shared/services';

// 1. Se connecter
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await comptesService.login({ email, password });
    console.log('Tokens:', response.access, response.refresh);
    // Les tokens sont automatiquement sauvegardés dans localStorage
  } catch (error) {
    console.error('Erreur de connexion:', error);
  }
};

// 2. Obtenir l'utilisateur courant
const handleGetProfile = async () => {
  try {
    const user = await comptesService.getCurrentUser();
    console.log('Utilisateur:', user);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// 3. Se déconnecter
const handleLogout = () => {
  comptesService.logout(); // Supprime les tokens
};
```

### Module Pédagogie - Notes Récentes

```typescript
import { pedagogieService } from '@/shared/services';

// Récupérer les notes récentes
const loadRecentNotes = async () => {
  try {
    const notes = await pedagogieService.getRecentNotes(20);
    console.log('Notes récentes:', notes);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Récupérer toutes les notes d'un élève
const loadNotesByEleve = async (eleveId: number) => {
  try {
    const notes = await pedagogieService.getNotesByEleve(eleveId);
    console.log('Notes de l\'élève:', notes);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Créer une note
const createNewNote = async () => {
  try {
    const newNote = await pedagogieService.createNote({
      valeur: 16.5,
      appreciation: 'Excellent travail',
      eleve: 1,
      evaluation: 1
    });
    console.log('Note créée:', newNote);
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### Module Dossiers - Gestion des Élèves

```typescript
import { dossiersService } from '@/shared/services';

// Récupérer tous les élèves
const loadEleves = async () => {
  try {
    const response = await dossiersService.getEleves();
    console.log('Total élèves:', response.count);
    console.log('Élèves:', response.results);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Récupérer les élèves d'une classe
const loadElevesByClasse = async (classeId: number) => {
  try {
    const eleves = await dossiersService.getElevesByClasse(classeId);
    console.log('Élèves de la classe:', eleves);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Créer un élève
const createNewEleve = async () => {
  try {
    const newEleve = await dossiersService.createEleve({
      matricule: 'ELV-20240120-050',
      nom: 'TRAORE',
      prenom: 'Fatoumata',
      date_naissance: '2009-03-20',
      statut: 'ACTIF',
      classe: 1,
      parents: [1, 2]
    });
    console.log('Élève créé:', newEleve);
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### Module Dossiers - Documents

```typescript
import { dossiersService } from '@/shared/services';

// Récupérer tous les documents d'un élève
const loadDocumentsByEleve = async (eleveId: number) => {
  try {
    const documents = await dossiersService.getDocumentsByEleve(eleveId);
    console.log('Documents:', documents);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Uploader un document
const handleUploadDocument = async (file: File, eleveId: number) => {
  try {
    const document = await dossiersService.uploadDocument({
      eleve: eleveId,
      titre: file.name,
      type_document: 'ACTE_NAISSANCE',
      annee_scolaire: 1,
      fichier: file
    });
    console.log('Document uploadé:', document);
  } catch (error) {
    console.error('Erreur upload:', error);
  }
};

// Télécharger un fichier
const handleDownloadFile = async (fileUrl: string) => {
  try {
    const blob = await dossiersService.downloadDocumentFile(fileUrl);
    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.pdf';
    a.click();
  } catch (error) {
    console.error('Erreur download:', error);
  }
};
```

### Module Établissement

```typescript
import { etablissementService } from '@/shared/services';

// Récupérer l'année scolaire active
const loadActiveYear = async () => {
  try {
    const annee = await etablissementService.getActiveAnneeScolaire();
    console.log('Année active:', annee);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Récupérer toutes les classes
const loadClasses = async () => {
  try {
    const response = await etablissementService.getClasses();
    console.log('Classes:', response.results);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Récupérer les classes d'un niveau
const loadClassesByNiveau = async (niveauId: number) => {
  try {
    const classes = await etablissementService.getClassesByNiveau(niveauId);
    console.log('Classes du niveau:', classes);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Récupérer toutes les matières
const loadMatieres = async () => {
  try {
    const matieres = await etablissementService.getAllMatieres();
    console.log('Matières:', matieres);
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### Module Comptes - Gestion des Utilisateurs

```typescript
import { comptesService } from '@/shared/services';

// Récupérer tous les professeurs
const loadProfesseurs = async () => {
  try {
    const professeurs = await comptesService.getProfesseurs();
    console.log('Professeurs:', professeurs);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Créer un nouvel utilisateur
const createNewUser = async () => {
  try {
    const newUser = await comptesService.createUser({
      email: 'nouveau@smartarchive.local',
      nom: 'KONE',
      prenom: 'Kofi',
      password: 'SecurePassword123!',
      role: 'PROFESSEUR',
      is_active: true
    });
    console.log('Utilisateur créé:', newUser);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Rechercher des utilisateurs
const searchUsers = async (query: string) => {
  try {
    const users = await comptesService.searchUsers(query);
    console.log('Résultats:', users);
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

### Module Inscriptions

```typescript
import { inscriptionsService } from '@/shared/services';

// Récupérer les demandes en attente
const loadPendingRegistrations = async () => {
  try {
    const demandes = await inscriptionsService.getDemandesEnAttente();
    console.log('Demandes en attente:', demandes);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Créer une demande d'inscription
const createNewRegistration = async () => {
  try {
    const demande = await inscriptionsService.createDemande({
      eleve: 1,
      classe: 1,
      annee_scolaire: 1,
      statut: 'INCOMPLET',
      frais_inscription: 150000.0,
      notes_administratives: 'Nouvelle inscription'
    });
    console.log('Demande créée:', demande);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Approuver une demande d'inscription
const approveRegistration = async (demandeId: number, userId: number) => {
  try {
    const demande = await inscriptionsService.approveDemande(
      demandeId,
      'Tous les documents ont été validés',
      userId
    );
    console.log('Demande approuvée:', demande);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Rejeter une demande d'inscription
const rejectRegistration = async (demandeId: number) => {
  try {
    const demande = await inscriptionsService.rejectDemande(
      demandeId,
      'Documents non conformes'
    );
    console.log('Demande rejetée:', demande);
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// Ajouter des documents à une demande
const addDocumentsToRegistration = async (demandeId: number, docIds: number[]) => {
  try {
    const demande = await inscriptionsService.addDocuments(demandeId, docIds);
    console.log('Documents ajoutés:', demande);
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

---

## 🎯 Utilisation dans les Composants React

### Exemple 1 : Page de Notes Récentes

```typescript
import React, { useEffect, useState } from 'react';
import { pedagogieService } from '@/shared/services';

const NotesRecentesPage: React.FC = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const recentNotes = await pedagogieService.getRecentNotes(20);
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

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h1>Notes Récentes ({notes.length})</h1>
      {notes.map(note => (
        <div key={note.id}>
          <h3>{note.eleve.prenom} {note.eleve.nom}</h3>
          <p>Note: {note.valeur}/20</p>
          <p>Évaluation: {note.evaluation.titre}</p>
          {note.appreciation && <p>Appréciation: {note.appreciation}</p>}
        </div>
      ))}
    </div>
  );
};

export default NotesRecentesPage;
```

### Exemple 2 : Formulaire de Création d'Élève

```typescript
import React, { useState, useEffect } from 'react';
import { dossiersService, etablissementService } from '@/shared/services';

const CreateEleveForm: React.FC = () => {
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    date_naissance: '',
    classe: 0
  });

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les classes au montage
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await etablissementService.getClasses();
        setClasses(response.results);
      } catch (err) {
        setError('Erreur lors du chargement des classes');
      }
    };
    fetchClasses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newEleve = await dossiersService.createEleve({
        ...formData,
        classe: Number(formData.classe),
        statut: 'ACTIF'
      });
      console.log('Élève créé:', newEleve);
      // Réinitialiser le formulaire
      setFormData({
        matricule: '',
        nom: '',
        prenom: '',
        date_naissance: '',
        classe: 0
      });
    } catch (err) {
      setError('Erreur lors de la création de l\'élève');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Matricule"
        value={formData.matricule}
        onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Nom"
        value={formData.nom}
        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Prénom"
        value={formData.prenom}
        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
        required
      />
      <input
        type="date"
        value={formData.date_naissance}
        onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
        required
      />
      <select
        value={formData.classe}
        onChange={(e) => setFormData({ ...formData, classe: e.target.value })}
        required
      >
        <option value={0}>Sélectionner une classe</option>
        {classes.map(classe => (
          <option key={classe.id} value={classe.id}>
            {classe.nom} - {classe.niveau.nom}
          </option>
        ))}
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'Création...' : 'Créer élève'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default CreateEleveForm;
```

### Exemple 3 : Upload de Document

```typescript
import React, { useState } from 'react';
import { dossiersService } from '@/shared/services';

const DocumentUploadForm: React.FC<{ eleveId: number }> = ({ eleveId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('ACTE_NAISSANCE');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setLoading(true);
      setSuccess(false);

      const document = await dossiersService.uploadDocument({
        eleve: eleveId,
        titre: file.name,
        type_document: documentType as any,
        annee_scolaire: 1,
        fichier: file
      });

      console.log('Document uploadé:', document);
      setSuccess(true);
      setFile(null);
    } catch (error) {
      console.error('Erreur upload:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={documentType}
        onChange={(e) => setDocumentType(e.target.value)}
      >
        <option value="ACTE_NAISSANCE">Acte de naissance</option>
        <option value="RECU">Reçu de paiement</option>
        <option value="DIPLOME_ANTERIEUR">Diplôme antérieur</option>
        <option value="PHOTO">Photo d'identité</option>
        <option value="AUTRE">Autre</option>
      </select>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        required
      />

      <button type="submit" disabled={loading || !file}>
        {loading ? 'Upload...' : 'Uploader'}
      </button>

      {success && <p className="success">Document uploadé avec succès!</p>}
    </form>
  );
};

export default DocumentUploadForm;
```

---

## 🔍 Gestion des Erreurs

Chaque service gère les erreurs d'API. Vous devriez toujours envelopper vos appels dans des `try-catch` :

```typescript
try {
  const notes = await pedagogieService.getRecentNotes();
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      console.error('Non authentifié - rediriger vers login');
    } else if (error.response?.status === 403) {
      console.error('Accès refusé');
    } else if (error.response?.status === 404) {
      console.error('Ressource non trouvée');
    } else {
      console.error('Erreur:', error.response?.data);
    }
  }
}
```

---

## 📊 Fonctions Utilitaires

### Affichage de Statuts et Rôles

```typescript
import { 
  comptesService, 
  inscriptionsService 
} from '@/shared/services';

// Afficher le label d'un rôle
const roleLabel = comptesService.getRoleLabel('PROFESSEUR'); // "Professeur"
const roleColor = comptesService.getRoleColor('PROFESSEUR'); // "#2ecc71"

// Afficher le label d'un statut d'inscription
const statusLabel = inscriptionsService.getStatusLabel('EN_ATTENTE'); // "En attente"
const statusColor = inscriptionsService.getStatusColor('EN_ATTENTE'); // "#f39c12"
```

### Calculs

```typescript
import { pedagogieService, inscriptionsService } from '@/shared/services';

// Calculer la moyenne générale d'un élève
const average = await pedagogieService.calculateAverageForEleve(eleveId);

// Calculer le taux de complétude d'un dossier d'inscription
const completionRate = inscriptionsService.calculateCompletionRate(demande);
const isReady = inscriptionsService.isReadyForApproval(demande);
```

---

## ✅ Checklist d'Intégration

- [ ] Tous les services sont importés correctement
- [ ] Les tokens JWT sont sauvegardés après login
- [ ] Les intercepteurs d'erreur 401 fonctionnent
- [ ] Les appels API utilisent try-catch
- [ ] Les interfaces TypeScript sont utilisées
- [ ] Les fichiers sont uploadés en multipart/form-data
- [ ] Les filtres de pagination sont correctement utilisés
- [ ] Les utilitaires d'affichage sont utilisés pour les UI

---

## 🔗 Ressources

- **Documentation API Backend**: `http://localhost:8000/swagger/`
- **Base URL**: `http://localhost:8000/api/`
- **Services Frontend**: `src/shared/services/`

---

**Dernière mise à jour:** 14 Janvier 2026
