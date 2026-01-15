# 📚 Référence Rapide - Services API SmartArchive

## 🎯 Quick Links

| Besoin | Service | Fonction |
|--------|---------|----------|
| Récupérer notes récentes | `pedagogieService` | `getRecentNotes(20)` |
| Notes d'un élève | `pedagogieService` | `getNotesByEleve(eleveId)` |
| Créer une note | `pedagogieService` | `createNote({...})` |
| Moyenne générale | `pedagogieService` | `calculateAverageForEleve(eleveId)` |
| Tous les élèves | `dossiersService` | `getEleves()` |
| Élèves d'une classe | `dossiersService` | `getElevesByClasse(classeId)` |
| Documents d'un élève | `dossiersService` | `getDocumentsByEleve(eleveId)` |
| Upload document | `dossiersService` | `uploadDocument({...})` |
| Classes | `etablissementService` | `getClasses()` |
| Année scolaire active | `etablissementService` | `getActiveAnneeScolaire()` |
| Matières | `etablissementService` | `getAllMatieres()` |
| Se connecter | `comptesService` | `login({email, password})` |
| Profil courant | `comptesService` | `getCurrentUser()` |
| Professeurs | `comptesService` | `getProfesseurs()` |
| Demandes inscription | `inscriptionsService` | `getDemandes()` |
| En attente | `inscriptionsService` | `getDemandesEnAttente()` |
| Approuver demande | `inscriptionsService` | `approveDemande(id)` |

---

## 🔌 Import Pattern

### Importer un service entier
```typescript
import { pedagogieService } from '@/shared/services';
const notes = await pedagogieService.getNotes();
```

### Importer des fonctions spécifiques
```typescript
import { getRecentNotes, getNotesByEleve } from '@/shared/services';
const notes = await getRecentNotes(20);
```

### Importer les types
```typescript
import { Note, Evaluation, Bulletin } from '@/shared/services';
const note: Note = { id: 1, valeur: 15, ... };
```

---

## 📊 Pédagogie

### Notes
```typescript
// Récupérer
const notes = await pedagogieService.getNotes();
const note = await pedagogieService.getNote(1);
const recent = await pedagogieService.getRecentNotes(20);
const eleveNotes = await pedagogieService.getNotesByEleve(1);

// Créer/Modifier
const newNote = await pedagogieService.createNote({
  valeur: 16.5,
  appreciation: 'Bon travail',
  eleve: 1,
  evaluation: 1
});

const updated = await pedagogieService.updateNote(1, {
  valeur: 17,
  appreciation: 'Excellent'
});

// Supprimer
await pedagogieService.deleteNote(1);

// Calculer moyenne
const avg = await pedagogieService.calculateAverageForEleve(1);
```

### Évaluations
```typescript
const evals = await pedagogieService.getEvaluations();
const eval = await pedagogieService.getEvaluation(1);
const newEval = await pedagogieService.createEvaluation({
  titre: 'Devoir',
  date: '2024-01-15',
  coefficient: 2,
  enseignement: 1
});
```

### Bulletins
```typescript
const bulletins = await pedagogieService.getBulletins();
const bulletin = await pedagogieService.getBulletin(1);
const newBulletin = await pedagogieService.createBulletin({
  eleve: 1,
  trimestre: 1,
  annee_scolaire: 1,
  moyenne_generale: 14.5,
  appreciation_generale: 'Bon élève'
});
```

---

## 👥 Dossiers (Élèves & Documents)

### Élèves
```typescript
// Récupérer
const eleves = await dossiersService.getEleves(); // Paginé
const eleve = await dossiersService.getEleve(1);
const activeEleves = await dossiersService.getActiveEleves();
const classEleves = await dossiersService.getElevesByClasse(1);

// Créer
const newEleve = await dossiersService.createEleve({
  matricule: 'ELV-001',
  nom: 'TRAORE',
  prenom: 'Fatou',
  date_naissance: '2010-05-15',
  statut: 'ACTIF',
  classe: 1
});

// Modifier
const updated = await dossiersService.updateEleve(1, {
  statut: 'ARCHIVE'
});

// Supprimer
await dossiersService.deleteEleve(1);
```

