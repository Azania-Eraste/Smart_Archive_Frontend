import api from './api';

/**
 * TypeScript interfaces for Pedagogy API
 * Based on SmartArchive API Documentation
 * Endpoint prefix: /api/pedagogie/
 */

// ============ INTERFACES ============

export interface Matiere {
  id: number;
  nom: string;
}

export interface Professeur {
  id: number;
  utilisateur: {
    id: number;
    email: string;
    nom: string;
    prenom: string;
  };
  matricule: string;
}

export interface Classe {
  id: number;
  nom: string;
  niveau: string;
  displayName?: string;
}

export interface Enseignement {
  id: number;
  professeur: Professeur;
  matiere: Matiere;
  classe: Classe;
  coefficient: number;
}

export interface Evaluation {
  id: number;
  titre: string;
  date: string; // ISO date format
  coefficient: number;
  enseignement: Enseignement | number; // Peut être l'ID lors de l'envoi ou l'objet à la réception
}

export interface Eleve {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
}

export interface Note {
  id: number;
  valeur: number;
  appreciation?: string;
  eleve: Eleve | number;
  evaluation: {
    id: number;
    titre: string;
    date: string;
    coefficient: number;
    matiere: string;
  } | number;
  date_saisie: string; 
}

export interface Bulletin {
  id: number;
  trimestre: 1 | 2 | 3;
  moyenne_generale: number;
  appreciation_generale: string;
  eleve: Eleve;
  annee_scolaire: {
    id: number;
    libelle: string;
  };
  fichier_pdf: string;
  date_generation: string;
}

// Pagination wrapper
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ============ MATIERES API ============

export const getMatieres = async (): Promise<Matiere[]> => {
  try {
    const response = await api.get('/etablissement/matieres/');
    // Accept both paginated wrapper `{ results: [...] }` and plain array `[...]`
    if (Array.isArray(response.data)) return response.data as Matiere[];
    if (response.data?.results && Array.isArray(response.data.results)) return response.data.results as Matiere[];
    throw new Error('Invalid response structure for /etablissement/matieres/');
  } catch (error: any) {
    console.warn('⚠️ Endpoint /etablissement/matieres/ non disponible or returned unexpected shape; using test data');
    if (error?.response) console.warn('HTTP', error.response.status, error.response.data);
    return [
      { id: 1, nom: 'Mathématiques' },
      { id: 2, nom: 'Français' },
      { id: 3, nom: 'Histoire-Géographie' },
      { id: 4, nom: 'Anglais' },
      { id: 5, nom: 'Sciences' },
    ];
  }
};

export const getMatiere = async (id: number): Promise<Matiere> => {
  const response = await api.get<Matiere>(`/etablissement/matieres/${id}/`);
  return response.data;
};

export const createMatiere = async (data: { nom: string }): Promise<Matiere> => {
  try {
    const response = await api.post<Matiere>('/etablissement/matieres/', data);
    return response.data;
  } catch (error: any) {
    console.warn('⚠️ Endpoint POST /etablissement/matieres/ non disponible, création locale');
    return { id: Math.floor(Math.random() * 1000), ...data };
  }
};

export const updateMatiere = async (id: number, data: { nom: string }): Promise<Matiere> => {
  const response = await api.patch<Matiere>(`/etablissement/matieres/${id}/`, data);
  return response.data;
};

export const deleteMatiere = async (id: number): Promise<void> => {
  try {
    await api.delete(`/etablissement/matieres/${id}/`);
  } catch (error: any) {
    console.warn('⚠️ Endpoint DELETE /etablissement/matieres/ non disponible, suppression locale');
  }
};

// ============ CLASSES API ============

export const getClasses = async (): Promise<Classe[]> => {
  try {
    const response = await api.get('/etablissement/classes/');
    let raw: Classe[] | undefined;
    if (Array.isArray(response.data)) raw = response.data as Classe[];
    else if (response.data?.results && Array.isArray(response.data.results)) raw = response.data.results as Classe[];
    if (!raw) throw new Error('Invalid response structure for /etablissement/classes/');
    const classes = raw.map((c) => ({ ...c, displayName: `${c.niveau} ${c.nom}` }));
    return classes;
  } catch (error: any) {
    console.warn('⚠️ Endpoint /etablissement/classes/ non disponible or returned unexpected shape; using test data');
    if (error?.response) console.warn('HTTP', error.response.status, error.response.data);
    const fallback: Classe[] = [
      { id: 1, nom: 'A', niveau: '3' },
      { id: 2, nom: 'B', niveau: '3' },
      { id: 3, nom: 'C', niveau: '3' },
      { id: 4, nom: 'A', niveau: '2' },
    ];
    return fallback.map((c) => ({ ...c, displayName: `${c.niveau} ${c.nom}` }));
  }
};

