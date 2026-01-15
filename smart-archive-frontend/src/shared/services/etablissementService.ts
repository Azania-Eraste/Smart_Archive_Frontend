import api from './api';

/**
 * TypeScript interfaces for Établissement API (School Settings)
 * Based on SmartArchive API Documentation
 * Endpoint prefix: /api/etablissement/
 */

// ============ INTERFACES ============

export interface AnneeScolaire {
  id: number;
  libelle: string; // e.g., "2024-2025"
  date_debut: string; // ISO date format
  date_fin: string; // ISO date format
  est_active: boolean;
}

export interface Niveau {
  id: number;
  nom: string; // e.g., "6ème", "5ème", "4ème", etc.
  ordre: number; // Order for sorting
}

export interface Ecole {
  id: number;
  nom: string;
  ville: string;
  commune: string;
  code_postal: string;
  pays: string;
}

export interface EducateurReferent {
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
  nom: string; // e.g., "A", "B", "C1", "C2"
  ecole: Ecole;
  niveau: Niveau;
  educateur_referent: EducateurReferent;
}

export interface Matiere {
  id: number;
  nom: string;
}

// Pagination wrapper for list responses
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ============ ANNEES SCOLAIRES API ============

/**
 * Récupère la liste des années scolaires
 */
export const getAnneesScolaires = async (params?: {
  page?: number;
  ordering?: string;
}): Promise<PaginatedResponse<AnneeScolaire>> => {
  const response = await api.get('/etablissement/annees/', { params });
  const data = response.data as any;
  // Normalize backend responses: some backends return a paginated object
  // { results: [...] } while others return a plain array [ ... ]
  if (!data) return { count: 0, next: null, previous: null, results: [] };
  if (Array.isArray(data)) {
    return { count: data.length, next: null, previous: null, results: data };
  }
  if (data.results && Array.isArray(data.results)) return data as PaginatedResponse<AnneeScolaire>;
  // Fallback: attempt to coerce
  return { count: 0, next: null, previous: null, results: [] };
};

/**
 * Récupère une année scolaire spécifique
 */
export const getAnneeScolaire = async (id: number): Promise<AnneeScolaire> => {
  const response = await api.get<AnneeScolaire>(`/etablissement/annees/${id}/`);
  return response.data;
};

/**
 * Crée une nouvelle année scolaire
 */
export const createAnneeScolaire = async (data: {
  libelle: string;
  date_debut: string;
  date_fin: string;
  est_active: boolean;
}): Promise<AnneeScolaire> => {
  const response = await api.post<AnneeScolaire>('/etablissement/annees/', data);
  return response.data;
};

/**
 * Met à jour une année scolaire
 */
export const updateAnneeScolaire = async (
  id: number,
  data: Partial<{
    libelle: string;
    date_debut: string;
    date_fin: string;
    est_active: boolean;
  }>
): Promise<AnneeScolaire> => {
  const response = await api.patch<AnneeScolaire>(`/etablissement/annees/${id}/`, data);
  return response.data;
};

/**
 * Supprime une année scolaire
 */
export const deleteAnneeScolaire = async (id: number): Promise<void> => {
  await api.delete(`/etablissement/annees/${id}/`);
};

/**
 * Récupère l'année scolaire active
 */
export const getActiveAnneeScolaire = async (): Promise<AnneeScolaire | null> => {
  try {
    const resp = await getAnneesScolaires();
    const active = resp.results.find((a) => a.est_active);
    return active || null;
  } catch (err) {
    console.warn('getActiveAnneeScolaire failed', err);
    return null;
  }
};

// ============ NIVEAUX API ============

/**
 * Récupère la liste des niveaux
 */
export const getNiveaux = async (params?: {
  page?: number;
  ordering?: string;
}): Promise<PaginatedResponse<Niveau>> => {
  const response = await api.get<PaginatedResponse<Niveau>>('/etablissement/niveaux/', {
    params,
  });
  return response.data;
};

/**
 * Récupère un niveau spécifique
 */
export const getNiveau = async (id: number): Promise<Niveau> => {
  const response = await api.get<Niveau>(`/etablissement/niveaux/${id}/`);
  return response.data;
};

/**
 * Crée un nouveau niveau
 */
export const createNiveau = async (data: {
  nom: string;
  ordre: number;
}): Promise<Niveau> => {
  const response = await api.post<Niveau>('/etablissement/niveaux/', data);
  return response.data;
};

/**
 * Met à jour un niveau
 */
export const updateNiveau = async (
  id: number,
  data: Partial<{
    nom: string;
    ordre: number;
  }>
): Promise<Niveau> => {
  const response = await api.patch<Niveau>(`/etablissement/niveaux/${id}/`, data);
  return response.data;
};