### Documents
```typescript
// Récupérer
const docs = await dossiersService.getDocuments(); // Paginé
const doc = await dossiersService.getDocument(1);
const eleveDocs = await dossiersService.getDocumentsByEleve(1);
const typeDocs = await dossiersService.getDocumentsByType(1, 'ACTE_NAISSANCE');

// Upload
const newDoc = await dossiersService.uploadDocument({
  eleve: 1,
  titre: 'Acte de naissance',
  type_document: 'ACTE_NAISSANCE',
  annee_scolaire: 1,
  fichier: fileObject
});

// Télécharger
const blob = await dossiersService.downloadDocumentFile(fileUrl);

// Utilitaires UI
const label = dossiersService.getDocumentTypeLabel('ACTE_NAISSANCE');
const color = dossiersService.getDocumentTypeColor('ACTE_NAISSANCE');
```

---

## 🏫 Établissement

### Années Scolaires
```typescript
const annees = await etablissementService.getAnneesScolaires();
const annee = await etablissementService.getAnneeScolaire(1);
const active = await etablissementService.getActiveAnneeScolaire();
```

### Niveaux
```typescript
const niveaux = await etablissementService.getNiveaux();
const niveau = await etablissementService.getNiveau(1);
```

### Classes
```typescript
const classes = await etablissementService.getClasses();
const classe = await etablissementService.getClasse(1);
const niveauClasses = await etablissementService.getClassesByNiveau(1);
const ecoleClasses = await etablissementService.getClassesByEcole(1);
```

### Matières
```typescript
const matieres = await etablissementService.getMatieres();
const matiere = await etablissementService.getMatiere(1);
const allMatieres = await etablissementService.getAllMatieres();
```

---

## 👤 Comptes (Utilisateurs)

### Authentification
```typescript
// Connexion
const response = await comptesService.login({
  email: 'user@example.com',
  password: 'password123'
});
// { access: "token", refresh: "token" }

// Renouveler token
const newAccess = await comptesService.refreshToken(refreshToken);

// Déconnexion
comptesService.logout();
```

### Utilisateurs
```typescript
// Récupérer
const users = await comptesService.getUsers(); // Paginé
const user = await comptesService.getUser(1);
const current = await comptesService.getCurrentUser();

// Par rôle
const profs = await comptesService.getProfesseurs();
const educateurs = await comptesService.getEducateurs();
const secretaires = await comptesService.getSecretaires();
const admins = await comptesService.getAdmins();
const parents = await comptesService.getParents();

// Chercher
const results = await comptesService.searchUsers('Mamadou');

// Créer
const newUser = await comptesService.createUser({
  email: 'new@example.com',
  nom: 'KONE',
  prenom: 'Kofi',
  password: 'Secure123!',
  role: 'PROFESSEUR',
  is_active: true
});

// Utilitaires UI
const label = comptesService.getRoleLabel('PROFESSEUR'); // "Professeur"
const color = comptesService.getRoleColor('PROFESSEUR'); // "#2ecc71"
const variant = comptesService.getRoleBadgeColor('PROFESSEUR'); // "success"
```

---

## 📝 Inscriptions

### Demandes
```typescript
// Récupérer
const demandes = await inscriptionsService.getDemandes(); // Paginé
const demande = await inscriptionsService.getDemande(1);

// Par statut
const pending = await inscriptionsService.getDemandesEnAttente();
const approved = await inscriptionsService.getDemandesApprouvees();
const rejected = await inscriptionsService.getDemandesRejetees();
const incomplete = await inscriptionsService.getDemandesIncompletes();

// Par filtre
const eleveDemandes = await inscriptionsService.getDemandesByEleve(1);
const yearDemandes = await inscriptionsService.getDemandesByAnnee(1);

// Créer
const newDemande = await inscriptionsService.createDemande({
  eleve: 1,
  classe: 1,
  annee_scolaire: 1,
  statut: 'INCOMPLET',
  frais_inscription: 150000,
  notes_administratives: 'Nouvelle inscription'
});

// Actions
const approved = await inscriptionsService.approveDemande(1, 'Notes', userId);
const rejected = await inscriptionsService.rejectDemande(1, 'Documents non conformes');
const updated = await inscriptionsService.addDocuments(1, [1, 2, 3]);

// Utilitaires UI
const label = inscriptionsService.getStatusLabel('EN_ATTENTE'); // "En attente"
const color = inscriptionsService.getStatusColor('EN_ATTENTE'); // "#f39c12"
const rate = inscriptionsService.calculateCompletionRate(demande); // 75
const ready = inscriptionsService.isReadyForApproval(demande); // true/false
```