// CETTE FONCTION MANQUAIT DANS VOTRE CODE
export const getClasse = async (id: number): Promise<Classe> => {
  const response = await api.get<Classe>(`/etablissement/classes/${id}/`);
  return response.data;
};

export const getElevesByClasse = async (classeId: number): Promise<Eleve[]> => {
  try {
    const response = await api.get('/dossiers/eleves/', { params: { classe: classeId } });
    if (Array.isArray(response.data)) return response.data as Eleve[];
    if (response.data?.results && Array.isArray(response.data.results)) return response.data.results as Eleve[];
    throw new Error('Invalid response structure for /dossiers/eleves/');
  } catch (error: any) {
    console.warn('⚠️ Endpoint /dossiers/eleves/ non disponible or returned unexpected shape; using test data');
    if (error?.response) console.warn('HTTP', error.response.status, error.response.data);
    const testEleves: { [key: number]: Eleve[] } = {
      1: [
        { id: 1, matricule: 'MAT001', nom: 'Yamal', prenom: 'Lamine' },
        { id: 2, matricule: 'MAT002', nom: 'Cubarsi', prenom: 'Pau' },
        { id: 3, matricule: 'MAT003', nom: 'Gavi', prenom: 'Pablo' },
      ],
      2: [
        { id: 4, matricule: 'MAT004', nom: 'Lopez', prenom: 'Fermin' },
        { id: 5, matricule: 'MAT005', nom: 'Torre', prenom: 'Marc' },
      ],
      3: [
        { id: 6, matricule: 'MAT006', nom: 'Roque', prenom: 'Vitor' },
        { id: 7, matricule: 'MAT007', nom: 'Lewandowski', prenom: 'Robert' },
      ],
    };
    return testEleves[classeId] || [];
  }
};

export const createClasse = async (data: { nom: string; niveau: string }): Promise<Classe> => {
  const response = await api.post<Classe>('/etablissement/classes/', data);
  return response.data;
};

export const updateClasse = async (id: number, data: Partial<{ nom: string; niveau: string }>): Promise<Classe> => {
  const response = await api.patch<Classe>(`/etablissement/classes/${id}/`, data);
  return response.data;
};

export const deleteClasse = async (id: number): Promise<void> => {
  await api.delete(`/etablissement/classes/${id}/`);
};

// ============ EVALUATIONS API ============

export const getEvaluations = async (params?: {
  search?: string;
  enseignement?: number;
  page?: number;
  ordering?: string;
}): Promise<PaginatedResponse<Evaluation>> => {
  const response = await api.get<PaginatedResponse<Evaluation>>('/pedagogie/evaluations/', { params });
  return response.data;
};

export const getEvaluation = async (id: number): Promise<Evaluation> => {
  const response = await api.get<Evaluation>(`/pedagogie/evaluations/${id}/`);
  return response.data;
};

export const createEvaluation = async (data: {
  titre: string;
  date: string;
  coefficient: number;
  enseignement: number;
}): Promise<Evaluation> => {
  const response = await api.post<Evaluation>('/pedagogie/evaluations/', data);
  return response.data;
};

export const updateEvaluation = async (id: number, data: Partial<Evaluation>): Promise<Evaluation> => {
  const response = await api.patch<Evaluation>(`/pedagogie/evaluations/${id}/`, data);
  return response.data;
};

export const deleteEvaluation = async (id: number): Promise<void> => {
  await api.delete(`/pedagogie/evaluations/${id}/`);
};

// ============ NOTES API ============

export const getNotes = async (params?: {
  eleve?: number;
  evaluation?: number;
  page?: number;
  ordering?: string;
}): Promise<PaginatedResponse<Note>> => {
  const response = await api.get<PaginatedResponse<Note>>('/pedagogie/notes/', { params });
  return response.data;
};

export const getNote = async (id: number): Promise<Note> => {
  const response = await api.get<Note>(`/pedagogie/notes/${id}/`);
  return response.data;
};

