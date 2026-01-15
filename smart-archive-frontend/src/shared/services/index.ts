/**
 * API Services Index
 * 
 * This file exports all API service modules for the SmartArchive frontend.
 * Each service corresponds to a backend API module.
 * 
 * Usage:
 * import { pedagogieService, dossiersService, etc. } from '@/shared/services'
 */

export * as pedagogieService from './pedagogieService';
export * as dossiersService from './dossiersService';
export * as etablissementService from './etablissementService';
export * as comptesService from './comptesService';
export * as inscriptionsService from './inscriptionsService';
export * from './api';
export * from './authService';

// Convenience exports for direct import
export {
  // Pedagogy
  getEvaluations,
  getEvaluation,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation,
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  getBulletins,
  getBulletin,
  createBulletin,
  updateBulletin,
  deleteBulletin,
  getRecentNotes,
  getNotesByEleve,
  calculateAverageForEleve,
} from './pedagogieService';

export {
  // Dossiers
  getEleves,
  getEleve,
  createEleve,
  updateEleve,
  deleteEleve,
  getElevesByClasse,
  getActiveEleves,
  getDocuments,
  getDocument,
  uploadDocument,
  updateDocument,
  deleteDocument,
  getDocumentsByEleve,
  getDocumentsByType,
  downloadDocumentFile,
} from './dossiersService';

export {
  // Etablissement
  getAnneesScolaires,
  getAnneeScolaire,
  getActiveAnneeScolaire,
  getNiveaux,
  getNiveau,
  getClasses,
  getClasse,
  getClassesByNiveau,
  getClassesByEcole,
  getMatieres,
  getMatiere,
  getAllMatieres,
} from './etablissementService';

export {
  // Comptes
  login,
  logout,
  refreshToken,
  getCurrentUser,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getProfesseurs,
  getEducateurs,
  getSecretaires,
  getAdmins,
  getParents,
  searchUsers,
} from './comptesService';

export {
  // Inscriptions
  getDemandes,
  getDemande,
  createDemande,
  updateDemande,
  deleteDemande,
  getDemandesEnAttente,
  getDemandesApprouvees,
  getDemandesRejetees,
  getDemandesIncompletes,
  getDemandesByEleve,
  approveDemande,
  rejectDemande,
  addDocuments,
} from './inscriptionsService';
