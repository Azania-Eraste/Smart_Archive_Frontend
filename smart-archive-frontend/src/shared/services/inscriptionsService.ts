import api from './api';

/**
 * TypeScript interfaces for Inscriptions API (Registrations/Enrollment)
 * Based on SmartArchive API Documentation
 * Endpoint prefix: /api/inscriptions/
 */

// ============ INTERFACES ============

export type InscriptionStatus = 'EN_ATTENTE' | 'APPROUVEE' | 'REJETEE' | 'INCOMPLET';

export interface AnneeScolaire {
  id: number;
  libelle: string;
}

export interface Niveau {
  id: number;
  nom: string;
  ordre: number;
}

export interface Ecole {
  id: number;
  nom: string;
  ville: string;
  commune: string;
  code_postal: string;
  pays: string;
}

export interface Classe {
  id: number;
  nom: string;
  niveau: Niveau;
  ecole: Ecole;
}

export interface Eleve {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
}

export interface TraiteeParUser {
  id: number;
  email: string;
  nom: string;
  prenom: string;
}

export interface InscriptionDemande {
  id: number;
  statut: InscriptionStatus;
  date_demande: string; // ISO date format
  eleve: Eleve;
  classe: Classe;
  annee_scolaire: AnneeScolaire;
  frais_inscription: number;
  documents_fournis: number[]; // Array of document IDs
  notes_administratives: string;
  traitee_par: TraiteeParUser | null;
}

// Pagination wrapper for list responses
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ============ INSCRIPTIONS API ============

/**
 * Récupère la liste des inscriptions/demandes
 * @param params - Query parameters (statut, eleve, annee_scolaire, page, ordering, etc.)
 */
export const getDemandes = async (params?: {
  statut?: InscriptionStatus;
  eleve?: number;
  annee_scolaire?: number;
  page?: number;
  ordering?: string;
}): Promise<PaginatedResponse<InscriptionDemande>> => {
  const response = await api.get<PaginatedResponse<InscriptionDemande>>(
    '/inscriptions/demandes/',
    { params }
  );
  return response.data;
};

/**
 * Récupère une demande d'inscription spécifique
 */
export const getDemande = async (id: number): Promise<InscriptionDemande> => {
  const response = await api.get<InscriptionDemande>(`/inscriptions/demandes/${id}/`);
  return response.data;
};

/**
 * Crée une nouvelle demande d'inscription
 */
export const createDemande = async (data: {
  eleve: number;
  classe: number;
  annee_scolaire: number;
  statut: InscriptionStatus;
  frais_inscription: number;
  documents_fournis?: number[];
  notes_administratives?: string;
}): Promise<InscriptionDemande> => {
  const response = await api.post<InscriptionDemande>('/inscriptions/demandes/', data);
  return response.data;
};

/**
 * Met à jour une demande d'inscription
 */
export const updateDemande = async (
  id: number,
  data: Partial<{
    statut: InscriptionStatus;
    documents_fournis: number[];
    notes_administratives: string;
    traitee_par: number;
  }>
): Promise<InscriptionDemande> => {
  const response = await api.patch<InscriptionDemande>(`/inscriptions/demandes/${id}/`, data);
  return response.data;
};

/**
 * Supprime une demande d'inscription
 */
export const deleteDemande = async (id: number): Promise<void> => {
  await api.delete(`/inscriptions/demandes/${id}/`);
};

/**
 * Récupère les demandes en attente
 */
export const getDemandesEnAttente = async (): Promise<InscriptionDemande[]> => {
  const response = await api.get<PaginatedResponse<InscriptionDemande>>(
    '/inscriptions/demandes/',
    { params: { statut: 'EN_ATTENTE' } }
  );
  return response.data.results;
};

/**
 * Récupère les demandes approuvées
 */
export const getDemandesApprouvees = async (): Promise<InscriptionDemande[]> => {
  const response = await api.get<PaginatedResponse<InscriptionDemande>>(
    '/inscriptions/demandes/',
    { params: { statut: 'APPROUVEE' } }
  );
  return response.data.results;
};

/**
 * Récupère les demandes rejetées
 */
export const getDemandesRejetees = async (): Promise<InscriptionDemande[]> => {
  const response = await api.get<PaginatedResponse<InscriptionDemande>>(
    '/inscriptions/demandes/',
    { params: { statut: 'REJETEE' } }
  );
  return response.data.results;
};

/**
 * Récupère les demandes incomplètes (dossiers incomplets)
 */