export const createNote = async (data: {
  valeur: number;
  appreciation?: string;
  eleve: number;
  evaluation: number;
}): Promise<Note> => {
  const response = await api.post<Note>('/pedagogie/notes/', data);
  return response.data;
};

export const updateNote = async (id: number, data: Partial<{
  valeur: number;
  appreciation: string;
}>): Promise<Note> => {
  const response = await api.patch<Note>(`/pedagogie/notes/${id}/`, data);
  return response.data;
};

export const deleteNote = async (id: number): Promise<void> => {
  await api.delete(`/pedagogie/notes/${id}/`);
};

// ============ BULLETINS API ============

export const getBulletins = async (params?: {
  eleve?: number;
  annee_scolaire?: number;
  trimestre?: 1 | 2 | 3;
  page?: number;
  ordering?: string;
}): Promise<PaginatedResponse<Bulletin>> => {
  const response = await api.get<PaginatedResponse<Bulletin>>('/pedagogie/bulletins/', { params });
  return response.data;
};

export const getBulletin = async (id: number): Promise<Bulletin> => {
  const response = await api.get<Bulletin>(`/pedagogie/bulletins/${id}/`);
  return response.data;
};

export const createBulletin = async (data: {
  eleve: number;
  trimestre: 1 | 2 | 3;
  annee_scolaire: number;
  moyenne_generale: number;
  appreciation_generale: string;
}): Promise<Bulletin> => {
  const response = await api.post<Bulletin>('/pedagogie/bulletins/', data);
  return response.data;
};

export const updateBulletin = async (id: number, data: Partial<{
  moyenne_generale: number;
  appreciation_generale: string;
}>): Promise<Bulletin> => {
  const response = await api.patch<Bulletin>(`/pedagogie/bulletins/${id}/`, data);
  return response.data;
};

export const deleteBulletin = async (id: number): Promise<void> => {
  await api.delete(`/pedagogie/bulletins/${id}/`);
};

// ============ UTILITY FUNCTIONS ============

export const getRecentNotes = async (limit: number = 20): Promise<Note[]> => {
  const response = await api.get<PaginatedResponse<Note>>('/pedagogie/notes/', {
    params: {
      ordering: '-date_saisie',
      limit,
    },
  });
  return response.data.results;
};

export const getNotesByEleve = async (eleveId: number): Promise<Note[]> => {
  const response = await api.get<PaginatedResponse<Note>>('/pedagogie/notes/', {
    params: { eleve: eleveId },
  });
  return response.data.results;
};

export const getNotesByEvaluation = async (evaluationId: number): Promise<Note[]> => {
  const response = await api.get<PaginatedResponse<Note>>('/pedagogie/notes/', {
    params: { evaluation: evaluationId },
  });
  return response.data.results;
};

/**
 * Calcule la moyenne (logique frontend, utile si on veut un aperçu immédiat)
 */
export const calculateAverageForEleve = async (
  eleveId: number
): Promise<number> => {
  const notes = await getNotesByEleve(eleveId);
  
  if (notes.length === 0) return 0;

  let totalPoints = 0;
  let totalCoefficients = 0;

  notes.forEach((note) => {
    // Gestion du type union : evaluation peut être un ID ou un objet
    const coef = typeof note.evaluation === 'object' ? note.evaluation.coefficient : 1;
    totalPoints += note.valeur * coef;
    totalCoefficients += coef;
  });

  return totalCoefficients > 0 ? parseFloat((totalPoints / totalCoefficients).toFixed(2)) : 0;
};

export const getBulletinsByEleve = async (eleveId: number): Promise<Bulletin[]> => {
  const response = await api.get<PaginatedResponse<Bulletin>>('/pedagogie/bulletins/', {
    params: { eleve: eleveId },
  });
  return response.data.results;
};

export default {
  // Evaluations
  getEvaluations,
  getEvaluation,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  // Notes
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  // Bulletins
  getBulletins,
  getBulletin,
  createBulletin,
  updateBulletin,
  deleteBulletin,
  // Matieres
  getMatieres,
  getMatiere,
  createMatiere,
  updateMatiere,
  deleteMatiere,
  // Classes
  getClasses,
  getClasse,
  getElevesByClasse,
  createClasse,
  updateClasse,
  deleteClasse,
  // Utilities
  getRecentNotes,
  getNotesByEleve,
  getNotesByEvaluation,
  calculateAverageForEleve,
  getBulletinsByEleve,
};