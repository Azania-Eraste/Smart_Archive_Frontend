/**
 * Shared TypeScript Interfaces and Types
 * 
 * This file contains type definitions that are reused across multiple services
 */

// ============ COMMON TYPES ============

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail?: string;
  [key: string]: any;
}

// ============ USER & AUTHENTICATION ============

export type UserRole = 'ADMIN' | 'SECRETAIRE' | 'EDUCATEUR' | 'PROFESSEUR' | 'PARENT';

export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
}

// ============ SCHOOL STRUCTURE ============

export interface AnneeScolaire {
  id: number;
  libelle: string;
  date_debut: string;
  date_fin: string;
  est_active: boolean;
}

export interface Niveau {
  id: number;
  nom: string;
  ordre: number;
}

export interface Classe {
  id: number;
  nom: string;
  niveau?: Niveau;
  ecole?: Ecole;
  educateur_referent?: EducateurReferent;
}

export interface Ecole {
  id: number;
  nom: string;
  ville: string;
  commune: string;
  code_postal: string;
  pays: string;
}

export interface Matiere {
  id: number;
  nom: string;
}

// ============ STUDENT DATA ============

export type EleveStatus = 'ACTIF' | 'ARCHIVE' | 'RADIE';

export interface Eleve {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  statut: EleveStatus;
  classe?: Classe;
  parents?: Parent[];
}

export interface Parent {
  id: number;
  utilisateur: {
    id: number;
    email: string;
    nom: string;
    prenom: string;
  };
  telephone: string;
  adresse: string;
}

// ============ DOCUMENTS ============

export type DocumentType = 
  | 'ACTE_NAISSANCE' 
  | 'RECU' 
  | 'DIPLOME_ANTERIEUR' 
  | 'PHOTO' 
  | 'AUTRE';

export interface Document {
  id: number;
  titre: string;
  type_document: DocumentType;
  eleve: Eleve;
  annee_scolaire: AnneeScolaire;
  fichier: string;
  date_upload: string;
}

// ============ PEDAGOGY ============

export interface Professeur {
  id: number;
  utilisateur: User;
  matricule: string;
}

export interface EducateurReferent {
  id: number;
  utilisateur: User;
  matricule: string;
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
  date: string;
  coefficient: number;
  enseignement: Enseignement;
}

export interface Note {
  id: number;
  valeur: number;
  appreciation?: string;
  eleve: Eleve;
  evaluation: {
    id: number;
    titre: string;
    date: string;
    coefficient: number;
    matiere: string;
  };
  date_saisie: string;
}

export interface Bulletin {
  id: number;
  trimestre: 1 | 2 | 3;
  moyenne_generale: number;
  appreciation_generale: string;
  eleve: Eleve;
  annee_scolaire: AnneeScolaire;
  fichier_pdf: string;
  date_generation: string;
}

// ============ REGISTRATIONS ============

export type InscriptionStatus = 'EN_ATTENTE' | 'APPROUVEE' | 'REJETEE' | 'INCOMPLET';

export interface InscriptionDemande {
  id: number;
  statut: InscriptionStatus;
  date_demande: string;
  eleve: Eleve;
  classe: Classe;
  annee_scolaire: AnneeScolaire;
  frais_inscription: number;
  documents_fournis: number[];
  notes_administratives: string;
  traitee_par: User | null;
}

// ============ REQUEST/RESPONSE TYPES ============

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
}

// ============ UTILITY TYPES ============

export interface SelectOption {
  label: string;
  value: string | number;
  color?: string;
  icon?: string;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

// ============ FILTER TYPES ============

export interface FilterParams {
  page?: number;
  search?: string;
  ordering?: string;
  [key: string]: any;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

// ============ STATUS/ROLE CONSTANTS ============

export const USER_ROLES: Record<UserRole, string> = {
  ADMIN: 'Administrateur',
  SECRETAIRE: 'Secrétaire',
  EDUCATEUR: 'Éducateur',
  PROFESSEUR: 'Professeur',
  PARENT: 'Parent',
};

export const INSCRIPTION_STATUSES: Record<InscriptionStatus, string> = {
  EN_ATTENTE: 'En attente',
  APPROUVEE: 'Approuvée',
  REJETEE: 'Rejetée',
  INCOMPLET: 'Dossier incomplet',
};

export const DOCUMENT_TYPES: Record<DocumentType, string> = {
  ACTE_NAISSANCE: 'Acte de naissance',
  RECU: 'Reçu de paiement',
  DIPLOME_ANTERIEUR: 'Diplôme antérieur',
  PHOTO: "Photo d'identité",
  AUTRE: 'Autre document',
};

export const ELEVE_STATUSES: Record<EleveStatus, string> = {
  ACTIF: 'Actif',
  ARCHIVE: 'Archivé',
  RADIE: 'Radié',
};

// ============ COLOR PALETTE ============

export const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: '#e74c3c',
  SECRETAIRE: '#f39c12',
  EDUCATEUR: '#3498db',
  PROFESSEUR: '#2ecc71',
  PARENT: '#9b59b6',
};

export const STATUS_COLORS: Record<InscriptionStatus, string> = {
  EN_ATTENTE: '#f39c12',
  APPROUVEE: '#2ecc71',
  REJETEE: '#e74c3c',
  INCOMPLET: '#e67e22',
};

export const DOCUMENT_COLORS: Record<DocumentType, string> = {
  ACTE_NAISSANCE: '#3498db',
  RECU: '#2ecc71',
  DIPLOME_ANTERIEUR: '#e74c3c',
  PHOTO: '#f39c12',
  AUTRE: '#95a5a6',
};

// ============ BADGE VARIANTS ============

export const ROLE_BADGE_VARIANTS: Record<UserRole, 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'secondary'> = {
  ADMIN: 'danger',
  SECRETAIRE: 'warning',
  EDUCATEUR: 'info',
  PROFESSEUR: 'success',
  PARENT: 'secondary',
};

export const STATUS_BADGE_VARIANTS: Record<InscriptionStatus, 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'secondary'> = {
  EN_ATTENTE: 'warning',
  APPROUVEE: 'success',
  REJETEE: 'danger',
  INCOMPLET: 'info',
};
