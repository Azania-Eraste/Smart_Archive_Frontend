import api from './api';

/**
 * TypeScript interfaces for Comptes API (User Accounts)
 * Based on SmartArchive API Documentation
 * Endpoint prefix: /api/comptes/
 */

// ============ INTERFACES ============

export type UserRole = 'ADMIN' | 'SECRETAIRE' | 'EDUCATEUR' | 'PROFESSEUR' | 'PARENT';

export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string; // ISO date format
  groups?: number[];
  user_permissions?: number[];
}

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

// Pagination wrapper for list responses
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ============ AUTHENTICATION API ============

/**
 * Authentifie un utilisateur et retourne les tokens JWT
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/comptes/login/', credentials);
  
  if (response.data.access) {
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
  }
  
  return response.data;
};

/**
 * Renouvelle le token d'accès avec le refresh token
 */
export const refreshToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  const response = await api.post<RefreshTokenResponse>('/comptes/token/refresh/', {
    refresh: refreshToken,
  });
  
  if (response.data.access) {
    localStorage.setItem('access_token', response.data.access);
  }
  
  return response.data;
};

/**
 * Déconnecte l'utilisateur (supprime les tokens)
 */
export const logout = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// ============ USERS API ============

/**
 * Récupère la liste des utilisateurs
 * @param params - Query parameters (search, page, ordering, etc.)
 */
export const getUsers = async (params?: {
  search?: string;
  page?: number;
  ordering?: string;
}): Promise<PaginatedResponse<User>> => {
  const response = await api.get<PaginatedResponse<User>>('/comptes/users/', { params });
  return response.data;
};

/**
 * Récupère un utilisateur spécifique
 */
export const getUser = async (id: number): Promise<User> => {
  const response = await api.get<User>(`/comptes/users/${id}/`);
  return response.data;
};

/**
 * Récupère l'utilisateur actuellement connecté
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/comptes/users/me/');
  return response.data;
};

/**
 * Crée un nouvel utilisateur
 */
export const createUser = async (data: {
  email: string;
  nom: string;
  prenom: string;
  password: string;
  role: UserRole;
  is_active: boolean;
}): Promise<User> => {
  const response = await api.post<User>('/comptes/users/', data);
  return response.data;
};

/**
 * Met à jour un utilisateur
 */
export const updateUser = async (
  id: number,
  data: Partial<{
    email: string;
    nom: string;
    prenom: string;
    password: string;
    role: UserRole;
    is_active: boolean;
    is_staff: boolean;
  }>
): Promise<User> => {
  const response = await api.patch<User>(`/comptes/users/${id}/`, data);
  return response.data;
};

/**
 * Supprime un utilisateur
 */
export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/comptes/users/${id}/`);
};

/**
 * Récupère les utilisateurs d'un rôle spécifique
 */
export const getUsersByRole = async (role: UserRole): Promise<User[]> => {
  const response = await api.get<PaginatedResponse<User>>('/comptes/users/', {
    params: { search: role },
  });
  return response.data.results.filter((u) => u.role === role);
};

/**
 * Récupère les professeurs
 */
export const getProfesseurs = async (): Promise<User[]> => {
  return getUsersByRole('PROFESSEUR');
};

/**
 * Récupère les éducateurs
 */
export const getEducateurs = async (): Promise<User[]> => {
  return getUsersByRole('EDUCATEUR');
};

/**
 * Récupère les secrétaires
 */
export const getSecretaires = async (): Promise<User[]> => {
  return getUsersByRole('SECRETAIRE');
};

/**
 * Récupère les admins
 */
export const getAdmins = async (): Promise<User[]> => {
  return getUsersByRole('ADMIN');
};

/**
 * Récupère les parents
 */
export const getParents = async (): Promise<User[]> => {
  return getUsersByRole('PARENT');
};

/**
 * Recherche des utilisateurs par email ou nom
 */
export const searchUsers = async (query: string): Promise<User[]> => {
  const response = await api.get<PaginatedResponse<User>>('/comptes/users/', {
    params: { search: query },
  });
  return response.data.results;
};

/**
 * Obtient le label d'affichage pour un rôle
 */
export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    ADMIN: 'Administrateur',
    SECRETAIRE: 'Secrétaire',
    EDUCATEUR: 'Éducateur',
    PROFESSEUR: 'Professeur',
    PARENT: 'Parent',
  };
  return labels[role] || role;
};

/**
 * Obtient la couleur pour afficher un rôle
 */
export const getRoleColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    ADMIN: '#e74c3c',
    SECRETAIRE: '#f39c12',
    EDUCATEUR: '#3498db',
    PROFESSEUR: '#2ecc71',
    PARENT: '#9b59b6',
  };
  return colors[role] || '#95a5a6';
};

/**
 * Obtient la couleur de badge pour un rôle
 */
export const getRoleBadgeColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    ADMIN: 'danger',
    SECRETAIRE: 'warning',
    EDUCATEUR: 'info',
    PROFESSEUR: 'success',
    PARENT: 'secondary',
  };
  return colors[role] || 'secondary';
};

export default {
  // Authentication
  login,
  refreshToken,
  logout,
  // Users
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUser,
  deleteUser,
  // Filters
  getUsersByRole,
  getProfesseurs,
  getEducateurs,
  getSecretaires,
  getAdmins,
  getParents,
  searchUsers,
  // Utilities
  getRoleLabel,
  getRoleColor,
  getRoleBadgeColor,
};
