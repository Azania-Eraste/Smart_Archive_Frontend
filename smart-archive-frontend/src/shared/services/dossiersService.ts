import api from './api';

/**
 * TypeScript interfaces for Dossiers API (Students & Documents)
 * Based on SmartArchive API Documentation
 * Endpoint prefix: /api/dossiers/
 */

// ============ INTERFACES ============

export interface Classe {
  id: number;
  nom: string;
  niveau: string;
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

export interface Eleve {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
  date_naissance: string; // ISO date format
  statut: 'ACTIF' | 'ARCHIVE' | 'RADIE';
  classe: Classe;
  parents?: Parent[];
}

export type DocumentType = 
  | 'ACTE_NAISSANCE' 
  | 'RECU' 
  | 'DIPLOME_ANTERIEUR' 
  | 'PHOTO' 
  | 'AUTRE';

export interface AnneeScolaire {
  id: number;
  libelle: string;
}

export interface Document {
  id: number;
  titre: string;
  type_document: DocumentType;
  eleve: Eleve;
  annee_scolaire: AnneeScolaire;
  fichier: string; // URL to file
  date_upload: string; // ISO date format
}

// Response shape for /dossiers/eleve/{id}/annee/
export interface EleveAnneeSummary {
  eleve_id: number;
  annees: Array<{
    id: number;
    libelle: string;
    count: number;
  }>;
}

// Pagination wrapper for list responses
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ============ ELEVES API ============

/**
 * Récupère la liste des élèves
 * @param params - Query parameters (search, classe, statut, page, ordering, etc.)
 */
export const getEleves = async (params?: {
  search?: string;
  classe?: number;
  statut?: 'ACTIF' | 'ARCHIVE' | 'RADIE';
  page?: number;
  ordering?: string;
}): Promise<PaginatedResponse<Eleve>> => {
  const response = await api.get<PaginatedResponse<Eleve>>('/dossiers/eleves/', { params });
  return response.data;
};

/**
 * Récupère un élève spécifique
 */
export const getEleve = async (id: number): Promise<Eleve> => {
  const response = await api.get<Eleve>(`/dossiers/eleves/${id}/`);
  return response.data;
};

/**
 * Crée un nouvel élève
 */
export const createEleve = async (data: {
  matricule: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  statut: 'ACTIF' | 'ARCHIVE' | 'RADIE';
  classe: number;
  parents?: number[];
}): Promise<Eleve> => {
  const response = await api.post<Eleve>('/dossiers/eleves/', data);
  return response.data;
};

/**
 * Met à jour un élève
 */
export const updateEleve = async (id: number, data: Partial<{
  matricule: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  statut: 'ACTIF' | 'ARCHIVE' | 'RADIE';
  classe: number;
  parents: number[];
}>): Promise<Eleve> => {
  const response = await api.patch<Eleve>(`/dossiers/eleves/${id}/`, data);
  return response.data;
};

/**
 * Supprime un élève
 */
export const deleteEleve = async (id: number): Promise<void> => {
  await api.delete(`/dossiers/eleves/${id}/`);
};

/**
 * Récupère les élèves d'une classe spécifique
 */
export const getElevesByClasse = async (classeId: number): Promise<Eleve[]> => {
  const response = await api.get<PaginatedResponse<Eleve>>('/dossiers/eleves/', {
    params: { classe: classeId },
  });
  return response.data.results;
};

/**
 * Récupère les élèves actifs
 */
export const getActiveEleves = async (): Promise<Eleve[]> => {
  const response = await api.get<PaginatedResponse<Eleve>>('/dossiers/eleves/', {
    params: { statut: 'ACTIF' },
  });
  return response.data.results;
};

// ============ DOCUMENTS API ============

/**
 * Récupère la liste des documents
 * @param params - Query parameters (eleve, type_document, annee_scolaire, page, etc.)
 */
export const getDocuments = async (params?: {
  eleve?: number;
  type_document?: DocumentType;
  annee_scolaire?: number;
  page?: number;
  ordering?: string;
}): Promise<PaginatedResponse<Document>> => {
  try {
    console.debug('[dossiersService.getDocuments] params:', params);
    const response = await api.get<PaginatedResponse<Document>>('/dossiers/documents/', { params });
    return response.data;
  } catch (err: any) {
    console.error('[dossiersService.getDocuments] error', err?.response?.status, err?.response?.data);
    throw err;
  }
};

/**
 * Récupère un document spécifique
 */
export const getDocument = async (id: number): Promise<Document> => {
  const response = await api.get<Document>(`/dossiers/documents/${id}/`);
  return response.data;
};

/**
 * Upload un document (multipart/form-data)
 */
export const uploadDocument = async (data: {
  eleve: number;
  titre: string;
  type_document: DocumentType;
  annee_scolaire: number;
  fichier: File;
}): Promise<Document> => {
  const formData = new FormData();
  formData.append('eleve', data.eleve.toString());
  formData.append('titre', data.titre);
  formData.append('type_document', data.type_document);
  formData.append('annee_scolaire', data.annee_scolaire.toString());
  formData.append('fichier', data.fichier);
  // Debug logging: list the keys and filenames to help diagnose server rejections
  try {
    console.debug('[dossiersService.uploadDocument] Sending FormData:', {
      eleve: data.eleve,
      titre: data.titre,
      type_document: data.type_document,
      annee_scolaire: data.annee_scolaire,
      fichierName: data.fichier?.name,
    });

    const response = await api.post<Document>('/dossiers/documents/', formData, {
      // Let the browser set Content-Type (boundary)
    });

    console.debug('[dossiersService.uploadDocument] Response:', response.status, response.data);
    return response.data;
  } catch (err: any) {
    console.error('[dossiersService.uploadDocument] error', err?.response?.status, err?.response?.data);
    throw err;
  }
};

/**
 * Met à jour un document
 */
export const updateDocument = async (id: number, data: Partial<{
  titre: string;
  type_document: DocumentType;
}>): Promise<Document> => {
  const response = await api.patch<Document>(`/dossiers/documents/${id}/`, data);
  return response.data;
};

/**
 * Supprime un document
 */
export const deleteDocument = async (id: number): Promise<void> => {
  await api.delete(`/dossiers/documents/${id}/`);
};

/**
 * Récupère tous les documents d'un élève
 */
export const getDocumentsByEleve = async (
  eleveId: number,
  options?: { annee_scolaire?: number | string; search?: string; page?: number }
): Promise<Document[]> => {
  const params: any = {};
  if (options?.annee_scolaire !== undefined) {
    const val = options.annee_scolaire;
    if (typeof val === 'number') params.annee_scolaire = val;
    else if (typeof val === 'string') {
      if (/^\d+$/.test(val)) params.annee_scolaire = Number(val);
      else console.warn("⚠️ dossiersService.getDocumentsByEleve: 'annee_scolaire' ignored because it's not a numeric id:", val);
    }
  }
  if (options?.search) params.search = options.search;
  if (options?.page) params.page = options.page;

  // Primary: use the per-eleve endpoint
  try {
    console.debug('[dossiersService.getDocumentsByEleve] GET /dossiers/eleves/{id}/documents/ params:', params);
    const response = await api.get<PaginatedResponse<Document>>(`/dossiers/eleves/${eleveId}/documents/`, { params });
    const data = (response as any).data;
    if (Array.isArray(data)) return data as Document[];
    if (data.results && Array.isArray(data.results)) return data.results;
    // If backend returns an object mapping or single result array
    return (data as any).results ?? (data as any);
  } catch (err: any) {
    console.error('[dossiersService.getDocumentsByEleve] primary per-eleve endpoint failed', err?.response?.status, err?.response?.data);
    console.debug('[dossiersService.getDocumentsByEleve] primary error object:', err);
    // Backwards-compatible fallback: try the generic documents endpoint with eleve param
    try {
      console.debug('[dossiersService.getDocumentsByEleve] trying fallback /dossiers/documents/?eleve=');
      const resp2 = await api.get<PaginatedResponse<Document>>('/dossiers/documents/', { params: { eleve: eleveId, ...params } });
      const d2 = (resp2 as any).data;
      if (Array.isArray(d2)) return d2 as Document[];
      if (d2.results && Array.isArray(d2.results)) return d2.results;
      return d2.results ?? d2;
    } catch (err2: any) {
      console.error('[dossiersService.getDocumentsByEleve] fallback generic endpoint failed', err2?.response?.status, err2?.response?.data);
      console.debug('[dossiersService.getDocumentsByEleve] fallback error object:', err2);
      throw err2 || err;
    }
  }
};

/**
 * Récupère les documents d'un type spécifique pour un élève
 */
export const getDocumentsByType = async (
  eleveId: number,
  type: DocumentType
): Promise<Document[]> => {
  const response = await api.get<PaginatedResponse<Document>>('/dossiers/documents/', {
    params: { eleve: eleveId, type_document: type },
  });
  return response.data.results;
};

/**
 * Récupère les années présentes dans les documents d'un élève
 * GET /dossiers/eleve/{eleve_id}/annee/
 */
export const getEleveAnnees = async (eleveId: number): Promise<EleveAnneeSummary> => {
  try {
    const response = await api.get<EleveAnneeSummary>(`/dossiers/eleves/${eleveId}/annee/`);
    return response.data;
  } catch (err: any) {
    // If the backend doesn't expose the per-eleve annees endpoint, fallback
    // to aggregating available documents by their `annee_scolaire` field.
    const status = err?.response?.status;
    console.warn('[dossiersService.getEleveAnnees] primary endpoint failed', status);
    console.debug('[dossiersService.getEleveAnnees] primary error object:', err);

    try {
      // First try the documented helper which already attempts per-eleve and generic endpoints
      let docs: Document[] = [];
      try {
        docs = await getDocumentsByEleve(eleveId);
      } catch (gerr: any) {
        console.warn('[dossiersService.getEleveAnnees] getDocumentsByEleve failed, will try generic /dossiers/documents/ fallback', gerr?.message || gerr);
        console.debug('[dossiersService.getEleveAnnees] getDocumentsByEleve error object:', gerr);
        // Try generic documents endpoint directly
        try {
          const resp = await api.get<PaginatedResponse<Document>>('/dossiers/documents/', { params: { eleve: eleveId } });
          const ddata: any = resp.data;
          if (Array.isArray(ddata)) docs = ddata;
          else if (ddata.results && Array.isArray(ddata.results)) docs = ddata.results;
          else docs = ddata.results ?? [];
        } catch (gerr2: any) {
          console.error('[dossiersService.getEleveAnnees] generic documents fallback failed', gerr2?.response?.status, gerr2?.response?.data);
          console.debug('[dossiersService.getEleveAnnees] generic documents fallback error object:', gerr2);
          // Give up and return empty annees instead of throwing to keep UI stable
          return { eleve_id: eleveId, annees: [] };
        }
      }

      console.debug('[dossiersService.getEleveAnnees] fallback: retrieved documents count=', Array.isArray(docs) ? docs.length : 0);
      console.debug('[dossiersService.getEleveAnnees] docs raw sample:', (docs || []).slice(0,5));

      const map = new Map<string, { id?: number; libelle: string; count: number }>();
      const list = docs || [];
      for (let idx = 0; idx < list.length; idx++) {
        const d = list[idx];
        try {
          const an = (d as any).annee_scolaire;
          if (!an) {
            const key = `__none__`;
            const prev = map.get(key);
            if (prev) prev.count += 1;
            else map.set(key, { id: undefined, libelle: 'Sans année', count: 1 });
            continue;
          }

          // Normalize different shapes: object {id, libelle}, numeric id, or string
          let key: string;
          let idVal: number | undefined;
          let libelle = '';

          if (typeof an === 'number') {
            idVal = an;
            key = String(an);
            libelle = `Année ${an}`;
          } else if (typeof an === 'string') {
            if (/^\d+$/.test(an)) {
              idVal = Number(an);
              key = an;
              libelle = `Année ${an}`;
            } else {
              key = an;
              libelle = an;
            }
          } else if (typeof an === 'object') {
            idVal = (an as any).id ?? (an as any).pk;
            key = idVal !== undefined && idVal !== null ? String(idVal) : (String((an as any).libelle ?? JSON.stringify(an)).slice(0, 40));
            libelle = (an as any).libelle ? String((an as any).libelle).trim() : (idVal ? `Année ${idVal}` : key);
          } else {
            // Fallback stringification
            key = String(an);
            libelle = key;
          }

          const prev = map.get(key);
          if (prev) prev.count += 1;
          else map.set(key, { id: idVal, libelle, count: 1 });
        } catch (itemErr) {
          console.error('[dossiersService.getEleveAnnees] error processing document at index', idx, 'doc:', d, 'error:', itemErr);
          // continue processing the rest
          continue;
        }
      }

      const annees = Array.from(map.values()).map((v) => ({ id: v.id ?? -1, libelle: v.libelle, count: v.count }));
      // sort by libelle for predictable UI
      annees.sort((a, b) => String(a.libelle).localeCompare(String(b.libelle)));
      console.debug('[dossiersService.getEleveAnnees] aggregated annees:', annees);
      return { eleve_id: eleveId, annees };
    } catch (err2: any) {
      console.error('[dossiersService.getEleveAnnees] fallback aggregation failed', err2?.response?.status, err2?.response?.data);
      console.debug('[dossiersService.getEleveAnnees] fallback aggregation error object:', err2);
      return { eleve_id: eleveId, annees: [] };
    }
  }
};

/**
 * Récupère tous les documents d'un élève pour une année scolaire donnée
 * GET /dossiers/eleves/{eleve_id}/annee/{annee_id}/
 */
export const getEleveDocumentsByAnnee = async (eleveId: number, anneeId: number): Promise<{ eleve: Eleve; annee: AnneeScolaire; count: number; documents: Document[] }> => {
  try {
    const url = `/dossiers/eleves/${eleveId}/annee/${anneeId}/`;
    console.debug('[dossiersService.getEleveDocumentsByAnnee] requesting URL:', url);
    const response = await api.get(url);
    console.debug('[dossiersService.getEleveDocumentsByAnnee] response status:', response.status);
    console.debug('[dossiersService.getEleveDocumentsByAnnee] response data sample:', response.data && (Array.isArray(response.data) ? response.data.slice(0,3) : response.data));
    return response.data;
  } catch (err: any) {
    console.error('[dossiersService.getEleveDocumentsByAnnee] error status:', (err as any)?.response?.status);
    console.debug('[dossiersService.getEleveDocumentsByAnnee] error object:', err);
    // If axios error, log request config for debugging
    try {
      console.debug('[dossiersService.getEleveDocumentsByAnnee] request config:', (err as any)?.config);
    } catch (e) {
      /* ignore */
    }
    throw err;
  }
};

/**
 * Télécharge un fichier de document
 * @param fileUrl - L'URL du fichier (fournie dans la réponse du document)
 */
export const downloadDocumentFile = async (fileUrl: string): Promise<Blob> => {
  const response = await api.get<Blob>(fileUrl, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Télécharge un ZIP du dossier élève
 */
export const downloadStudentZip = async (eleveId: number): Promise<Blob> => {
  const response = await api.get(`/dossiers/eleves/${eleveId}/download_zip/`, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Récupère des statistiques pour le dashboard
 */
export const getDashboardStats = async (): Promise<any> => {
  const response = await api.get('/dossiers/stats/');
  return response.data;
};

/**
 * Obtient le nom d'affichage du type de document
 */
export const getDocumentTypeLabel = (type: DocumentType): string => {
  const labels: Record<DocumentType, string> = {
    ACTE_NAISSANCE: 'Acte de naissance',
    RECU: 'Reçu de paiement',
    DIPLOME_ANTERIEUR: 'Diplôme antérieur',
    PHOTO: "Photo d'identité",
    AUTRE: 'Autre document',
  };
  return labels[type] || type;
};

/**
 * Obtient la couleur pour afficher un type de document
 */
export const getDocumentTypeColor = (type: DocumentType): string => {
  const colors: Record<DocumentType, string> = {
    ACTE_NAISSANCE: '#3498db',
    RECU: '#2ecc71',
    DIPLOME_ANTERIEUR: '#e74c3c',
    PHOTO: '#f39c12',
    AUTRE: '#95a5a6',
  };
  return colors[type] || '#95a5a6';
};

export default {
  // Eleves
  getEleves,
  getEleve,
  createEleve,
  updateEleve,
  deleteEleve,
  getElevesByClasse,
  getActiveEleves,
  // Documents
  getDocuments,
  getDocument,
  uploadDocument,
  updateDocument,
  deleteDocument,
  getDocumentsByEleve,
  getDocumentsByType,
  getEleveAnnees,
  getEleveDocumentsByAnnee,
  downloadDocumentFile,
  downloadStudentZip,
  getDashboardStats,
  // Utilities
  getDocumentTypeLabel,
  getDocumentTypeColor,
};