---

## 🎨 Types & Énums

### Importer les types
```typescript
import {
  Note,
  Evaluation,
  Bulletin,
  Eleve,
  Document,
  Classe,
  User,
  InscriptionDemande,
  // Énums
  UserRole,
  DocumentType,
  InscriptionStatus,
  EleveStatus,
  // Constantes
  USER_ROLES,
  INSCRIPTION_STATUSES,
  DOCUMENT_TYPES,
  ROLE_COLORS,
  STATUS_COLORS
} from '@/shared/types';
```

### Utiliser les constants
```typescript
// Labels
const roleLabel = USER_ROLES['PROFESSEUR']; // "Professeur"
const statusLabel = INSCRIPTION_STATUSES['EN_ATTENTE']; // "En attente"
const docLabel = DOCUMENT_TYPES['ACTE_NAISSANCE']; // "Acte de naissance"

// Couleurs
const roleColor = ROLE_COLORS['PROFESSEUR']; // "#2ecc71"
const statusColor = STATUS_COLORS['EN_ATTENTE']; // "#f39c12"
```

---

## ⚠️ Gestion des Erreurs Courantes

### 401 - Non authentifié
```typescript
try {
  const notes = await pedagogieService.getNotes();
} catch (error) {
  if (error.response?.status === 401) {
    // Token expiré - rediriger vers login
    window.location.href = '/login';
  }
}
```

### 403 - Accès refusé
```typescript
if (error.response?.status === 403) {
  // Utilisateur n'a pas la permission
  console.error('Accès refusé - permissions insuffisantes');
}
```

### 404 - Ressource non trouvée
```typescript
if (error.response?.status === 404) {
  // ID n'existe pas
  console.error('Ressource non trouvée');
}
```

### 400 - Requête invalide
```typescript
if (error.response?.status === 400) {
  // Données invalides
  console.error('Erreur de validation:', error.response.data);
}
```

---

## 💡 Patterns Courants

### Pattern: Récupérer + Afficher
```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  pedagogieService.getRecentNotes(20)
    .then(setData)
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
}, []);

return loading ? <Spinner /> : <ItemList data={data} />;
```

### Pattern: Créer + Rafraîchir
```typescript
const handleCreate = async (formData) => {
  try {
    const newItem = await dossiersService.createEleve(formData);
    setItems([...items, newItem]);
    toast.success('Créé avec succès');
  } catch (error) {
    toast.error('Erreur de création');
  }
};
```

### Pattern: Modifier + Mettre à jour
```typescript
const handleUpdate = async (id, updates) => {
  try {
    const updated = await dossiersService.updateEleve(id, updates);
    setItems(items.map(item => item.id === id ? updated : item));
    toast.success('Modifié avec succès');
  } catch (error) {
    toast.error('Erreur de modification');
  }
};
```

### Pattern: Supprimer + Rafraîchir
```typescript
const handleDelete = async (id) => {
  try {
    await dossiersService.deleteEleve(id);
    setItems(items.filter(item => item.id !== id));
    toast.success('Supprimé avec succès');
  } catch (error) {
    toast.error('Erreur de suppression');
  }
};
```

---

## 🔗 Relations de Données

```
Élève
├── Classe (etablissementService)
├── Parents (dossiersService)
├── Documents (dossiersService)
├── Notes (pedagogieService)
│   └── Évaluation
│       └── Enseignement
│           ├── Professeur
│           ├── Matière
│           └── Classe
└── Bulletins (pedagogieService)
    └── Année Scolaire

Utilisateur
├── Rôle (Admin, Professeur, etc.)
├── Inscriptions (comptesService)
└── Enseignements (si Professeur)
    └── Classes
        └── Élèves
```

---

## 📞 Support & Ressources

- **API Docs**: `http://localhost:8000/swagger/`
- **Services**: `src/shared/services/`
- **Types**: `src/shared/types/`
- **Guide complet**: [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)
- **Exemples**: [NOTES_RECENTES_EXAMPLE.md](./NOTES_RECENTES_EXAMPLE.md)
- **Résumé**: [SETUP_SUMMARY.md](./SETUP_SUMMARY.md)

---

**Dernière mise à jour:** 14 Janvier 2026  
**Version:** 1.0
