import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import authService from './../shared/services/authService';
import type { User } from './../shared/models/User';

// 2. Définition du contrat du Contexte
export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // Helpers optionnels pour vérifier le rôle facilement dans les composants
  isProfesseur: boolean;
  isEducateur: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 3. Au chargement de l'app, on vérifie le token
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // Le token existe, on demande à Django qui est cet utilisateur
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Token invalide ou expiré");
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // 4. Fonction de connexion réelle
  const login = async (email: string, password: string) => {
    try {
      await authService.login(email, password); // Récupère le token
      const userData = await authService.getCurrentUser(); // Récupère le profil (rôle, nom...)
      setUser(userData);
    } catch (error) {
      throw error; // On renvoie l'erreur pour l'afficher dans le formulaire Login
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    window.location.href = '/login'; // Redirection brute pour nettoyer l'état
  };

  // Helpers pour simplifier les conditions dans le JSX
  const isProfesseur = user?.role === 'Professeur';
  const isEducateur = user?.role === 'Educateur';

  const value = {
    user,
    loading,
    login,
    logout,
    isProfesseur,
    isEducateur
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* On n'affiche rien tant qu'on ne sait pas si l'user est connecté */}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};