/**
 * Supprime un niveau
 */
export const deleteNiveau = async (id: number): Promise<void> => {
  await api.delete(`/etablissement/niveaux/${id}/`);
};

// ============ CLASSES API ============

/**
 * Récupère la liste des classes
 * @param params - Query parameters (search, niveau, ecole, page, ordering, etc.)
 */
export const getClasses = async (params?: {
  search?: string;
  niveau?: number;
  ecole?: number;
  page?: number;
  ordering?: string;
}): Promise<PaginatedResponse<Classe>> => {
  const response = await api.get<PaginatedResponse<Classe>>('/etablissement/classes/', {
    params,
  });
  return response.data;
};

/**
 * Récupère une classe spécifique
 */
export const getClasse = async (id: number): Promise<Classe> => {
  const response = await api.get<Classe>(`/etablissement/classes/${id}/`);
  return response.data;
};

/**
 * Crée une nouvelle classe
 */
export const createClasse = async (data: {
  nom: string;
  niveau: number;
  ecole: number;
  educateur_referent: number;
}): Promise<Classe> => {
  const response = await api.post<Classe>('/etablissement/classes/', data);
  return response.data;
};

/**
 * Met à jour une classe
 */
export const updateClasse = async (
  id: number,
  data: Partial<{
    nom: string;
    niveau: number;
    ecole: number;
    educateur_referent: number;
  }>
): Promise<Classe> => {
  const response = await api.patch<Classe>(`/etablissement/classes/${id}/`, data);
  return response.data;
};

/**
 * Supprime une classe
 */
export const deleteClasse = async (id: number): Promise<void> => {
  await api.delete(`/etablissement/classes/${id}/`);
};

/**
 * Récupère les classes d'un niveau spécifique
 */
export const getClassesByNiveau = async (niveauId: number): Promise<Classe[]> => {
  const response = await api.get<PaginatedResponse<Classe>>('/etablissement/classes/', {
    params: { niveau: niveauId },
  });
  return response.data.results;
};

/**
 * Récupère les classes d'une école spécifique
 */
export const getClassesByEcole = async (ecoleId: number): Promise<Classe[]> => {
  const response = await api.get<PaginatedResponse<Classe>>('/etablissement/classes/', {
    params: { ecole: ecoleId },
  });
  return response.data.results;
};

// ============ MATIERES API ============

/**
 * Récupère la liste des matières
 */
export const getMatieres = async (params?: {
  page?: number;
  ordering?: string;
}): Promise<PaginatedResponse<Matiere>> => {
  const response = await api.get<PaginatedResponse<Matiere>>('/etablissement/matieres/', {
    params,
  });
  return response.data;
};

/**
 * Récupère une matière spécifique
 */
export const getMatiere = async (id: number): Promise<Matiere> => {
  const response = await api.get<Matiere>(`/etablissement/matieres/${id}/`);
  return response.data;
};

/**
 * Crée une nouvelle matière
 */
export const createMatiere = async (data: {
  nom: string;
}): Promise<Matiere> => {
  const response = await api.post<Matiere>('/etablissement/matieres/', data);
  return response.data;
};

/**
 * Met à jour une matière
 */
export const updateMatiere = async (
  id: number,
  data: Partial<{
    nom: string;
  }>
): Promise<Matiere> => {
  const response = await api.patch<Matiere>(`/etablissement/matieres/${id}/`, data);
  return response.data;
};

/**
 * Supprime une matière
 */
export const deleteMatiere = async (id: number): Promise<void> => {
  await api.delete(`/etablissement/matieres/${id}/`);
};

/**
 * Récupère toutes les matières (without pagination)
 */
export const getAllMatieres = async (): Promise<Matiere[]> => {
  const response = await api.get<PaginatedResponse<Matiere>>('/etablissement/matieres/');
  return response.data.results;
};

export default {
  // Années scolaires
  getAnneesScolaires,
  getAnneeScolaire,
  createAnneeScolaire,
  updateAnneeScolaire,
  deleteAnneeScolaire,
  getActiveAnneeScolaire,
  // Niveaux
  getNiveaux,
  getNiveau,
  createNiveau,
  updateNiveau,
  deleteNiveau,
  // Classes
  getClasses,
  getClasse,
  createClasse,
  updateClasse,
  deleteClasse,
  getClassesByNiveau,
  getClassesByEcole,
  // Matières
  getMatieres,
  getMatiere,
  createMatiere,
  updateMatiere,
  deleteMatiere,
  getAllMatieres,
};
