import React, { createContext, useContext, useState, type ReactNode } from 'react';

// 1. Définir les rôles possibles dans notre système
type UserRole = 'Educateur' | 'Secretaire' | 'Admin'; // (Ajoutez d'autres rôles au besoin)

// 2. Définir ce que le contexte va stocker
type AuthContextType = {
  role: UserRole | null;
  // Fonctions factices pour simuler la connexion
  loginAsEducateur: () => void;
  loginAsSecretaire: () => void;
  logout: () => void;
};

// 3. Créer le contexte
const AuthContext = createContext<AuthContextType | null>(null);

// 4. Créer le "Provider" (le composant qui fournit les données)
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Pour l'instant, nous codons en dur le rôle pour tester.
  // Normalement, ceci viendrait d'un appel API après le login.
  const [currentRole, setCurrentRole] = useState<UserRole | null>('Educateur'); // <-- CHANGEZ ICI POUR TESTER

  const loginAsEducateur = () => setCurrentRole('Educateur');
  const loginAsSecretaire = () => setCurrentRole('Secretaire');
  const logout = () => setCurrentRole(null);

  const value = {
    role: currentRole,
    loginAsEducateur,
    loginAsSecretaire,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 5. Créer un hook personnalisé pour accéder facilement au contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};