// src/services/authService.ts
import api from './api';
import type { User } from "./../models/User";

// On élargit temporairement le type pour accepter n'importe quelle réponse
interface LoginResponse {
  access?: string;
  refresh?: string;
  token?: string; // Peut-être que c'est ça ?
  key?: string;   // Ou ça ?
  [key: string]: any; // Pour voir toutes les clés possibles
}

// Fonction helper pour décoder un JWT et extraire le payload
const decodeJWT = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Token JWT invalide');
    
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    console.log("🔐 JWT décodé:", decoded);
    return decoded;
  } catch (error) {
    console.error("❌ Erreur lors du décodage JWT:", error);
    return null;
  }
};

// Fallback: créer un User basique à partir du JWT
const createUserFromJWT = (token: string): User | null => {
  const payload = decodeJWT(token);
  if (!payload) return null;

  // Adapter selon la structure réelle de ton JWT
  return {
    id: payload.user_id || payload.sub || payload.id,
    email: payload.email,
    prenom: payload.prenom || '',
    nom: payload.nom || '',
    role: payload.role || 'UNKNOWN',
  };
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  console.log("🚀 AUTH: Tentative de connexion...");
  
  const response = await api.post<LoginResponse>('/comptes/login/', { email, password });
  
  // --- DEBUG CRITIQUE ---
  console.log("📦 AUTH: Réponse brute reçue de Django :", response.data);
  console.log("🔑 AUTH: Clés disponibles :", Object.keys(response.data));
  // ---------------------

  // Vérification plus large
  const accessToken = response.data.access || response.data.token || response.data.key;
  const refreshToken = response.data.refresh;

  if (accessToken) {
    console.log("💾 AUTH: Token trouvé ! Sauvegarde en cours...");
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
  } else {
    console.error("❌ AUTH: Aucun token trouvé dans la réponse ! Le if est sauté.");
  }

  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    console.log("📍 Tentative d'appel à /comptes/users/me/...");
    const response = await api.get<User>('/comptes/users/me/');
    console.log("✅ Utilisateur reçu:", response.data);
    return response.data;
  } catch (error: any) {
    console.warn("⚠️ Erreur lors de l'appel à /comptes/users/me/:", error.response?.status, error.message);
    
    // Fallback: Décoder le JWT stocké localement
    console.log("📍 Fallback: extraction des données du JWT...");
    const token = localStorage.getItem('access_token');
    if (token) {
      const userFromJWT = createUserFromJWT(token);
      if (userFromJWT) {
        console.log("✅ Utilisateur extrait du JWT:", userFromJWT);
        return userFromJWT;
      }
    }
    
    // Erreur finale si fallback échoue aussi
    throw new Error("Impossible de récupérer les données utilisateur (endpoint /me/ échoué et JWT non décodable)");
  }
};

export default { login, logout, getCurrentUser };