export const getDemandesIncompletes = async (): Promise<InscriptionDemande[]> => {
  const response = await api.get<PaginatedResponse<InscriptionDemande>>(
    '/inscriptions/demandes/',
    { params: { statut: 'INCOMPLET' } }
  );
  return response.data.results;
};

/**
 * Récupère les demandes d'un élève spécifique
 */
export const getDemandesByEleve = async (eleveId: number): Promise<InscriptionDemande[]> => {
  const response = await api.get<PaginatedResponse<InscriptionDemande>>(
    '/inscriptions/demandes/',
    { params: { eleve: eleveId } }
  );
  return response.data.results;
};

/**
 * Récupère les demandes d'une année scolaire spécifique
 */
export const getDemandesByAnnee = async (anneeId: number): Promise<InscriptionDemande[]> => {
  const response = await api.get<PaginatedResponse<InscriptionDemande>>(
    '/inscriptions/demandes/',
    { params: { annee_scolaire: anneeId } }
  );
  return response.data.results;
};

/**
 * Approuve une demande d'inscription
 */
export const approveDemande = async (
  id: number,
  notes: string = '',
  traiteePar: number
): Promise<InscriptionDemande> => {
  return updateDemande(id, {
    statut: 'APPROUVEE',
    notes_administratives: notes,
    traitee_par: traiteePar,
  });
};

/**
 * Rejette une demande d'inscription
 */
export const rejectDemande = async (
  id: number,
  notes: string = '',
  traiteePar: number
): Promise<InscriptionDemande> => {
  return updateDemande(id, {
    statut: 'REJETEE',
    notes_administratives: notes,
    traitee_par: traiteePar,
  });
};

/**
 * Marque une demande comme dossier incomplet
 */
export const markAsIncomplete = async (
  id: number,
  notes: string = '',
): Promise<InscriptionDemande> => {
  return updateDemande(id, {
    statut: 'INCOMPLET',
    notes_administratives: notes,
  });
};

/**
 * Ajoute des documents fournis à une demande
 */
export const addDocuments = async (
  id: number,
  documentIds: number[]
): Promise<InscriptionDemande> => {
  const demande = await getDemande(id);
  const allDocuments = [...new Set([...demande.documents_fournis, ...documentIds])];
  return updateDemande(id, { documents_fournis: allDocuments });
};

/**
 * Obtient le label d'affichage pour un statut
 */
export const getStatusLabel = (status: InscriptionStatus): string => {
  const labels: Record<InscriptionStatus, string> = {
    EN_ATTENTE: 'En attente',
    APPROUVEE: 'Approuvée',
    REJETEE: 'Rejetée',
    INCOMPLET: 'Dossier incomplet',
  };
  return labels[status] || status;
};

/**
 * Obtient la couleur pour afficher un statut
 */
export const getStatusColor = (status: InscriptionStatus): string => {
  const colors: Record<InscriptionStatus, string> = {
    EN_ATTENTE: '#f39c12',
    APPROUVEE: '#2ecc71',
    REJETEE: '#e74c3c',
    INCOMPLET: '#e67e22',
  };
  return colors[status] || '#95a5a6';
};

/**
 * Obtient la couleur de badge pour un statut
 */
export const getStatusBadgeColor = (status: InscriptionStatus): string => {
  const colors: Record<InscriptionStatus, string> = {
    EN_ATTENTE: 'warning',
    APPROUVEE: 'success',
    REJETEE: 'danger',
    INCOMPLET: 'info',
  };
  return colors[status] || 'secondary';
};

/**
 * Calcule le taux de complétude d'une demande (pourcentage de documents fournis)
 */
export const calculateCompletionRate = (demande: InscriptionDemande): number => {
  const requiredDocuments = 4; // Ajustez selon vos besoins
  const providedCount = demande.documents_fournis.length;
  return Math.round((providedCount / requiredDocuments) * 100);
};

/**
 * Vérifie si une demande est prête à être approuvée (tous les documents fournis)
 */
export const isReadyForApproval = (demande: InscriptionDemande): boolean => {
  return calculateCompletionRate(demande) === 100;
};

export default {
  // Demandes
  getDemandes,
  getDemande,
  createDemande,
  updateDemande,
  deleteDemande,
  // Filters
  getDemandesEnAttente,
  getDemandesApprouvees,
  getDemandesRejetees,
  getDemandesIncompletes,
  getDemandesByEleve,
  getDemandesByAnnee,
  // Actions
  approveDemande,
  rejectDemande,
  markAsIncomplete,
  addDocuments,
  // Utilities
  getStatusLabel,
  getStatusColor,
  getStatusBadgeColor,
  calculateCompletionRate,
  isReadyForApproval,
};
